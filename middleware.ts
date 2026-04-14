import { NextRequest, NextResponse } from 'next/server';

const LOCALES = ['en', 'es'];
const DEFAULT_LOCALE = 'es';
const COOKIE_NAME = 'i18next';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const response = NextResponse.next();

    if (pathname.startsWith('/en')) {
        response.cookies.set(COOKIE_NAME, 'en');
    } else {
        response.cookies.set(COOKIE_NAME, 'es');
    }

    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/locales') ||
        pathname.includes('.') ||
        request.headers.get('x-nextjs-data') ||
        request.headers.get('purpose') === 'prefetch'
    ) {
        return response;
    }


    return response;
}

export const config = {
    matcher: ['/((?!_next|api|.*\\..*).*)'],
  };