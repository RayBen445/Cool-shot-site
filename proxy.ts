import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Get hostname from request headers
  const hostname = request.headers.get('host') || '';

  // Extract the potential subdomain
  // Example: abc123.csslab.zone.id -> subdomain = abc123
  // Example locally: abc123.localhost:3000 -> subdomain = abc123
  let subdomain = '';

  if (hostname.includes('.csslab.zone.id')) {
    subdomain = hostname.replace('.csslab.zone.id', '');
  } else if (hostname.includes('localhost') && hostname.split('.').length > 1) {
    subdomain = hostname.split('.')[0];
  }

  // Prevent routing for www or root domains
  if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
    // If a subdomain exists, rewrite to /deploy/[slug]
    url.pathname = `/deploy/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// Also export as default for Next.js 16 compatibility
export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
