import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, Plus, Upload, Eye } from 'lucide-react';
import { useSession } from 'next-auth/react';
import * as XLSX from 'xlsx';

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
    regNumber: string;
    issuedOn: string;
    returnDate: string;
    bookTitle: string;
    book: Book;
    borrowerName: string;
    User: {
        name: string;
    };
}
const AdminLibrary: React.FC = () => {
    const { data: session } = useSession();
    const [books, setBooks] = useState<Book[]>([]);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [showLentBooks, setShowLentBooks] = useState(false);
    const [lentBooks, setLentBooks] = useState<LentBook[]>([]);

    useEffect(() => {
        fetchBooks();
        fetchLentBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch('/api/books');
            if (!response.ok) throw new Error('Failed to fetch books');
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            setError('Error fetching books');
        }
    };
    // Fetch lent books from the API
    const fetchLentBooks = async () => {
        try {
            const response = await fetch('/api/books/lent');
            if (!response.ok) throw new Error('Failed to fetch lent books');
            const data = await response.json();
            setLentBooks(data);
        } catch (error) {
            setError('Error fetching lent books');
        }
    };

    const returnBook = async (lentId: number, bookId: number) => {
        try {
            const response = await fetch('/api/books/lent', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ lentId, bookId }),
            });

            if (!response.ok) throw new Error('Failed to return book');

            // Refetch the books after returning one
            fetchLentBooks();
        } catch (error) {
            setError('Error returning book');
        }
    };
    const renderLentBooksTable = () => (
        <div className="overflow-x-auto mt-4">
            <h2 className="text-xl font-bold mb-2">Lent Books</h2>
            {lentBooks.length === 0 ? (
                <p>No lent books found.</p>
            ) : (
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b">Book Title</th>
                            <th className="py-2 px-4 border-b">Borrowed By</th>
                            <th className="py-2 px-4 border-b">Issued On</th>
                            <th className="py-2 px-4 border-b">Return Date</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lentBooks.map((lentBook) => (
                            <tr key={lentBook.id}>
                                <td className="py-2 px-4 border-b">{lentBook.bookTitle}</td>
                                <td className="py-2 px-4 border-b">{lentBook.borrowerName}</td>
                                <td className="py-2 px-4 border-b">
                                    {new Date(lentBook.issuedOn).toLocaleDateString()}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {new Date(lentBook.returnDate).toLocaleDateString()}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => returnBook(lentBook.id, lentBook.bookId)}
                                        className="rounded-none bg-barn_red hover:bg-charcoal text-white  py-1"
                                    >
                                        Return Book
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
    // const renderLentBooksTable = () => (
    //     <div className="overflow-x-auto mt-4">
    //         <h2 className="text-xl font-bold mb-2">Lent Books</h2>
    //         {lentBooks.length === 0 ? (
    //             <p>No lent books found.</p>
    //         ) : (
    //             <table className="min-w-full bg-white">
    //                 <thead className="bg-gray-100">
    //                     <tr>
    //                         <th className="py-2 px-4 border-b">Book Title</th>
    //                         <th className="py-2 px-4 border-b">Borrowed By</th>
    //                         <th className="py-2 px-4 border-b">Issued On</th>
    //                         <th className="py-2 px-4 border-b">Return Date</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     {lentBooks.map((lentBook) => (
    //                         <tr key={lentBook.id}>
    //                             <td className="py-2 px-4 border-b">{lentBook.bookTitle}</td>
    //                             <td className="py-2 px-4 border-b">{lentBook.borrowerName}</td>
    //                             <td className="py-2 px-4 border-b">
    //                                 {new Date(lentBook.issuedOn).toLocaleDateString()}
    //                             </td>
    //                             <td className="py-2 px-4 border-b">
    //                                 {new Date(lentBook.returnDate).toLocaleDateString()}
    //                             </td>
    //                         </tr>
    //                     ))}
    //                 </tbody>
    //             </table>
    //         )}
    //     </div>
    // );


    const handleAddOrUpdateBook = async () => {
        if (!editingBook) return;
        try {
            const url = editingBook.id ? `/api/books` : '/api/books';
            const method = editingBook.id ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingBook),
            });
            if (!response.ok) throw new Error('Failed to save book');
            setEditingBook(null);
            fetchBooks();
        } catch (error) {
            setError('Error saving book');
        }
    };

    const handleDeleteBook = async (id: number) => {
        try {
            const response = await fetch(`/api/books`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (!response.ok) throw new Error('Failed to delete book');
            setConfirmDeleteId(null);
            fetchBooks();
        } catch (error) {
            setError('Error deleting book');
        }
        fetchBooks()
    };

    const handleToggleAvailability = async (id: number, currentAvailability: boolean) => {
        try {
            const response = await fetch(`/api/books`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isAvailable: !currentAvailability }),
            });
            if (!response.ok) throw new Error('Failed to update book availability');
            fetchBooks();
        } catch (error) {
            setError('Error updating book availability');
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return; // Exit if no file is uploaded

        setIsUploading(true); // Set the uploading state to true

        try {
            // Parse the Excel file using XLSX
            const data = await file.arrayBuffer(); // Read file as ArrayBuffer
            const workbook = XLSX.read(data, { type: 'array' }); // Parse the Excel data

            // Assuming the data is in the first sheet
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert the sheet data to JSON format with the specific headers
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            // Filter out rows where any of the required fields are missing
            const validRecords = jsonData.filter((record: any) =>
                record.year && record.noOfCopies && record.edition && record.category && record.title && record.author && record.borrow
            );

            if (validRecords.length === 0) {
                throw new Error('No valid records to upload');
            }

            // Send the parsed and filtered records to the backend API as JSON
            const response = await fetch('/api/books/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Specify content type
                },
                body: JSON.stringify(validRecords), // Send the valid records as JSON
            });

            if (!response.ok) {
                throw new Error('Failed to upload data');
            } else {
                fetchBooks()
            }

            // const result = await response.json();
            // console.log('Bulk upload result:', result);


        } catch (error) {
            console.error('Upload error:', error);
            setError('Error uploading file: ' + error); // Set error message
        } finally {
            setIsUploading(false); // Set the uploading state to false
        }
    };
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };




    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Button onClick={() => setEditingBook({ id: 0, title: '', author: '', year: new Date().getFullYear(), noOfCopies: 1, edition: '', category: '', isAvailable: true })} className="rounded-none bg-barn_red hover:bg-charcoal">
                    <Plus className="w-4 h-4 mr-2" /> Add New Book
                </Button>
                <div className="flex items-center">
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                    <Button onClick={triggerFileInput} disabled={isUploading} className="rounded-none bg-barn_red hover:bg-charcoal">
                        <Upload className="w-4 h-4 mr-2" />
                        {isUploading ? 'Uploading...' : 'Bulk Import'}
                    </Button>
                    <Button onClick={() => setShowLentBooks(!showLentBooks)} className="rounded-none bg-barn_red hover:bg-charcoal">
                        <Eye className="w-4 h-4 mr-2" />
                        {showLentBooks ? 'Hide Lent Books' : 'Show Lent Books'}
                    </Button>

                </div>
            </div>
            {editingBook && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-10 rounded-none">
                        <h2 className="text-xl font-bold mb-4">{editingBook.id ? 'Edit Book' : 'Add New Book'}</h2>
                        <Input
                            value={editingBook.title}
                            onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                            placeholder="Book Title"
                            className='rounded-none mb-2'
                        />
                        <Input
                            value={editingBook.author}
                            onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                            placeholder="Author"
                            className='rounded-none mb-2'
                        />
                        <Input
                            type="number"
                            value={editingBook.year}
                            onChange={(e) => setEditingBook({ ...editingBook, year: parseInt(e.target.value) })}
                            placeholder="Year"
                            className='rounded-none mb-2'
                        />
                        <Input
                            type="number"
                            value={editingBook.noOfCopies}
                            onChange={(e) => setEditingBook({ ...editingBook, noOfCopies: parseInt(e.target.value) })}
                            placeholder="Number of Copies"
                            className='rounded-none mb-2'
                        />
                        <Input
                            value={editingBook.edition}
                            onChange={(e) => setEditingBook({ ...editingBook, edition: e.target.value })}
                            placeholder="Edition"
                            className='rounded-none mb-2'
                        />
                        <Input
                            value={editingBook.category}
                            onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                            placeholder="Category"
                            className='rounded-none mb-2'
                        />
                        <div className="flex items-center mb-2">
                            <label htmlFor="isAvailable" className="mr-2">Available:</label>
                            <Switch
                                id="isAvailable"
                                checked={editingBook.isAvailable}
                                onCheckedChange={(checked) => setEditingBook({ ...editingBook, isAvailable: checked })}
                            />
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button onClick={handleAddOrUpdateBook} className="mr-2 rounded-none bg-barn_red hover:bg-charcoal">
                                {editingBook.id ? 'Update' : 'Add'}
                            </Button>
                            <Button onClick={() => setEditingBook(null)} className='rounded-none bg-barn_red hover:bg-charcoal'>Cancel</Button>
                        </div>
                    </div>
                </div>
            )}
            {error && <p className="text-red-500">Error: {error}</p>}
            {books.length === 0 ? (
                <p>No books available.</p>
            ) : (
                <div className="overflow-x-auto ">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-20 border-b" >Title   </th>
                                <th className="py-2 px-8 border-b">Author</th>
                                <th className="py-2 px-4 border-b">Year</th>
                                <th className="py-2 px-4 border-b">Copies</th>
                                <th className="py-2 px-4 border-b">Edition</th>
                                <th className="py-2 px-4 border-b">Category</th>
                                <th className="py-2 px-4 border-b">Available</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book.id}>
                                    <td className="py-2 px-4 border-b ">{book.title}</td>
                                    <td className="py-2 px-4 border-b">{book.author}</td>
                                    <td className="py-2 px-4 border-b">{book.year}</td>
                                    <td className="py-2 px-4 border-b">{book.noOfCopies}</td>
                                    <td className="py-2 px-4 border-b">{book.edition}</td>
                                    <td className="py-2 px-4 border-b">{book.category}</td>
                                    <td className="py-2 px-4 border-b">
                                        <Switch
                                            checked={book.isAvailable}
                                            onCheckedChange={() => handleToggleAvailability(book.id, book.isAvailable)}
                                            className='bg-barn_red '
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <div className="flex space-x-2">
                                            <Button onClick={() => setEditingBook(book)} className='rounded-none bg-barn_red hover:bg-charcoal'>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            {confirmDeleteId === book.id ? (
                                                <>
                                                    <Button onClick={() => handleDeleteBook(book.id)} className="rounded-none bg-charcoal hover:bg-barn_red">
                                                        Confirm
                                                    </Button>
                                                    <Button onClick={() => setConfirmDeleteId(null)} className="rounded-none bg-charcoal hover:bg-barn_red">
                                                        Cancel
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button onClick={() => setConfirmDeleteId(book.id)} className='rounded-none bg-barn_red hover:bg-charcoal'>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {showLentBooks && renderLentBooksTable()}
        </div>
    );
};

export default AdminLibrary;