import { z } from 'zod';
import { baseProcedure, createTRPCRouter, premiumProcedure, protectedProcedure } from '../init';
import { UTFile } from 'uploadthing/server';
import { v4 as uuid } from 'uuid';
import { utapi } from '@/utils/server';
import { createPdfBytes } from '@/utils/pdf-utils';
import { generateImage, createDebateText, generateDebateAudio } from '@/actions';
import prisma from '@/utils/db';
import { TRPCError } from '@trpc/server';
import { Prisma } from '@/src/generated/prisma';
import { encrypt, decrypt } from '@/lib/encryption';

export const appRouter = createTRPCRouter({
  getHomePodcast: baseProcedure
    .query(async () => {
      const podcasts = await prisma.podcast.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        where: {
          status: 'PUBLIC'
        },
        take: 4
      })
      return podcasts
    }),
getPodcastsWithPagination: baseProcedure
  .input(z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(50).default(6),
    search: z.string().optional().default(''),
  }))
  .query(async ({ input }) => {
    const { page, limit, search } = input;
    const skip = (page - 1) * limit;

    const where: Prisma.PodcastWhereInput = {
      status: "PUBLIC",
      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                message: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : {}),
    };

    const [podcasts, total] = await Promise.all([
      prisma.podcast.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.podcast.count({ where }),
    ]);

    return {
      podcasts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }),
  getUser: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await prisma.user.findFirstOrThrow({
        where: {
          id: ctx.auth.user.id
        },
        select: {
          name: true,
          isPro: true,
          podcasts: {
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              message: true,
              audioUrl: true,
              audioId: true,
              pdfUrl: true,
              status: true,
              title: true,
              pdfId: true,
              imageUrl: true,
              createdAt: true,
              userId: true,
            }
          },
          credentials: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      return user
    }),
  getUserCredentials: protectedProcedure
    .query(async ({ ctx }) => {
      const credentials = await prisma.credential.findMany({
        where: {
          userId: ctx.auth.user.id
        },
        select: {
          id: true,
          name: true,
          value: true,
          createdAt: true,
        }
      })
      return credentials
    }),
  addCredentials: protectedProcedure
    .input(z.object({
      name: z.string().min(1, "Name is required"),
      value: z.string().min(1, "Value is required"),
    }))
    .mutation(async ({ input, ctx }) => {
      const { name, value } = input

      if (!name || !value) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Name, Value, and Key are required' })
      }

      const credential = await prisma.credential.create({
        data: {
          userId: ctx.auth.user.id,
          name,
          value: encrypt(value),
        }
      })
      return credential
    }),
  deleteCredential: protectedProcedure
    .input(z.object({
      id: z.string().min(1, "Credential ID is required"),
    }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input

      if (!id) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Credential ID is required' })
      }

      await prisma.credential.delete({
        where: {
          id,
          userId: ctx.auth.user.id
        }
      })
      return { success: true }
    }),
  generateImage: premiumProcedure
    .input(z.object({ message: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const { message } = input

      if (!message) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'message is required' })
      }

      const user = await prisma.user.findUniqueOrThrow({
        where: { id: ctx.auth.user.id }
      })

      if (!user.isPro) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'subscribe to generate image' })
      }

      const imageOpenAIUrl = await generateImage(message)

      if (!imageOpenAIUrl) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'failed for generating image' })
      }

      // Fetch the image from openai url 
      const imageResponse = await fetch(imageOpenAIUrl)
      if (!imageResponse.ok) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'failed to fetch image from Openai' })
      }



      // Convert to buffer 
      const imageBuffer = await imageResponse.arrayBuffer()
      const imageBytes = new Uint8Array(imageBuffer)

      // Create UTFile and upload to UploadThing 
      const imageFilename = `generated-image-${uuid()}.png`
      const imageUtFile = new UTFile([imageBytes], imageFilename, { type: 'image/png' })

      const uploadResult = await utapi.uploadFiles([imageUtFile])

      if (!uploadResult || uploadResult.length === 0 || !uploadResult[0].data?.ufsUrl) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Failed to upload image to UploadThing'
        })
      }

      const imageUrl = uploadResult[0].data.ufsUrl

      return {
        url: imageUrl
      }

    }),
  getCredential: protectedProcedure
    .query(async ({ ctx }) => {
      const credentials = await prisma.credential.findMany({
        where: {
          userId: ctx.auth.user.id
        },
        select: {
          id: true,
          name: true
        }
      })
      return credentials
    }),
  createPodcast: protectedProcedure
    .input(z.object({
      title: z.string().min(1), message: z.string().min(1),
      duration: z.enum(["1", "5", "10", "20"]),
      voice1: z.string(),
      voice2: z.string(),
      image: z.string(),
      credential: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const { title, message, duration, voice1, voice2, image, credential } = input;
      const authUser: any = (ctx as any).auth;
      const userId: string | undefined = authUser?.user?.id ?? authUser?.id ?? authUser?.userId;
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'No user in session' });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not found' });
      }
      if (!user?.isPro && (user?.trialsUsed ?? 0) >= 3) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Trial limit reached. Please change your subscription.' });
      }

      const credentialValue = await prisma.credential.findUnique({
        where: {
          id: credential,
          userId: userId
        }
      })

      if (!credentialValue) {
        throw new TRPCError({ code: 'BAD_GATEWAY', message: "Credential Invalid" })
      }

      // Generate debate text with two speakers
      const debateData = await createDebateText(message, duration, decrypt(credentialValue?.value));

      // Generate audio for the debate
      const audioBytes = await generateDebateAudio(debateData.dialogue, voice1, voice2, decrypt(credentialValue.value));

      const audioFilename = `ai-audio-${uuid()}.mp3`;
      const audioUtFile = new UTFile([audioBytes as any], audioFilename, { type: 'audio/mpeg' });
      // Retry audio upload with exponential backoff
      let audioUpload;
      let audioUploadAttempts = 0;
      const maxAudioUploadAttempts = 3;

      while (audioUploadAttempts < maxAudioUploadAttempts) {
        try {
          audioUpload = await utapi.uploadFiles([audioUtFile]);
          if (audioUpload && audioUpload.length > 0) {
            break;
          }
        } catch (error) {
          audioUploadAttempts++;
          if (audioUploadAttempts >= maxAudioUploadAttempts) {
            console.error('Audio upload failed after retries:', error);
            throw new Error('UploadThing returned empty response for audio after retries');
          }
          // Wait before retry (exponential backoff: 1s, 2s, 4s)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, audioUploadAttempts - 1) * 1000));
        }
      }

      if (!audioUpload || audioUpload.length === 0) {
        throw new Error('UploadThing returned empty response for audio');
      }
      const audioUrl = audioUpload[0]?.data?.url ?? '';
      const audioId = audioUpload[0]?.data?.customId

      // Create transcript text from dialogue for PDF
      const transcriptText = debateData.dialogue.map(item =>
        `${item.speaker === 'SPEAKER1' ? 'Speaker 1' : 'Speaker 2'}: ${item.text}`
      ).join('\n\n');

      // for summarizing the podcast
      // const summary = await generateSummarize(transcriptText);
      const pdfBytes = await createPdfBytes('Podcast Summary', transcriptText ?? 'No summary generated');
      const pdfBuffer = Buffer.from(pdfBytes);
      const pdfFilename = `podcast-brief-${uuid()}.pdf`;
      const pdfUtFile = new UTFile([pdfBuffer], pdfFilename, { type: 'application/pdf' });

      // Retry PDF upload with exponential backoff
      let pdfUpload;
      let pdfUploadAttempts = 0;
      const maxPdfUploadAttempts = 3;

      while (pdfUploadAttempts < maxPdfUploadAttempts) {
        try {
          pdfUpload = await utapi.uploadFiles([pdfUtFile]);
          if (pdfUpload && pdfUpload.length > 0) {
            break;
          }
        } catch (error) {
          pdfUploadAttempts++;
          if (pdfUploadAttempts >= maxPdfUploadAttempts) {
            console.error('PDF upload failed after retries:', error);
            throw new Error('UploadThing returned empty response for PDF after retries');
          }
          // Wait before retry (exponential backoff: 1s, 2s, 4s)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, pdfUploadAttempts - 1) * 1000));
        }
      }

      if (!pdfUpload || pdfUpload.length === 0) {
        throw new Error('UploadThing returned empty response for PDF');
      }
      const pdfUrl = pdfUpload[0]?.data?.ufsUrl ?? '';
      const pdfId = pdfUpload[0]?.data?.customId

      await prisma.podcast.create({
        data: {
          userId,
          title: debateData.title || title,
          message,
          audioUrl,
          audioId,
          pdfUrl,
          pdfId,
          imageUrl: image,
        }
      });

      if (!user?.isPro) {
        await prisma.user.update({ where: { id: userId }, data: { trialsUsed: { increment: 1 } } });
      }

      return {
        audioId,
        pdfId,
        audioUrl,
        pdfUrl,
      };
    }),

  changePodcastStatus: protectedProcedure
    .input(z.object({
      podcastId: z.string().min(1),
      status: z.enum(['PUBLIC', 'PRIVATE'])
    }))
    .mutation(async ({ input, ctx }) => {
      const { podcastId, status } = input;

      const podcast = await prisma.podcast.findUnique({
        where: {
          id: podcastId,
          userId: ctx.auth.user.id
        }
      });
      if (!podcast) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Podcast not found' });
      }

      await prisma.podcast.update({
        where: {
          id: podcastId
        },
        data: {
          status
        }
      });

      return { success: true };
    })
});
// export type definition of API
export type AppRouter = typeof appRouter;