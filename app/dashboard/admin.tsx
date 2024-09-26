import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { FileText, Library, } from 'lucide-react';
import AdminNoticeBoard from '@/components/(dashboard)/notice/AdminNoticeBoard';
import AdminLibrary from '@/components/(dashboard)/library/AdminLibrary';


const AdminDashboard: React.FC = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [activeMenu, setActiveMenu] = useState('Notices');

    const menuItems = [

        { title: 'Notices', icon: <FileText className="w-4 h-4" /> },
        { title: 'Library', icon: <Library className="w-4 h-4" /> },
    ];

    if (session?.user.role !== 'admin') {
        return <p>You are not authorized to view this page.</p>;
    }
    return (
        <div className="container mx-auto py-8 pt-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold capitalize">Good Morning, {session?.user?.name}</h1>
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

                <div className="col-span-2 ">
                    <Card className="h-full  rounded-none">
                        <CardHeader className="flex justify-between items-center">
                            <span>{activeMenu}</span>

                        </CardHeader>
                        <CardContent >
                            {
                                activeMenu === 'Notices' ? <AdminNoticeBoard />
                                    : activeMenu === 'Library' ? <AdminLibrary />
                                        : (
                                            <p>Content for {activeMenu}</p>
                                        )}
                        </CardContent>
                    </Card>
                </div>


            </div>


        </div>
    );
};

export default AdminDashboard;