'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const Admin: React.FC = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const handleChangePassword = () => {
        router.push('/changepassword');
    };

    if (session?.user.role !== 'admin') {
        return null
    }
    return (
        <>
            this is admin page
            <h1>Welcome, {session.user?.regNumber}</h1>
            <Button onClick={() => handleChangePassword()}> Change Password</Button>
        </>
    )
}
export default Admin;