import prisma from '@/lib/prisma';


export async function GET() {
    try {
        const books = await prisma.book.findMany({
            select: {
                id: true,
                title: true,
                author: true,
                year: true,
                noOfCopies: true,
                edition: true,
                category: true,
                isAvailable: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return new Response(JSON.stringify(books), { status: 200 });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return new Response(JSON.stringify({ error: 'Error fetching books' }), { status: 500 });
    }
}

//     try {
//         const url = new URL(req.url);
//         const category = url.searchParams.get('category');
//         const search = url.searchParams.get('search');

//         let whereClause: any = {};

//         if (category) {
//             whereClause.category = category;
//         }

//         if (search) {
//             whereClause.OR = [
//                 { title: { contains: search, mode: 'insensitive' } },
//                 { author: { contains: search, mode: 'insensitive' } }
//             ];
//         }

//         const books = await prisma.book.findMany({
//             where: whereClause,
//             select: {
//                 id: true,
//                 title: true,
//                 author: true,
//                 year: true,
//                 noOfCopies: true,
//                 edition: true,
//                 category: true,
//                 isAvailable: true,
//                 createdAt: true,
//                 updatedAt: true,
//             },
//         });

//         const categories = await prisma.book.groupBy({
//             by: ['category'],
//             _count: {
//                 category: true,
//             },
//         });

//         return new Response(JSON.stringify({ books, categories }), { status: 200 });
//     } catch (error) {
//         console.error(error);
//         return new Response(JSON.stringify({ error: 'Error fetching books' }), { status: 500 });
//     }
// }

// POST request: Add a new book
export async function POST(req: Request) {
    try {
        const { title, author, year, noOfCopies, edition, category, isAvailable } = await req.json();

        const book = await prisma.book.create({
            data: {
                title,
                author,
                year: Number(year),
                noOfCopies: Number(noOfCopies),
                edition,
                category,
                isAvailable: Boolean(isAvailable),
            },
        });

        return Response.json(book, { status: 201 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: 'Error creating book' }, { status: 500 });
    }
}

// PUT request: Update an existing book
export async function PUT(req: Request) {
    try {
        const { id, title, author, year, noOfCopies, edition, category, isAvailable } = await req.json();

        const updatedBook = await prisma.book.update({
            where: { id: Number(id) },
            data: {
                title,
                author,
                year: Number(year),
                noOfCopies: Number(noOfCopies),
                edition,
                category,
                isAvailable: Boolean(isAvailable),
            },
        });

        return Response.json(updatedBook, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: 'Error updating book' }, { status: 500 });
    }
}

// DELETE request: Delete a book
export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();

        await prisma.book.delete({
            where: { id: Number(id) },
        });

        return Response.json({ message: 'Book deleted' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: 'Error deleting book' }, { status: 500 });
    }
}

// PATCH request: Update book  availability
export async function PATCH(req: Request) {
    try {
        const { id, isAvailable } = await req.json();
        const updatedBook = await prisma.book.update({
            where: { id: Number(id) },
            data: { isAvailable: Boolean(isAvailable) },
        });
        return Response.json(updatedBook, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: 'Error updating book availability' }, { status: 500 });
    }
}