import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Lewati file statis, aset, dan favicon
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

  // 1. Deteksi Bot / Crawler / Scanner Iklan
  const isBot = /facebookexternalhit|facebot|meta-externalagent|googlebot|bingbot|slurp|crawler|spider|semrush|ahrefs|petalbot|bytespider|tiktokadsbot|tiktokbot|mediapartners-google/i.test(userAgent);
  // 2. Cek Parameter Klik Iklan Resmi
  const hasAdClick = 
    searchParams.has('fbclid') ||
    searchParams.has('gclid') ||
    searchParams.has('ttclid') ||
    searchParams.has('utm_source') ||
    searchParams.has('ad_id') ||
    searchParams.has('ref');

  const isSafeParam = searchParams.get('safe') === '1' || searchParams.get('view') === 'article';

  // Jika bot, atau permintaan artikel eksplisit, atau kunjungan langsung tanpa parameter iklan:
  // Rewrite ke WhitePage (artikel) di level server
  if (isBot || isSafeParam || (!hasAdClick && pathname === '/')) {
    return NextResponse.rewrite(new URL('/article', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
