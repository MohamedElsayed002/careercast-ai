// middleware.ts
import { rateLimit } from '@/lib/ratelimit';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // IP extraction: NextRequest.ip might be available depending on Next version;
  // fallback to x-forwarded-for header.
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  // Optionally skip static assets, health checks, or your own whitelisted paths
  const pathname = req.nextUrl.pathname;
  if (pathname.startsWith('/_next/') || pathname === '/health') {
    return NextResponse.next();
  }

  const { success, remaining, reset } = await rateLimit.limit(ip);

  if (!success) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil(reset / 1000)),
      },
    });
  }

  // You can attach remaining info to response headers if you like:
  const res = NextResponse.next();
  res.headers.set('X-RateLimit-Remaining', String(remaining ?? 0));
  return res;
}

export const config = {
  matcher: ['/api/:path*'] // only run middleware for /api routes (customize)
};
