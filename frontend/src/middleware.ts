import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;
    const isLoginPage = request.nextUrl.pathname === '/login';
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/repositories') ||
        request.nextUrl.pathname.startsWith('/activities'); // Customize as needed

    // 1. If user is logged in and tries to access login page, redirect to dashboard
    if (token && isLoginPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 2. If user is NOT logged in and tries to access protected route, redirect to login
    // Note: Since we have (protected) group, we can also check referencing that, 
    // but pathname doesn't include group name (e.g. /dashboard).
    // We'll explicitly list protected paths or assume everything EXCEPT login/public is protected.
    // Let's assume /dashboard is the main protected entry.

    const isPublicRoute = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/';

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
