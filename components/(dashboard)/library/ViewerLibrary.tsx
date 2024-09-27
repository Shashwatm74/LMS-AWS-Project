'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

interface Book {
    id: number;
    title: string;
    author: string;
    year: number;
    noOfCopies: number;
    edition: string;
    category: string;
    isAvailable: boolean;
}

interface LentBook {
    id: number;
    bookId: number;
    bookTitle: string;
    bookAuthor: string;
    borrowerName: string;
    borrowerRegNumber: string;
    issuedOn: string;
    returnDate: string;
}

const ViewerLibrary: React.FC = () => {
    const { data: session } = useSession();
    const [books, setBooks] = useState<Book[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [showBorrowedBooks, setShowBorrowedBooks] = useState<boolean>(false);
    const [borrowedBooks, setBorrowedBooks] = useState<LentBook[]>([]);
    const userRegNumber = session?.user.regNumber;

    useEffect(() => {
        fetchBooks();
        fetchBorrowedBooks();
    }, [selectedCategory]);

    const fetchBooks = async () => {
        const response = await fetch('/api/books');
        const data: Book[] = await response.json();
        const uniqueCategories: string[] = Array.from(new Set(data.map((book: Book) => book.category)));
        setCategories(['All', ...uniqueCategories]);
        const filteredBooks = selectedCategory === 'All' ? data : data.filter((book: Book) => book.category === selectedCategory);
        setBooks(filteredBooks);
    };

    const fetchBorrowedBooks = async () => {
        const response = await fetch('/api/books/lent');
        const data: LentBook[] = await response.json();
        setBorrowedBooks(data);
    };

    const handleBorrowBook = async (id: number) => {
        try {
            const response = await fetch('/api/books/lent', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookId: id, userRegNumber }),
            });
            if (response.ok) {
                await fetchBooks();
                await fetchBorrowedBooks();
            }
        } catch (error) {
            console.error('Error borrowing book:', error);
        }
    };

    return (
        <div className="container mx-auto py-8 min-h-screen">
            <h1 className="text-3xl text-center font-bold mb-6">Library Books</h1>

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <label htmlFor="category" className="mr-2 font-bold">Filter by Category:</label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md"
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <Button
                    onClick={() => setShowBorrowedBooks(!showBorrowedBooks)}
                    className="rounded-none bg-barn_red hover:bg-charcoal text-white"
                >
                    {showBorrowedBooks ? 'Hide Borrowed Books' : 'Show Borrowed Books'}
                </Button>
            </div>

            {showBorrowedBooks ? (
                borrowedBooks.length === 0 ? (
                    <p>No books currently borrowed.</p>
                ) : (
                    <div className='overflow-x-auto'>
                        <table className="min-w-full bg-white">
                            <thead className='bg-gray-100'>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Title</th>
                                    <th className="border border-gray-300 px-4 py-2">Author</th>
                                    <th className="border border-gray-300 px-4 py-2">Borrowed By</th>
                                    <th className="border border-gray-300 px-4 py-2">Issued On</th>
                                    <th className="border border-gray-300 px-4 py-2">Return Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrowedBooks.map((book) => (
                                    <tr key={book.id}>
                                        <td className="border border-gray-300 px-4 py-2">{book.bookTitle}</td>
                                        <td className="border border-gray-300 px-4 py-2">{book.bookAuthor}</td>
                                        <td className="border border-gray-300 px-4 py-2">{book.borrowerName}</td>
                                        <td className="border border-gray-300 px-4 py-2">{new Date(book.issuedOn).toLocaleDateString()}</td>
                                        <td className="border border-gray-300 px-4 py-2">{new Date(book.returnDate).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : books.length === 0 ? (
                <p>No books available</p>
            ) : (
                <div className='overflow-x-auto'>
                    <table className="min-w-full bg-white">
                        <thead className='bg-gray-100'>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Title</th>
                                <th className="border border-gray-300 px-4 py-2">Author</th>
                                <th className="border border-gray-300 px-4 py-2">Year</th>
                                <th className="border border-gray-300 px-4 py-2">No. of Copies</th>
                                <th className="border border-gray-300 px-4 py-2">Edition</th>
                                <th className="border border-gray-300 px-4 py-2">Category</th>
                                <th className="border border-gray-300 px-4 py-2">Status</th>
                                <th className="border border-gray-300 px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book.id}>
                                    <td className="border border-gray-300 px-4 py-2">{book.title}</td>
                                    <td className="border border-gray-300 px-4 py-2">{book.author}</td>
                                    <td className="border border-gray-300 px-4 py-2">{book.year}</td>
                                    <td className="border border-gray-300 px-4 py-2">{book.noOfCopies}</td>
                                    <td className="border border-gray-300 px-4 py-2">{book.edition}</td>
                                    <td className="border border-gray-300 px-4 py-2">{book.category}</td>
                                    <td className="border border-gray-300 px-4 py-2">{book.isAvailable ? 'Available' : 'Not Available'}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <button
                                            onClick={() => handleBorrowBook(book.id)}
                                            disabled={!book.isAvailable}
                                            className={`px-4 py-2 rounded ${!book.isAvailable ? 'bg-gray-300 cursor-not-allowed' : 'rounded- bg-barn_red hover:bg-charcoal text-white'}`}
                                        >
                                            {book.isAvailable ? 'Borrow' : 'Not Available'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ViewerLibrary;