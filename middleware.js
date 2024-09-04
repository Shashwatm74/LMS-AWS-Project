import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import prisma from './lib/prisma';

export async function middleware(req) {
    const token = await getToken({ req });
    const url = req.nextUrl.clone();

    // Handle anonymous access to the landing page
    if (!token) {
        if (url.pathname === '/') {
            return NextResponse.next(); // Allow access to the landing page
        }
        url.pathname = '/auth/signin'; // Redirect other routes to sign in
        return NextResponse.redirect(url);
    }

    // Fetch user from the database
    const user = await prisma.user.findUnique({
        where: { regNumber: token.regNumber },
        include: { role: true }
    });

    if (!user) {
        url.pathname = '/auth/signin';
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

    if (role.name === 'viewer' && url.pathname !== '/') {
        url.pathname = '/unauthorized';
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/superadmin/:path*', '/professor/:path*', '/student/:path*', '/'],
};
