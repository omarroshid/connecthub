import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Allow these routes unconditionally
  if (pathname.startsWith('/login') || pathname.startsWith('/onboarding') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }
  // TODO: Check auth state & onboarding completion
  // For now, just allow
  // You can enhance by checking cookies/Firebase Auth session
  return NextResponse.next();
  // Example to redirect:
  // return NextResponse.redirect(new URL('/login', req.url));
}
