// src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const AUTH_COOKIE_NAME = 'auth_token';

export default function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  const isAuth = !!token;

  const publicPlatformRoutes = [
    '/platform/calculator',
    '/en/platform/calculator',
    '/es/plataforma/calculadora',

    '/platform/auth/register',
    '/en/platform/auth/register',
    '/es/plataforma/auth/registro'
  ];

  const isLoginRoute =
    pathname === '/platform/auth/login' ||
    pathname.startsWith('/es/plataforma/auth/iniciar-sesion') ||
    pathname.startsWith('/en/platform/auth/login');

  const isProtectedRoute =
    (pathname.startsWith('/platform') ||
      pathname.startsWith('/es/plataforma') ||
      pathname.startsWith('/en/platform')) &&
    !publicPlatformRoutes.includes(pathname);

  // Si ya está autenticado y va al login, redirige a /platform
  if (isAuth && isLoginRoute) {
    return NextResponse.redirect(new URL('/platform', request.url));
  }

  // Si NO está autenticado e intenta acceder a una ruta protegida
  if (!isAuth && isProtectedRoute && !isLoginRoute) {
    return NextResponse.redirect(new URL('/platform/auth/login', request.url));
  }

  // Ejecuta el middleware de internacionalización normalmente
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_vercel|_next|.*\\..*).*)',
    '/platform/:path*',
  ],
};


