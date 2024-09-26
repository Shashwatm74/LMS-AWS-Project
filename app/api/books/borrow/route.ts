import prisma from '@/lib/prisma';

export async function PATCH(req: Request) {
    try {
        const { id } = await req.json();
        const book = await prisma.book.findUnique({
            where: { id: Number(id) },
        });

        if (!book || book.noOfCopies === 0) {
            return new Response(JSON.stringify({ error: 'Book unavailable for borrowing' }), { status: 400 });
        }

        const updatedBook = await prisma.book.update({
            where: { id: Number(id) },
            data: {
                noOfCopies: book.noOfCopies - 1,
                isAvailable: book.noOfCopies - 1 > 0,
            },
        });

        return new Response(JSON.stringify(updatedBook), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Error borrowing book' }), { status: 500 });
    }
}

