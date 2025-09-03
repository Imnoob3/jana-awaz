import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  // NOTE: Supabase auth checks were removed from middleware to ensure Edge runtime compatibility.
  // If you need to restrict access, perform checks in the admin pages and redirect from there.
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
