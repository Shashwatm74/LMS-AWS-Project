import NextAuth, { DefaultSession } from "next-auth"

declare module 'next-auth' {
    interface Session {
        user: {
            regNumber: string;
            role: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            id?: string | null;
        };
    }

    interface User {
        regNumber: string;
        role: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    }
}