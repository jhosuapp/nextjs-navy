import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'i18next';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const response = NextResponse.next();

    if (pathname.startsWith('/en')) {
        response.cookies.set(COOKIE_NAME, 'en');
    } else if(pathname.startsWith('/pt')) {
        response.cookies.set(COOKIE_NAME, 'pt');
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