import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextAuthOptions, Session, User } from 'next-auth';

interface Credentials {
    reg_number: string;
    password: string;
}

interface CustomUser extends User {
    regNumber: string;
    role: string;
}

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                reg_number: { label: 'Registration Number', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials: Record<string, any> | undefined) {
                if (!credentials) {
                    throw new Error('Invalid credentials');
                }

                const { reg_number, password } = credentials as Credentials;

                // Fetch user from Prisma
                const user = await prisma.user.findUnique({
                    where: { regNumber: reg_number },
                    include: { role: true }
                });

                if (!user) {
                    throw new Error('UserNotFound');
                }

                // Compare the password using bcrypt
                const isValidPassword = await bcrypt.compare(password, user.password);
                if (!isValidPassword) {
                    throw new Error('InvalidPassword');
                }

                return {
                    id: user.id,
                    regNumber: user.regNumber,
                    role: user.role.name,
                } as CustomUser;
            }
        })
    ],
    callbacks: {
        async session({ session, token }: { session: Session; token: any }) {
            // Attach role and regNumber to session
            session.user.role = token.role;
            session.user.regNumber = token.regNumber;
            return session;
        },
        async jwt({ token, user }: { token: any; user: CustomUser | undefined }) {
            if (user) {
                token.role = user.role;
                token.regNumber = user.regNumber;
            }
            return token;
        }
    },
    pages: {
        signIn: '/signin',
        error: '/error', // Custom error page
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };