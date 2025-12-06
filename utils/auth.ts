import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/src/generated/prisma/client"
import { polar, checkout, portal } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { sendEmail } from "./nodemailer";
import { getEmailVerificationEmail } from "@/lib/emails";

const prisma = new PrismaClient()

export const polarClient = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    server: 'sandbox'
})
export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: prismaAdapter(prisma, {
        provider: 'postgresql'
    }),
    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: '9bf8a324-a628-4d49-ae9e-7d1328df261e',
                            slug: 'pro'
                        },
                        {
                            productId: '7d6434c7-6eae-4640-994a-3299cd0d4487',
                            slug: 'cv-reviewer'
                        }
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL,
                    authenticatedUsersOnly: true
                }),
                portal()
            ]
        })
    ],
    emailAndPassword: {
        requireEmailVerification: true,
        enabled: true,
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }, request) => {
            const userName = user.name || 'there';
            const { subject, text, html } = getEmailVerificationEmail(userName, url);

            void sendEmail(
                user.email,
                subject,
                text,
                html
            )
        }
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }
    }
})