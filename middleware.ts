// app/middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { Token } from './types';

export async function middleware(req: NextRequest): Promise<NextResponse> {
    const token = (await getToken({ req })) as Token | null;
    const url = req.nextUrl.clone();

    // Handle anonymous access to the landing page
    if (!token) {
        if (url.pathname === '/') {
            return NextResponse.next(); // Allow access to the landing page
        }
        url.pathname = '/auth/signin'; // Redirect other routes to sign in
        return NextResponse.redirect(url);
    }

    // Fetch user from the API route
    const userRes = await fetch(`${req.nextUrl.origin}/api/getUser?regNumber=${token.regNumber}`);
    const user = await userRes.json();

    if (userRes.status !== 200 || !user) {
        url.pathname = '/signin';
        return NextResponse.redirect(url);
    }

    const { role } = user;

    // Define role-based access control
    if (url.pathname.startsWith('/admin') && role.name !== 'admin' && role.name !== 'superadmin') {
        url.pathname = '/unauthorized';
        return NextResponse.rewrite(url);
    }

    if (url.pathname.startsWith('/superadmin') && role.name !== 'superadmin') {
        url.pathname = '/unauthorized';
        return NextResponse.rewrite(url);
    }

    if (url.pathname.startsWith('/professor') && role.name !== 'professor' && role.name !== 'admin' && role.name !== 'superadmin') {
        url.pathname = '/unauthorized';
        return NextResponse.rewrite(url);
    }

    if (url.pathname.startsWith('/student') && role.name !== 'student' && role.name !== 'professor' && role.name !== 'admin' && role.name !== 'superadmin') {
        url.pathname = '/unauthorized';
        return NextResponse.rewrite(url);
    }



    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/superadmin/:path*', '/professor/:path*', '/student/:path*', '/'],
};
