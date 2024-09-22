
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const notices = await prisma.notice.findMany({
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                userName: true,
            },
        });
        return new Response(JSON.stringify(notices), { status: 200 });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return new Response(JSON.stringify({ error: 'Error fetching notices' }), { status: 500 });
    }
}


// POST request: Add a new notice
export async function POST(req: Request) {
    try {
        const { title, content, userName } = await req.json();
        console.log(userName)
        const notice = await prisma.notice.create({
            data: {
                title,
                content,
                userName,
            },
        });
        return Response.json(notice, { status: 201 });
    } catch (error) {
        console.log(error)
        return Response.json({ error: 'Error creating notice' }, { status: 500 });
    }
}

// PUT request: Update an existing notice
export async function PUT(req: Request) {
    try {
        const { id, title, content } = await req.json();
        const updatedNotice = await prisma.notice.update({
            where: { id },
            data: { title, content },
        });
        return Response.json(updatedNotice, { status: 200 });
    } catch (error) {
        return Response.json({ error: 'Error updating notice' }, { status: 500 });
    }
}

// DELETE request: Delete a notice
export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        await prisma.notice.delete({
            where: { id },
        });
        return Response.json({ message: 'Notice deleted' }, { status: 200 });
    } catch (error) {
        return Response.json({ error: 'Error deleting notice' }, { status: 500 });
    }
}