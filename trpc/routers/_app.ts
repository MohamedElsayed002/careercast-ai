import { z } from 'zod';
import { baseProcedure, createTRPCRouter, premiumProcedure, protectedProcedure } from '../init';
import { UTFile } from 'uploadthing/server';
import { v4 as uuid } from 'uuid';
import { utapi } from '@/utils/server';
import { createPdfBytes } from '@/utils/pdf-utils';
import { createText, generateAudio, generateImage, createDebateText, generateDebateAudio } from '@/actions';
import prisma from '@/utils/db';
import { TRPCError } from '@trpc/server';
export const appRouter = createTRPCRouter({
  getHomePodcast: baseProcedure
    .query(async () => {
      const podcasts = await prisma.podcast.findMany({
        orderBy: {
          createdAt: 'desc'
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

      const where = search
        ? {
          message: {
            contains: search,
            mode: 'insensitive' as const,
          },
          title: {
            contains: search,
            mode: 'insensitive' as const,
          },
        }
        : {};

      const [podcasts, total] = await Promise.all([
        prisma.podcast.findMany({
          where,
          orderBy: {
            createdAt: 'desc',
          },
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
              title: true,
              pdfId: true,
              imageUrl: true,
              createdAt: true,
              userId: true
            }
          }
        }
      })

      return user
    }),
  generateImage: premiumProcedure
    .input(z.object({ message: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const { message } = input

      if (!message) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'message is required' })
      }

      const user = await prisma.user.findUniqueOrThrow({
        where :{id : ctx.auth.user.id}
      })

      if(!user.isPro) {
        throw new TRPCError({code: 'FORBIDDEN',message: 'subscribe to generate image'})
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
  createPodcast: protectedProcedure
    .input(z.object({ title: z.string().min(1), message: z.string().min(1), voice1: z.string(), voice2: z.string(), image: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const { title, message, voice1, voice2, image } = input;
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

      // Generate debate text with two speakers
      const debateData = await createDebateText(message);
      
      // Generate audio for the debate
      const audioBytes = await generateDebateAudio(debateData.dialogue, voice1, voice2);

      const audioFilename = `ai-audio-${uuid()}.mp3`;
      const audioUtFile = new UTFile([audioBytes], audioFilename, { type: 'audio/mpeg' });
      const audioUpload = await utapi.uploadFiles([audioUtFile]);
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

      const pdfUpload = await utapi.uploadFiles([pdfUtFile]);
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
    })
});
// export type definition of API
export type AppRouter = typeof appRouter;