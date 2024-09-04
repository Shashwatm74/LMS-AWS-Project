// app/api/user/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Ensure prisma is properly configured for server-side use
import { User } from '@/types';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const regNumber = searchParams.get('regNumber');

    if (!regNumber) {
        return NextResponse.json({ error: 'Missing registration number' }, { status: 400 });
    }

    try {
        const user: User | null = await prisma.user.findUnique({
            where: { regNumber },
            include: { role: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
