import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json()
    console.log(body)
    
    // Check for the correct event types and successful subscription
    if (
        (body.type === 'order.created' || body.type === 'order.updated') && 
        body.data.subscription?.status === 'trialing' &&
        body.data.product?.name === 'Podcast Generator Pro'
    ) {
        const userId = body.data.customer.external_id
        console.log('Updating user to Pro:', userId)
        
        try {
            await prisma.user.update({
                where: { id: userId },
                data: { isPro: true }
            })
            console.log('Successfully updated user to Pro')
            return NextResponse.json({ ok: true })
        } catch (error) {
            console.error('Failed to update user:', error)
            return NextResponse.json({ ok: false, reason: 'Database update failed', error }, { status: 500 })
        }
    }

    return NextResponse.json({ ok: false, reason: 'Not a pro subscription event' })
}