'use client';
import React, { useEffect, useState } from 'react';

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

const ViewerLibrary: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    useEffect(() => {
        fetchBooks();
    }, [selectedCategory]);

    const fetchBooks = async () => {
        const response = await fetch('/api/books');
        const data: Book[] = await response.json();
        const uniqueCategories: string[] = Array.from(new Set(data.map((book: Book) => book.category)));
        setCategories(['All', ...uniqueCategories]);
        const filteredBooks = selectedCategory === 'All' ? data : data.filter((book: Book) => book.category === selectedCategory);
        setBooks(filteredBooks);
    };

    const handleBorrowBook = async (id: number) => {
        try {
            const response = await fetch('/api/books/borrow', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });
            if (response.ok) {
                const updatedBook = await response.json();
                setBooks((prevBooks) =>
                    prevBooks.map((book) => (book.id === id ? updatedBook : book))
                );
            }
        } catch (error) {
            console.error('Error borrowing book:', error);
        }
    };

    return (
        <div className="container mx-auto py-8 min-h-screen ">
            <h1 className="text-3xl text-center font-bold mb-6">Library Books</h1>

            <div className="flex items-center mb-6">
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

            {books.length === 0 ? (
                <p>No books available</p>
            ) : (
                <div className='overflow-x-auto'>
                    <table className="min-w-full bg-white ">
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
                                            disabled={book.noOfCopies === 0}
                                            className={`px-4 py-2 rounded ${book.noOfCopies === 0 ? 'bg-gray-300 cursor-not-allowed' : 'rounded- bg-barn_red hover:bg-charcoal text-white'}`}
                                        >
                                            {book.noOfCopies === 0 ? 'Out of Stock' : 'Borrow'}
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
