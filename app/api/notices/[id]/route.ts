// app/api/notices/[id]/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
    const { id, title, content } = await req.json();

    if (!id || !title || !content) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        const notice = await prisma.notice.update({
            where: { id },
            data: { title, content },
        });
        return NextResponse.json(notice);
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'Failed to update notice' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { id } = await req.json();

    if (!id) {
        return NextResponse.json({ error: 'Missing notice ID' }, { status: 400 });
    }

    try {
        await prisma.notice.delete({
            where: { id },
        });
        return NextResponse.json(null, { status: 204 });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Failed to delete notice' }, { status: 500 });
    }
}
