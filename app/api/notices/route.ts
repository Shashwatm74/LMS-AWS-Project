// app/api/notices/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust the path to your prisma client setup

export async function GET() {
    try {
        const notices = await prisma.notice.findMany({
            include: {
                admin: {
                    select: {
                        regNumber: true,
                    },
                },
            },
        });
        return NextResponse.json(notices);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const { title, content, regNumber, adminId } = await req.json();

    try {
        const notice = await prisma.notice.create({
            data: {
                title,
                content,
                regNumber,
                adminId,
            },
        });
        return NextResponse.json(notice, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add notice' }, { status: 500 });
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
