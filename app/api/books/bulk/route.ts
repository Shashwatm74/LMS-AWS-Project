import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Assuming you're using Prisma for DB interaction

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Check if the request body is an array
        if (!Array.isArray(body)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        // Iterate over the parsed records and insert them into the database
        const books = body.map((book) => ({
            year: book.year,
            noOfCopies: book.noOfCopies,
            edition: book.edition,
            category: book.category,
            title: book.title,
            author: book.author,
        }));

        // Insert the records into the database using Prisma (or any other ORM)
        const createdBooks = await prisma.book.createMany({
            data: books,
            skipDuplicates: true, // Prevent duplicate entries if needed
        });

        // Return success response
        return NextResponse.json({ message: 'Books successfully uploaded', count: createdBooks.count }, { status: 200 });

    } catch (error: any) {
        console.error('Error uploading books:', error);

        // Return error response
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
    }
}
