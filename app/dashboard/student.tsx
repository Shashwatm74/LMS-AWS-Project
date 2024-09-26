'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import ViewerLibrary from '@/components/(dashboard)/library/ViewerLibrary';

const StudentDashboard: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState('Library');
    const router = useRouter();
    const { data: session } = useSession();

    const handleChangePassword = () => {
        router.push('/changepassword');
    };



    return (
        <div className="container mx-auto py-8 pt-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Good Morning, {session?.user?.name}</h1>
                <Button onClick={handleChangePassword} className="bg-barn_red hover:bg-charcoal rounded-none">
                    Change Password
                </Button>
            </div>

            <div className="grid grid-cols-4 gap-4">

                <div className="col-span-4 ">
                    <Card className="h-full  rounded-none">
                        <CardHeader className="flex justify-between items-center">
                            <span>{activeMenu}</span>

                        </CardHeader>
                        <CardContent >
                            {activeMenu === 'Library' ? <ViewerLibrary />

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

export default StudentDashboard;