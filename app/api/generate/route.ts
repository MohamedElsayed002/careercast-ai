import { rateLimit } from '@/lib/ratelimit';
import { NextResponse } from 'next/server'


export async function POST(req: Request) {

    const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0]?.trim()

    const { success, remaining, reset } = await rateLimit.limit(ip);

    if (!success) {
        return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                'Retry-After': String(Math.ceil(reset - 1000))
            }
        })
    }

    return NextResponse.json({ ok: true, remaining })
}