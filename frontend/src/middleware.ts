import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;
    const isLoginPage = request.nextUrl.pathname === '/login';
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/repositories') ||
        request.nextUrl.pathname.startsWith('/activities'); // Customize as needed

    if (token && isLoginPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    const isPublicRoute = request.nextUrl.pathname === '/login' ||
        request.nextUrl.pathname === '/' ||
        request.nextUrl.pathname.startsWith('/embed');

    if (!token && !isPublicRoute && !request.nextUrl.pathname.startsWith('/api') && !request.nextUrl.pathname.includes('.')) {
        // Redirect unauthenticated users to login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

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
