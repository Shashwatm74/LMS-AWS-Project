import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const { title, content } = await req.json();
    const adminId = req.headers.get('admin-id'); // Fetch the admin ID from the headers

    if (!adminId || !title || !content) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        const notice = await prisma.notice.create({
            data: {
                title,
                content,
                regNumber: `notice-${Date.now()}`, // Generate a unique regNumber
                adminId,
            },
        });
        return NextResponse.json(notice, { status: 201 });
    } catch (error) {
        console.error('Failed to add notice:', error);
        return NextResponse.json({ error: 'Failed to add notice' }, { status: 500 });
    }
}

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
