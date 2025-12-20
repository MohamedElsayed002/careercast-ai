import { getSubscriptionActiveEmail, getSubscriptionCancelledEmail } from "@/lib/emails";
import prisma from "@/utils/db";
import { sendEmail } from "@/utils/nodemailer";
import { NextResponse } from "next/server";

// Product configuration
const PRODUCT_CONFIG = {
    'Podcast Generator Pro': {
        field: 'isProPodcast',
        name: 'Podcast Generator Pro'
    },
    'CV Reviewer': {
        field: 'isProCVReviewer',
        name: 'CV Reviewer'
    },
    'AI Job Application Tailor': {
        field: 'isProJobApplicationTailor',
        name: 'AI Job Application Tailor'
    }
} as const;

type ProductName = keyof typeof PRODUCT_CONFIG;

function getProductConfig(productName: string) {
    return PRODUCT_CONFIG[productName as ProductName];
}

export async function POST(req: Request) {
    const body = await req.json();
    console.log('Webhook received:', body.type);

    try {
        const productName = body.data.product?.name;
        const productConfig = getProductConfig(productName);

        console.log('32 ProductConfig',{
            productConfig,
            productName
        })

        if (!productConfig) {
            console.log('Unknown product:', productName);
            return NextResponse.json({
                ok: true,
                message: 'Product not handled'
            });
        }

        // Events that ENABLE Pro features
        if (
            body.type === 'subscription.created' ||
            body.type === 'subscription.active' ||
            body.type === 'subscription.uncanceled'
        ) {
            const userId = body.data.customer?.external_id || body.data.user_id;

            if (!userId) {
                return NextResponse.json({
                    ok: false,
                    reason: 'No user ID found'
                }, { status: 400 });
            }

            console.log(`Enabling ${productConfig.name} for user:`, userId);

            await prisma.user.update({
                where: { id: userId },
                data: {
                    [productConfig.field]: true,
                    subscriptionId: body.data.id,
                    subscriptionStatus: body.data.status,
                    subscriptionEndsAt: body.data.current_period_end
                        ? new Date(body.data.current_period_end)
                        : null,
                    customerId: body.data.customer_id || body.data.customer?.id,
                }
            });

            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                return NextResponse.json({
                    ok: false,
                    reason: 'User not found after update'
                }, { status: 404 });
            }

            const { subject, text, html } = getSubscriptionActiveEmail(
                user.name || user.email || 'User'
            );

            await sendEmail(
                user?.email || '',
                subject,
                text,
                html
            );

            return NextResponse.json({
                ok: true,
                message: `${productConfig.name} enabled`
            });
        }

        // Events that DISABLE Pro features
        if (
            body.type === 'subscription.canceled' ||
            body.type === 'subscription.revoked'
        ) {
            const userId = body.data.customer?.external_id || body.data.user_id;

            if (!userId) {
                return NextResponse.json({
                    ok: false,
                    reason: 'No user ID found'
                }, { status: 400 });
            }

            console.log(`Disabling ${productConfig.name} for user:`, userId, 'Reason:', body.type);

            await prisma.user.update({
                where: { id: userId },
                data: {
                    [productConfig.field]: false,
                    subscriptionStatus: body.data.status || 'canceled',
                    subscriptionEndsAt: body.data.ends_at
                        ? new Date(body.data.ends_at)
                        : null,
                }
            });

            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                throw new Error('Error user not found webhook');
            }

            const { subject, text, html } = getSubscriptionCancelledEmail(
                user.name || user.email || 'User'
            );
            
            await sendEmail(user?.email || '', subject, text, html);

            return NextResponse.json({
                ok: true,
                message: `${productConfig.name} disabled`
            });
        }

        // Handle refunds
        if (body.type === 'order.refunded') {
            const userId = body.data.customer?.external_id || body.data.user_id;

            if (!userId) {
                return NextResponse.json({
                    ok: false,
                    reason: 'No user ID found'
                }, { status: 400 });
            }

            console.log(`Refund processed for user: ${userId} - Product: ${productConfig.name}`);

            await prisma.user.update({
                where: { id: userId },
                data: {
                    [productConfig.field]: false,
                    subscriptionStatus: 'refunded',
                }
            });

            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            const { subject, text, html } = getSubscriptionCancelledEmail(
                user?.name || user?.email || 'User'
            );
            
            await sendEmail(user?.email || '', subject, text, html);

            return NextResponse.json({
                ok: true,
                message: `Refund processed, ${productConfig.name} disabled`
            });
        }

        // Handle successful payments
        if (body.type === 'order.paid') {
            const userId = body.data.customer?.external_id || body.data.user_id;

            if (!userId) {
                return NextResponse.json({
                    ok: false,
                    reason: 'No user ID found'
                }, { status: 400 });
            }

            console.log(`Successful payment for user: ${userId} - Product: ${productConfig.name}`);

            await prisma.user.update({
                where: { id: userId },
                data: {
                    [productConfig.field]: true,
                    subscriptionStatus: 'active',
                    lastPaymentAt: new Date(),
                }
            });

            const user = await prisma.user.findUniqueOrThrow({
                where: { id: userId }
            });

            const { subject, text, html } = getSubscriptionActiveEmail(
                user.name || user.email || 'User'
            );

            await sendEmail(
                user?.email || '',
                subject,
                text,
                html
            );

            return NextResponse.json({
                ok: true,
                message: `Payment confirmed, ${productConfig.name} enabled`
            });
        }

        // Handle subscription updates (for status changes)
        if (body.type === 'subscription.updated') {
            const userId = body.data.customer?.external_id || body.data.user_id;

            if (!userId) {
                return NextResponse.json({
                    ok: false,
                    reason: 'No user ID found'
                }, { status: 400 });
            }

            console.log(`Subscription updated for user: ${userId} - Product: ${productConfig.name} - Status:`, body.data.status);

            // Determine if user should be Pro based on status
            const activeStatuses = ['active', 'trialing'];
            const isPro = activeStatuses.includes(body.data.status);

            await prisma.user.update({
                where: { id: userId },
                data: {
                    [productConfig.field]: isPro,
                    subscriptionStatus: body.data.status,
                    subscriptionEndsAt: body.data.current_period_end
                        ? new Date(body.data.current_period_end)
                        : null,
                }
            });

            return NextResponse.json({
                ok: true,
                message: 'Subscription updated'
            });
        }

        console.log('Unhandled webhook event:', body.type);
        return NextResponse.json({
            ok: true,
            message: 'Event received but not handled'
        });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({
            ok: false,
            reason: 'Database update failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}