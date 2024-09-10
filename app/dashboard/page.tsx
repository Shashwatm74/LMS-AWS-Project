'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Student from './student';
import Professor from './professor';
import Admin from './admin';
import SuperAdmin from './superadmin';


export default function DashboardClient() {
    const { data: session, status } = useSession();
    const router = useRouter();

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
    if (session.user?.role === 'student') {
        return <Student />;
    }

    else if (session.user?.role === 'professor') {
        return <Professor />;
    }
    else if (session.user?.role === 'admin') {
        return <Admin />
    }
    else if (session.user?.role === 'superadmin') {
        return <SuperAdmin />
    }
}
