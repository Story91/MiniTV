import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Redirect /.well-known/farcaster.json to /api/.well-known/farcaster
  if (request.nextUrl.pathname === '/.well-known/farcaster.json') {
    return NextResponse.rewrite(new URL('/api/.well-known/farcaster', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/.well-known/farcaster.json',
  ],
}; 