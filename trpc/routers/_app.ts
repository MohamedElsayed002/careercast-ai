import { z } from 'zod';
import { baseProcedure, createTRPCRouter, premiumProcedure, protectedProcedure } from '../init';
import { UTFile } from 'uploadthing/server';
import { v4 as uuid } from 'uuid';
import { utapi } from '@/utils/server';
import { createPdfBytes } from '@/utils/pdf-utils';
import { createText, generateAudio, generateImage } from '@/actions';
import prisma from '@/utils/db';
import { TRPCError } from '@trpc/server';
export const appRouter = createTRPCRouter({
  getAllPodcast: baseProcedure
    .query(async () => {
      const podcasts = await prisma.podcast.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        take: 4
      })
      return podcasts
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
    .input(z.object({ message: z.string().min(1), voice: z.string(), image: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const { message, voice, image } = input;
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

      const textAudio = await createText(message)
      const audioBytes = await generateAudio(textAudio, voice);

      const audioFilename = `ai-audio-${uuid()}.mp3`;
      const audioUtFile = new UTFile([audioBytes], audioFilename, { type: 'audio/mpeg' });
      const audioUpload = await utapi.uploadFiles([audioUtFile]);
      if (!audioUpload || audioUpload.length === 0) {
        throw new Error('UploadThing returned empty response for audio');
      }
      const audioUrl = audioUpload[0]?.data?.url ?? '';
      const audioId = audioUpload[0]?.data?.customId


      // for summarizing the podcast
      // const summary = await generateSummarize(textAudio);
      const pdfBytes = await createPdfBytes('Podcast Summary', textAudio ?? 'No summary generated');
      const pdfBuffer = Buffer.from(pdfBytes);
      const pdfFilename = `podcast-brief-${uuid()}.pdf`;
      const pdfUtFile = new UTFile([pdfBuffer], pdfFilename, { type: 'application/pdf' });

      const pdfUpload = await utapi.uploadFiles([pdfUtFile]);
      if (!pdfUpload || pdfUpload.length === 0) {
        throw new Error('UploadThing returned empty response for PDF');
      }
      const pdfUrl = pdfUpload[0]?.data?.url ?? '';
      const pdfId = pdfUpload[0]?.data?.customId

      await prisma.podcast.create({
        data: {
          userId,
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