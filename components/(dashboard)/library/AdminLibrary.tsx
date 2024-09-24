import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, Plus, Upload } from 'lucide-react';
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

const LibraryManagement: React.FC = () => {
    const { data: session } = useSession();
    const [books, setBooks] = useState<Book[]>([]);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchBooks();
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
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
            const data = await readExcel(file);
            await bulkAddOrUpdateBooks(data);
            fetchBooks();
        } catch (error) {
            setError('Error processing Excel file');
        } finally {
            setIsUploading(false);
        }
    };

    const readExcel = (file: File): Promise<Book[]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const parsedData = XLSX.utils.sheet_to_json(sheet);
                resolve(parsedData as Book[]);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsBinaryString(file);
        });
    };

    const bulkAddOrUpdateBooks = async (books: Book[]) => {
        try {
            const response = await fetch('/api/books/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(books),
            });
            if (!response.ok) throw new Error('Failed to bulk add/update books');
        } catch (error) {
            throw new Error('Error in bulk add/update operation');
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
                        id="excel-upload"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <label htmlFor="excel-upload" className="cursor-pointer">
                        <Button disabled={isUploading} className="rounded-none bg-barn_red hover:bg-charcoal">
                            <Upload className="w-4 h-4 mr-2" /> {isUploading ? 'Uploading...' : 'Bulk Import'}
                        </Button>
                    </label>
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
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 border-b">Title</th>
                                <th className="py-2 px-4 border-b">Author</th>
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
                                    <td className="py-2 px-4 border-b">{book.title}</td>
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
        </div>
    );
};

export default LibraryManagement;