import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Notice {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    userName: string | null | undefined;
}

const AdminNoticeBoard: React.FC = () => {
    const { data: session } = useSession();
    const [notices, setNotices] = useState<Notice[]>([]);
    const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await fetch('/api/notices');
            if (!response.ok) throw new Error('Failed to fetch notices');
            const data = await response.json();
            setNotices(data);
        } catch (error) {
            setError('Error fetching notices');
        }
    };

    const handleAddOrUpdateNotice = async () => {
        if (!editingNotice) return;
        try {
            const url = editingNotice.id ? `/api/notices` : '/api/notices';
            const method = editingNotice.id ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingNotice),
            });
            if (!response.ok) throw new Error('Failed to save notice');
            setEditingNotice(null);
            fetchNotices();
        } catch (error) {
            setError('Error saving notice');
        }
    };

    const handleDeleteNotice = async (id: number) => {
        try {
            const response = await fetch(`/api/notices`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (!response.ok) throw new Error('Failed to delete notice');
            setConfirmDeleteId(null);
            fetchNotices();
        } catch (error) {
            setError('Error deleting notice');
        }
    };

    return (
        <div className="space-y-4 items-center">
            <Button onClick={() => setEditingNotice({ id: 0, title: '', content: '', createdAt: '', userName: session?.user.name })} className="rounded-none bg-barn_red hover:bg-charcoal">
                <Plus className="w-4 h-4 mr-2 " /> Add New Notice
            </Button>
            {editingNotice && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center ">
                    <div className="bg-white p-10 rounded-none ">
                        <h2 className="text-xl font-bold mb-4">{editingNotice.id ? 'Edit Notice' : 'Add New Notice'}</h2>
                        <Input
                            value={editingNotice.title}
                            onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                            placeholder="Notice Title"
                            className='rounded-none'
                        />
                        <Textarea
                            value={editingNotice.content}
                            onChange={(e) => setEditingNotice({ ...editingNotice, content: e.target.value })}
                            placeholder="Notice Content"
                            className="mt-4 rounded-none"
                        />
                        <div className="mt-6 flex justify-end">
                            <Button onClick={handleAddOrUpdateNotice} className="mr-2 rounded-none bg-barn_red hover:bg-charcoal">
                                {editingNotice.id ? 'Update' : 'Add'}
                            </Button>
                            <Button onClick={() => setEditingNotice(null)} className='rounded-none bg-barn_red hover:bg-charcoal'>Cancel</Button>
                        </div>
                    </div>
                </div>
            )}
            {error ? (
                <p className="text-red-500">Error: {error}</p>
            ) : notices.length === 0 ? (
                <p>No notices available.</p>
            ) : (
                notices.map((notice) => (
                    <Card key={notice.id} className="mb-4 rounded-none">
                        <CardHeader>
                            <h2>{notice.title}</h2>
                            <div className="flex justify-between">
                                <p>Posted by: {notice.userName}</p>
                                <div className='flex rounded-none gap-1 '>

                                    {confirmDeleteId === notice.id ? (
                                        <div className="flex space-x-2">
                                            <Button onClick={() => handleDeleteNotice(notice.id)} className="rounded-none bg-charcoal hover:bg-barn_red">
                                                Confirm Delete
                                            </Button>
                                            <Button onClick={() => setConfirmDeleteId(null)} className="rounded-none bg-charcoal hover:bg-barn_red">
                                                Cancel
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <Button onClick={() => setEditingNotice(notice)} className='rounded-none bg-barn_red hover:bg-charcoal'>
                                                <Edit className="w-4 h-4 " />
                                            </Button>
                                            <Button onClick={() => setConfirmDeleteId(notice.id)} className='rounded-none bg-barn_red hover:bg-charcoal '>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p>{notice.content}</p>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
};

export default AdminNoticeBoard;
