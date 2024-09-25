import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import * as XLSX from 'xlsx';
import formidable, { File } from 'formidable';
import fs from 'fs/promises';


interface Book {
    id?: number;
    title: string;
    author: string;
    year: number;
    noOfCopies: number;
    edition: string;
    category: string;
    isAvailable: boolean;
}

export const config = {
    api: {
        bodyParser: false,
    },
};

// POST request: Bulk add/update books from file
export const POST = async (req: NextApiRequest, res: NextApiResponse) => {


    try {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(500).json({ error: 'Error parsing form data' });
            }

            const uploadedFile = files.file as File | File[]; // Explicitly cast the type
            if (!uploadedFile || Array.isArray(uploadedFile)) {
                return res.status(400).json({ error: 'Invalid file upload' });
            }

            const books = await readExcel(uploadedFile.filepath);
            const updatedBooks = await bulkAddOrUpdateBooks(books);

            // Clean up the temporary file
            await fs.unlink(uploadedFile.filepath);

            return res.status(200).json(updatedBooks);
        });
    } catch (error) {
        console.error(error);
        console.log(error)
        return res.status(500).json({ error: 'Error in bulk add/update operation' });
    }
};

const readExcel = async (filePath: string): Promise<Book[]> => {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        return parsedData as Book[];
    } catch (error) {
        console.error('Error reading Excel file:', error);
        throw new Error('Failed to read Excel file');
    }
};

const bulkAddOrUpdateBooks = async (books: Book[]) => {
    try {
        const updatedBooks = await Promise.all(
            books.map(async (book) => {
                const existing = book.id
                    ? await prisma.book.findUnique({
                        where: { id: book.id },
                    })
                    : null;

                if (existing) {
                    return await prisma.book.update({
                        where: { id: book.id },
                        data: {
                            title: book.title,
                            author: book.author,
                            year: book.year,
                            noOfCopies: book.noOfCopies,
                            edition: book.edition,
                            category: book.category,
                            isAvailable: book.isAvailable,
                        },
                    });
                } else {
                    return await prisma.book.create({
                        data: {
                            title: book.title,
                            author: book.author,
                            year: book.year,
                            noOfCopies: book.noOfCopies,
                            edition: book.edition,
                            category: book.category,
                            isAvailable: book.isAvailable,
                        },
                    });
                }
            })
        );

        return updatedBooks;
    } catch (error) {
        console.log(error)
        console.error('Error in bulk add/update operation:', error);
        throw new Error('Error in bulk add/update operation');
    }
};
