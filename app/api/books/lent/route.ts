import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const lentBooks = await prisma.lent.findMany({
            include: {
                book: {
                    select: {
                        title: true,
                        author: true,
                    },
                },
                User: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        const formattedLentBooks = lentBooks.map(lentBook => ({
            id: lentBook.id,
            bookId: lentBook.bookId,
            bookTitle: lentBook.book.title,
            bookAuthor: lentBook.book.author,
            borrowerName: lentBook.User.name,
            borrowerRegNumber: lentBook.regNumber,
            issuedOn: lentBook.issuedOn,
            returnDate: lentBook.returnDate,
        }));

        return new Response(JSON.stringify(formattedLentBooks), { status: 200 });
    } catch (error) {
        console.log(error); // Log the error for debugging
        return new Response(JSON.stringify({ error: 'Error fetching lent books' }), { status: 500 });
    }
}


export async function PUT(request: Request) {
    try {
        const { bookId, userRegNumber } = await request.json();

        // Fetch the book details
        const book = await prisma.book.findUnique({
            where: { id: bookId },
        });

        if (!book || book.noOfCopies <= 0) {
            return new Response(JSON.stringify({ error: 'Book is not available' }), { status: 400 });
        }

        // Calculate return date (30 days from now)
        const issuedOn = new Date();
        const returnDate = new Date(issuedOn);
        returnDate.setDate(returnDate.getDate() + 30);

        // Create a new lent record
        const lentBook = await prisma.lent.create({
            data: {
                bookId: bookId,
                regNumber: userRegNumber,
                issuedOn: issuedOn,
                returnDate: returnDate,
            },
        });

        // Decrease the number of available copies
        const updatedNoOfCopies = book.noOfCopies - 1;

        // Update the book's availability and the number of copies
        await prisma.book.update({
            where: { id: bookId },
            data: {
                noOfCopies: updatedNoOfCopies,
                isAvailable: updatedNoOfCopies > 0, // Set to false if no copies are left
            },
        });

        return new Response(JSON.stringify(lentBook), { status: 200 });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return new Response(JSON.stringify({ error: 'Error borrowing book' }), { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { lentId, bookId } = await request.json();

        // Fetch the book details
        const book = await prisma.book.findUnique({
            where: { id: bookId },
        });

        if (!book) {
            return new Response(JSON.stringify({ error: 'Book not found' }), { status: 400 });
        }

        // Delete the record from lent table
        await prisma.lent.delete({
            where: { id: lentId },
        });

        // Increase the number of available copies
        const updatedNoOfCopies = book.noOfCopies + 1;

        // Update the book's availability and the number of copies
        await prisma.book.update({
            where: { id: bookId },
            data: {
                noOfCopies: updatedNoOfCopies,
                isAvailable: true, // Mark as available since a copy has been returned
            },
        });

        return new Response(JSON.stringify({ message: 'Book returned successfully' }), { status: 200 });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return new Response(JSON.stringify({ error: 'Error returning book' }), { status: 500 });
    }
}
