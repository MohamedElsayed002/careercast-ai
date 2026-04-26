
import { inngest } from "./client";
import { createPodcastPdfBytes, createPdfBytes } from "@/utils/pdf-utils";
import { createDebateText, generateSummaryAndExercise, generateDebateAudio } from "@/actions/index";
import { UTFile } from "uploadthing/server";
import { v4 as uuid } from "uuid";
import { decrypt } from "@/lib/encryption";
import prisma from "@/utils/db";
import * as Sentry from "@sentry/nextjs";
import { utapi } from "@/utils/server";
import { getPodcastGeneratedEmail } from "@/lib/emails";
import { sendEmail } from "@/utils/nodemailer";


export const generatePodcast = inngest.createFunction(
  { id: "generate-podcast", retries: 3},
  { event: "podcast/generate" },
  async ({ event, step,publish  }) => {
    const {
      userId,
      title,
      message,
      duration,
      voice1,
      voice2,
      image,
      credential: credentialSend,
      voiceSpeed = 1,
      textModel,
      audioModel
    } = event.data;


    const user = await step.run("get-user",async () => {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: userId
        }
      })
      return user
    })

    await publish({
      channel: `user:${userId}`,
      topic: "progress",
      data: {
        step: 1,
        stepName: "Get User data"
      }
    })

    const credentialValue = await step.run("get-credential", async () => {
      const credential = await prisma.credential.findUniqueOrThrow({
        where: {
          id: credentialSend,
          userId
        }
      })
      return credential
    })

    await publish({
      channel: `user:${userId}`,
      topic: 'progress',
      data: {
        step: 2,
        stepName: 'Get User Credential'
      }
    })



    if (!user) {
      throw new Error('User not found');
    }

    if (!credentialValue) {
      throw new Error('Invalid credential');
    }

    // 2. Generate debate text
    const debateData = await step.run("generate-debate", async () => {
      return createDebateText(
        message,
        duration,
        decrypt(credentialValue.value),
        textModel
      );
    });

    await publish({
      channel: `user:${userId}`,
      topic: 'progress',
      data: {
        step: 3,
        stepName:'Generate debate'
      }
    })

    // 3. Generate summary (if needed)
    let summaryData = null;
    if (duration !== "1") {
      summaryData = await step.run("generate-summary", async () => {
        return generateSummaryAndExercise(
          debateData.title,
          debateData.dialogue,
          decrypt(credentialValue.value),
          textModel
        );
      });

      await publish({
        channel: `user:${userId}`,
        topic: 'progress',
        data: {
          step: 4,
          stepName: 'Generate summary'
        }
      })
    }

    // 4. Generate audio
    const audioUpload = await step.run("generate-and-upload-audio", async () => {
      // generateDebateAudio returns a Buffer/Uint8Array — keep that local only
      const audioBytes = await generateDebateAudio(
        debateData.dialogue,
        voice1,
        voice2,
        decrypt(credentialValue.value),
        voiceSpeed,
        audioModel
      );

      await publish({
        channel: `user:${userId}`,
        topic: 'progress',
        data: {
          step: summaryData !== null ? 5 : 4,
          stepName: 'Generating audio'
        }
      })

      // create a UTFile from the local buffer and upload
      const audioFilename = `ai-audio-${uuid()}.mp3`;

      const audioUtFile = new UTFile([audioBytes as any], audioFilename, { type: "audio/mpeg" });
      const result = await utapi.uploadFiles([audioUtFile]);
      if (!result?.[0]?.data?.url) {
        throw new Error("Failed to upload audio");
      }

      return result[0].data;
    });


    // 5) UPLOAD the PDF
    const pdfUpload = await step.run("generate-and-upload-pdf", async () => {
      const transcriptText = debateData.dialogue.map(item =>
        `${item.speaker === 'SPEAKER1' ? 'Speaker 1' : 'Speaker 2'}: ${item.text}`
      ).join('\n\n');

      const summaryForPdf = typeof summaryData?.summary === 'string'
        ? { overview: summaryData?.summary ?? '', keyPoints: [], conclusion: '' }
        : (summaryData?.summary ?? { overview: '', keyPoints: [], conclusion: '' });

      const pdfBytes = summaryData
        ? await createPodcastPdfBytes({
          title: debateData.title,
          script: debateData.dialogue,
          summary: summaryForPdf,
          vocabulary: summaryData?.vocabulary,
          exercises: summaryData?.exercises
        })
        : await createPdfBytes('Podcast Summary', transcriptText);

      const pdfBuffer = Buffer.from(pdfBytes);
      const pdfFilename = `podcast-brief-${uuid()}.pdf`;
      const pdfUtFile = new UTFile([pdfBuffer], pdfFilename, { type: 'application/pdf' });

      const result = await utapi.uploadFiles([pdfUtFile]);
      if (!result?.[0]?.data?.url) {
        throw new Error('Failed to upload PDF');
      }
      return result[0].data;
    });

    await publish({
      channel: `user:${userId}`,
      topic: 'progress',
      data: {
        step: summaryData !== null ? 6 : 5,
        stepName: 'Generating PDF'
      }
    })

    // 6. Create podcast record
    const podcast = await step.run("create-podcast", async () => {
      return prisma.podcast.create({
        data: {
          userId,
          title: debateData.title || title,
          message,
          audioUrl: audioUpload.ufsUrl,
          audioId: audioUpload.customId,
          pdfUrl: pdfUpload.ufsUrl,
          pdfId: pdfUpload.customId,
          imageUrl: image,
          podcastScriptDialogue: debateData.dialogue,
          podcastSummaryConclusion: summaryData?.summary.conclusion,
          podcastSummaryKeyPoints: summaryData?.summary.keyPoints,
          podcastSummaryOverview: summaryData?.summary.overview
        }
      });
    });

    await publish({
      channel: `user:${userId}`,
      topic: 'progress',
      data: {
        step: summaryData !== null ? 7 : 6,
        stepName: 'Creating the podcast. save all info (audio, pdf)'
      }
    })


    // 7. Update user trial count if needed
    if (!user.isProPodcast) {
      await step.run("update-user-trials", async () => {
        return prisma.user.update({
          where: { id: userId },
          data: { trialsUsed: { increment: 1 } } 
        });
      });
    }

    // 8. Send email
    await step.run("send-email-notification", async () => {
      const podcastUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/community/podcast/${podcast.id}`
      const { subject,text,html} = getPodcastGeneratedEmail(
        user.name || user.email || 'User',
        podcast?.title || 'Untitled',
        podcastUrl
      )

      await sendEmail(
        user.email || '',
        subject,
        text,
        html
      )

      return {emailSent: true}
    })

    await publish({
      channel: `user:${userId}`,
      topic: 'progress',
      data: {
        step: summaryData !== null ? 8 : 7,
        stepName: 'Sending Email to user '
      }
    })

    Sentry.logger.info('Inngest_result', {
      userId,
      debateData,
      summaryData,
      user: user.email,
      duration,
      audioUrl: podcast.audioUrl,
      pdfUrl: podcast.pdfUrl,
    });

    return {
      audioId: podcast.audioId,
      pdfId: podcast.pdfId,
      audioUrl: podcast.audioUrl,
      pdfUrl: podcast.pdfUrl,
    };
  }
);