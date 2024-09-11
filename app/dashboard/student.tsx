'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const Student: React.FC = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const handleChangePassword = () => {
        router.push('/changepassword');
    };
    if (session?.user.role !== 'student') {
        return null
    }
    return (
        <section className='mt-24'>
            <h1>Welcome, {session?.user?.regNumber}</h1>
            <Button onClick={() => handleChangePassword()} className='rounded-none bg-barn_red hover:bg-red-900'> Change Password</Button>
        </section>
    )
}
export default Student;