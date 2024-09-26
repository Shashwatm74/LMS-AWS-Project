// pages/api/books/return.ts
import prisma from '@/lib/prisma';

export async function PATCH(req: Request) {
    try {
        const { id } = await req.json();
        const book = await prisma.book.findUnique({
            where: { id: Number(id) },
        });

        if (!book) {
            return new Response(JSON.stringify({ error: 'Book not found' }), { status: 404 });
        }

        const updatedBook = await prisma.book.update({
            where: { id: Number(id) },
            data: {
                noOfCopies: book.noOfCopies + 1,
                isAvailable: true, // Book is available again
            },
        });

        return new Response(JSON.stringify(updatedBook), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Error returning book' }), { status: 500 });
    }
}
