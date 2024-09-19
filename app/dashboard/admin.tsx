import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Book, Calendar, FileText, HelpCircle, Info, Library, User, Edit, Trash2, Plus } from 'lucide-react';

interface Notice {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    admin: { regNumber: string };
    regNumber: string;
}


const AdminDashboard = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [notices, setNotices] = useState<Notice[]>([]);
    const [activeMenu, setActiveMenu] = useState('Dashboard');
    const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

    const menuItems = [
        { title: 'Dashboard', icon: <User className="w-4 h-4" /> },
        { title: 'Notices', icon: <FileText className="w-4 h-4" /> },
        { title: 'Help & Support', icon: <HelpCircle className="w-4 h-4" /> },
        { title: 'Library', icon: <Library className="w-4 h-4" /> },
        { title: 'Exams', icon: <Book className="w-4 h-4" /> },
        { title: 'My Info', icon: <Info className="w-4 h-4" /> },
    ];

    useEffect(() => {
        if (activeMenu === 'Notices') {
            fetchNotices();
        }
    }, [activeMenu]);

    const fetchNotices = async () => {
        try {
            const res = await fetch('/api/notices');
            if (!res.ok) throw new Error('Failed to fetch notices');
            const data = await res.json();
            setNotices(data);
        } catch (error) {
            console.error('Failed to fetch notices:', error);
        }
    };

    const handleAddNotice = async () => {
        if (!editingNotice || !editingNotice.title || !editingNotice.content) {
            console.error('Title and content are required to add a notice');
            return;
        }

        try {
            const res = await fetch('/api/notices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: editingNotice.title,
                    content: editingNotice.content,
                    regNumber: editingNotice.regNumber,
                    adminId: session?.user.role,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(`Failed to add notice: ${errorData.error}`);
            }

            setEditingNotice(null);
            fetchNotices();
        } catch (error) {
            console.error('Failed to add notice:', error);
        }
    };

    const handleUpdateNotice = async () => {
        if (!editingNotice) return;

        try {
            const res = await fetch(`/api/notices/${editingNotice.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingNotice.id,
                    title: editingNotice.title,
                    content: editingNotice.content,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(`Failed to update notice: ${errorData.error}`);
            }

            setEditingNotice(null);
            fetchNotices();
        } catch (error) {
            console.error('Failed to update notice:', error);
        }
    };

    const handleDeleteNotice = async (id: number) => {
        try {
            const response = await fetch(`/api/notices/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete notice');
            }
            fetchNotices();
        } catch (error) {
            console.error(error);
        }
    };

    if (session?.user.role !== 'admin') {
        return <p>You are not authorized to view this page.</p>;
    }

    return (
        <div className="container mx-auto py-8 pt-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold capitalize">Good Morning,{session?.user?.regNumber}</h1>
                <Button onClick={() => router.push('/changepassword')} className="bg-barn_red hover:bg-charcoal rounded-none">
                    Change Password
                </Button>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                    <Card className="rounded-none">
                        <CardHeader>Menu</CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {menuItems.map((item, index) => (
                                    <li
                                        key={index}
                                        className={`flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-none ${activeMenu === item.title ? 'bg-gray-200' : ''}`}
                                        onClick={() => setActiveMenu(item.title)}
                                    >
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-span-2">
                    <Card className="h-full rounded-none">
                        <CardHeader className="flex justify-between items-center">
                            <span>{activeMenu}</span>
                            {activeMenu === 'Notices' && (
                                <Button onClick={() => setEditingNotice({ id: 0, title: '', content: '', createdAt: '', admin: { regNumber: '' }, regNumber: '' })} className="bg-green-500 hover:bg-green-600">
                                    <Plus className="w-4 h-4 mr-2" /> Add New Notice
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            {activeMenu === 'Notices' ? (
                                <div className="space-y-4">
                                    {editingNotice ? (
                                        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                                            <div className="bg-white p-4 rounded">
                                                <h2 className="text-xl font-bold mb-4">Edit Notice</h2>
                                                <Input
                                                    value={editingNotice.title}
                                                    onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                                                    placeholder="Notice Title"
                                                />
                                                <Textarea
                                                    value={editingNotice.content}
                                                    onChange={(e) => setEditingNotice({ ...editingNotice, content: e.target.value })}
                                                    placeholder="Notice Content"
                                                    className="mt-2"
                                                />
                                                <div className="mt-4 flex justify-end">
                                                    <Button onClick={handleUpdateNotice} className="mr-2">Save</Button>
                                                    <Button onClick={() => setEditingNotice(null)}>Cancel</Button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {notices.length === 0 ? (
                                                <p>No notices available.</p>
                                            ) : (
                                                notices.map((notice) => (
                                                    <Card key={notice.id} className="mb-4">
                                                        <CardHeader>
                                                            <h2>{notice.title}</h2>
                                                            <div className="flex justify-between">
                                                                <p>Posted by: {notice.admin.regNumber}</p>
                                                                <div>
                                                                    <Button onClick={() => setEditingNotice(notice)}>
                                                                        <Edit className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button onClick={() => handleDeleteNotice(notice.id)}>
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <p>{notice.content}</p>
                                                        </CardContent>
                                                    </Card>
                                                ))

                                            )}
                                        </>
                                    )}
                                </div>
                            ) : (
                                <p>Content for {activeMenu}</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="col-span-1">
                    <Card className="rounded-none h-full">
                        <CardHeader>Quick Links</CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                <li className="cursor-pointer hover:bg-gray-100 p-2 rounded-none">Building Opening & IT Resources</li>
                                <li className="cursor-pointer hover:bg-gray-100 p-2 rounded-none">Accommodation</li>
                                <li className="cursor-pointer hover:bg-gray-100 p-2 rounded-none">IT Services</li>
                                <li className="cursor-pointer hover:bg-gray-100 p-2 rounded-none">PG Study</li>
                                <li className="cursor-pointer hover:bg-gray-100 p-2 rounded-none">Finance</li>
                                <li className="cursor-pointer hover:bg-gray-100 p-2 rounded-none">Student Rep Help</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card className="mt-4 rounded-none">
                <CardHeader className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Timetable</span>
                </CardHeader>
                <CardContent>
                    <Button className="w-full rounded-none bg-barn_red hover:bg-charcoal">View Full Timetable</Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDashboard;
