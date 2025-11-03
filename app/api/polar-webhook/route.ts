import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    console.log('Webhook received:', body.type);
    
    try {
        // Events that ENABLE Pro features
        if (
            body.type === 'subscription.created' ||
            body.type === 'subscription.active' ||
            body.type === 'subscription.uncanceled'
        ) {
            if (body.data.product?.name === 'Podcast Generator Pro') {
                const userId = body.data.customer?.external_id || body.data.user_id;
                
                if (!userId) {
                    return NextResponse.json({ 
                        ok: false, 
                        reason: 'No user ID found' 
                    }, { status: 400 });
                }

                console.log('Enabling Pro for user:', userId);
                
                await prisma.user.update({
                    where: { id: userId },
                    data: { 
                        isPro: true,
                        subscriptionId: body.data.id,
                        subscriptionStatus: body.data.status,
                        subscriptionEndsAt: body.data.current_period_end 
                            ? new Date(body.data.current_period_end) 
                            : null,
                        customerId: body.data.customer_id || body.data.customer?.id,
                    }
                });

                return NextResponse.json({ 
                    ok: true, 
                    message: 'Pro enabled' 
                });
            }
        }

        // Events that DISABLE Pro features
        if (
            body.type === 'subscription.canceled' ||
            body.type === 'subscription.revoked'
        ) {
            console.log('52: Disabling Pro for user:', body.data.customer?.external_id || body.data.user_id);
            const userId = body.data.customer?.external_id || body.data.user_id;

            if (!userId) {
                return NextResponse.json({ 
                    ok: false, 
                    reason: 'No user ID found' 
                }, { status: 400 });
            }

            console.log('Disabling Pro for user:', userId, 'Reason:', body.type);

            await prisma.user.update({
                where: { id: userId },
                data: { 
                    isPro: false,
                    subscriptionStatus: body.data.status || 'canceled',
                    subscriptionEndsAt: body.data.ends_at 
                        ? new Date(body.data.ends_at) 
                        : null,
                }
            });

            return NextResponse.json({ 
                ok: true, 
                message: 'Pro disabled' 
            });
        }

        // Handle refunds
        if (body.type === 'order.refunded') {
            console.log('83: Refund processed for user:', body.data.customer?.external_id || body.data.user_id);
            const userId = body.data.customer?.external_id || body.data.user_id;

            if (!userId) {
                return NextResponse.json({ 
                    ok: false, 
                    reason: 'No user ID found' 
                }, { status: 400 });
            }

            console.log('Refund processed for user:', userId);

            await prisma.user.update({
                where: { id: userId },
                data: { 
                    isPro: false,
                    subscriptionStatus: 'refunded',
                }
            });

            return NextResponse.json({ 
                ok: true, 
                message: 'Refund processed, Pro disabled' 
            });
        }

        // Handle successful payments
        if (body.type === 'order.paid') {
            console.log('111: Successful payment for user:', body.data.customer?.external_id || body.data.user_id);
            if (body.data.product?.name === 'Podcast Generator Pro') {
                const userId = body.data.customer?.external_id || body.data.user_id;
                
                if (!userId) {
                    return NextResponse.json({ 
                        ok: false, 
                        reason: 'No user ID found' 
                    }, { status: 400 });
                }

                console.log('Payment confirmed for user:', userId);

                await prisma.user.update({
                    where: { id: userId },
                    data: { 
                        isPro: true,
                        subscriptionStatus: 'active',
                        lastPaymentAt: new Date(),
                    }
                });

                return NextResponse.json({ 
                    ok: true, 
                    message: 'Payment confirmed, Pro enabled' 
                });
            }
        }

        // Handle subscription updates (for status changes)
        if (body.type === 'subscription.updated') {
            console.log('142: Subscription updated for user:', body.data.customer?.external_id || body.data.user_id);
            const userId = body.data.customer?.external_id || body.data.user_id;

            if (!userId) {
                return NextResponse.json({ 
                    ok: false, 
                    reason: 'No user ID found' 
                }, { status: 400 });
            }

            console.log('Subscription updated for user:', userId, 'Status:', body.data.status);

            // Determine if user should be Pro based on status
            const activeStatuses = ['active', 'trialing'];
            const isPro = activeStatuses.includes(body.data.status);

            await prisma.user.update({
                where: { id: userId },
                data: { 
                    isPro,
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