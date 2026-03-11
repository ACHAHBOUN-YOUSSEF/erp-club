// middleware.ts ← REMPLACEZ votre code
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  
  // ✅ SEULEMENT /login et / est publique
  const publicRoutes = ['/', '/login'];
  
  // 1. Connecté sur page publique → Dashboard
  if (publicRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/adherents', request.url));
  }
  
  // 2. TOUT LE RESTE (sauf /login) REQUIERT token
  if (!publicRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
