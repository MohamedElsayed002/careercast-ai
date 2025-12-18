import { z } from 'zod';
import { adminProcedure, baseProcedure, createTRPCRouter, cvReviewerProcedure, premiumProcedure, protectedProcedure } from '../init';
import { UTFile } from 'uploadthing/server';
import { v4 as uuid } from 'uuid';
import { utapi } from '@/utils/server';
import { generateImage } from '@/actions';
import prisma from '@/utils/db';
import { TRPCError } from '@trpc/server';
import { Prisma } from '@/src/generated/prisma';
import { encrypt } from '@/lib/encryption';
import { inngest } from '@/inngest/client';
import { analyzeCVMatchFree, analyzeCVMatchPro, CVReviewFreeTier, CVReviewProTier } from '@/actions/cv-reviewer';

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
          id: true,
          name: true,
          email: true,
          image: true,
          emailVerified: true,
          role: true,
          isProPodcast: true,
          isProCVReviewer: true,
          trialsUsed: true,
          subscriptionId: true,
          subscriptionStatus: true,
          subscriptionEndsAt: true,
          customerId: true,
          lastPaymentAt: true,
          createdAt: true,
          updatedAt: true,
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
  updateUser: protectedProcedure
    .input(z.object({
      name: z.string().min(1).optional(),
      image: z.string().url().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const updateData: { name?: string; image?: string } = {}

      if (input.name !== undefined) {
        updateData.name = input.name
      }

      if (input.image !== undefined) {
        updateData.image = input.image
      }

      if (Object.keys(updateData).length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'At least one field (name or image) must be provided'
        })
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: ctx.auth.user.id
        },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          emailVerified: true,
          role: true,
          isProPodcast: true,
          isProCVReviewer: true,
          trialsUsed: true,
          subscriptionId: true,
          subscriptionStatus: true,
          subscriptionEndsAt: true,
          customerId: true,
          lastPaymentAt: true,
          createdAt: true,
          updatedAt: true,
        }
      })

      return updatedUser
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
    .input(z.object({
      message: z.string().min(1),
      credential: z.string().min(1),
      imageModel: z.string().min(1)
    }))
    .mutation(async ({ input, ctx }) => {
      const { message, credential, imageModel } = input

      if (!message) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'message is required' })
      }

      const user = await prisma.user.findUniqueOrThrow({
        where: { id: ctx.auth.user.id }
      })

      if (!user.isProPodcast) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'subscribe to generate image' })
      }

      const imageOpenAIUrl = await generateImage(message, credential, imageModel)

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
      credential: z.string(),
      voiceSpeed: z.number().min(0.8).max(1.5).optional(),
      audioModel: z.string(),
      textModel: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const authUser = ctx.auth;
      const userId: string | undefined = authUser?.user?.id
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'No user in session' });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not found' });
      }
      if (!user?.isProPodcast && (user?.trialsUsed ?? 0) >= 3) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Trial limit reached. Please change your subscription.' });
      }

      await inngest.send({
        name: 'podcast/generate',
        data: {
          userId,
          ...input
        }
      })

      return {
        success: "true",
        message: "podcast generating"
      }
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
    }),

  // Admin procedures can be added here
  allUsers: adminProcedure
    .query(async () => {
      const users = await prisma.user.findMany({
        select: {
          name: true,
          email: true,
          id: true,
          role: true,
          isProPodcast: true,
          _count: {
            select: {
              podcasts: true
            }
          }
        }
      })
      return users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPro: user.isProPodcast,
        podcasts: user._count.podcasts
      }))
    }),
  adminDashboardStats: adminProcedure
    .query(async () => {
      const totalUsers = await prisma.user.count()
      const totalPodcasts = await prisma.podcast.count()
      const proUsers = await prisma.user.count({
        where: {
          isProPodcast: true
        }
      })
      const freeUsers = totalUsers - proUsers

      return {
        totalUsers,
        totalPodcasts,
        proUsers,
        freeUsers
      }
    }),
  deleteUser: adminProcedure
    .input(z.object({
      userId: z.string().min(1)
    }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = input

      if (ctx.auth.user.id === userId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'you can not delete yourself.' })
      }

      await prisma.user.delete({
        where: {
          id: userId
        }
      })
      return { success: true }
    }),
  getUserByAdmin: adminProcedure
    .input(z.object({
      userId: z.string().min(1)
    }))
    .query(async ({ input }) => {
      const { userId } = input
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })
      return user
    }),
  getUserPodcastsPublic: adminProcedure
    .input(z.object({
      userId: z.string().min(1)
    }))
    .query(async ({ input }) => {
      const { userId } = input
      const userPodcasts = await prisma.podcast.findMany({
        where: {
          userId: userId,
          status: 'PUBLIC'
        },
      })
      return userPodcasts
    }),

  // Get Single Podcast 
  singlePodcast: baseProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ input }) => {
      const { id } = input
      return prisma.podcast.findUniqueOrThrow({
        where: {
          id: id
        }
      })
    }),

  // Get podcosts count
  podcastsCount: baseProcedure.query(() => {
    return prisma.podcast.count()
  }),

  // Generate CV Review 
  generateCVReview: cvReviewerProcedure
    .input(z.object({
      cvText: z.string(),
      jobDescription: z.string(),
      credential: z.string(),
      provider: z.enum(['openai', 'gemini']).default('openai')
    }))
    .mutation(async ({ input, ctx }) => {
      const { cvText, jobDescription, credential, provider } = input

      if (!cvText || !jobDescription || !credential) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: "CV Text, Job Description, and Credential are required"
        })
      }

      // Validate credential belongs to user
      const credentialValue = await prisma.credential.findUnique({
        where: {
          id: credential,
          userId: ctx.auth.user.id
        }
      })

      if (!credentialValue) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: "Invalid credential or credential does not belong to user"
        })
      }

      try {
        let response

        if (ctx.user?.isProCVReviewer) {
          // PRO USER → always use premium analyze
          response = await analyzeCVMatchPro(cvText, jobDescription, credential, provider)

        } else {
          // NOT PRO USER → check free trials
          if (ctx.user && ctx.user.trialsUsed < 3) {

            // still have free trials
            response = await analyzeCVMatchFree(cvText, jobDescription, credential, provider)

            await prisma.user.update({
              where: { id: ctx.auth.user.id },
              data: {
                trialsUsed: {
                  increment: 1,
                },
              },
            })

          } else {
            // no free trials left
            throw new TRPCError({
              code: "BAD_GATEWAY",
              message: "You exceeded the number of free trials",
            })
          }
        }

        // Check if the AI analysis was successful
        if (!response.success || !response.analysis) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "AI service is temporarily unavailable. Please try again in a few moments or try a different AI provider.",
          })
        }

        await prisma.cVReviewer.create({
          data: {
            review: response.analysis,
            user: {
              connect: { id: ctx.auth.user.id }
            }
          }
        })

        return response.analysis

      } catch (error) {
        // Re-throw TRPCError as-is
        if (error instanceof TRPCError) {
          throw error
        }

        // Handle other errors with a user-friendly message
        console.error("CV Review Error:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to analyze CV. The AI service may be temporarily unavailable. Please try again later or try a different AI provider.",
        })
      }
    }),

  getUserCVReview: protectedProcedure
    .query(async ({ ctx }) => {
      const reviews = await prisma.cVReviewer.findMany({
        where: {
          userId: ctx.auth.user.id
        },
        orderBy: {
          id: 'desc'
        }
      })

      return reviews
    }),
  getUserSingleReview: protectedProcedure
    .input(z.object({
      reviewId: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const { reviewId } = input

      const review = await prisma.cVReviewer.findFirstOrThrow({
        where: {
          id: reviewId,
          userId: ctx.auth.user.id
        }
      })
      return review
    }),

  sendMessages: baseProcedure
    .input(z.object({
      name: z.string(),
      email: z.string(),
      subject: z.string(),
      message: z.string()
    }))
    .mutation(async ({ input }) => {
      const { name, email, subject, message } = input

      await prisma.messages.create({
        data: {
          name, email, subject, message
        }
      })

      return {
        response: "success"
      }
    }),
  getMessages: adminProcedure
    .query(async () => {
      return prisma.messages.findMany()
    })
});

export type AppRouter = typeof appRouter;