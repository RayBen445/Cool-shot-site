import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  
  // Extract subdomain for deployment routing
  let subdomain = ''
  
  if (hostname.includes('.csslab.zone.id')) {
    subdomain = hostname.replace('.csslab.zone.id', '')
  } else if (hostname.includes('localhost') && hostname.split('.').length > 1) {
    subdomain = hostname.split('.')[0]
  }
  
  // Route subdomain requests to deployment pages
  if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
    url.pathname = `/deploy/${subdomain}`
    return NextResponse.rewrite(url)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
