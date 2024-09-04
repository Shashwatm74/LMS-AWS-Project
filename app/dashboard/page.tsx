'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function DashboardClient() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const handleChangePassword = () => {
        router.push('/changepassword');
    };

    useEffect(() => {
        if (status === 'loading') {
            // Wait until session loading is complete
            return;
        }

        if (status === 'unauthenticated') {
            router.push('/');
        }

        if (status === 'authenticated') {
            const expiresAt = new Date(session.expires).getTime();
            const now = new Date().getTime();

            // Check if the session has expired
            if (now > expiresAt) {
                signOut({ redirect: true });
            }
        }
    }, [status, session, router]);

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (!session) {
        return null; // or handle redirection here if needed
    }

    return (
        <div>
            <h1>Welcome, {session.user?.regNumber}</h1>
            <Button onClick={() => signOut({ redirect: true })}>
                Sign Out
            </Button>
            <Button onClick={() => handleChangePassword()}> Change Password</Button>
            {/* Render dashboard components here */}
        </div>
    );
}
