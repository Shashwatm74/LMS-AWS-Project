// app/api/notices/[id]/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    // Get the notice ID from the URL
    const { pathname } = new URL(req.url);
    const id = parseInt(pathname.split('/').pop() || '', 10);

    if (isNaN(id)) {
        return NextResponse.json({ error: 'Invalid notice ID' }, { status: 400 });
    }

    try {
        const notice = await prisma.notice.findUnique({
            where: { id },
            include: {
                admin: {
                    select: {
                        regNumber: true,
                    },
                },
            },
        });
        if (!notice) {
            return NextResponse.json({ error: 'Notice not found' }, { status: 404 });
        }
        return NextResponse.json(notice);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch notice' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const { id, title, content } = await req.json();

    try {
        const notice = await prisma.notice.update({
            where: { id },
            data: { title, content },
        });
        return NextResponse.json(notice);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update notice' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { id } = await req.json();

    try {
        await prisma.notice.delete({
            where: { id },
        });
        return NextResponse.json(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete notice' }, { status: 500 });
    }
}
