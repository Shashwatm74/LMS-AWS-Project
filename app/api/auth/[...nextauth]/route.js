import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                reg_number: { label: 'Registration Number', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                const { reg_number, password } = credentials;

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
                };
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            // Attach role and regNumber to session
            session.user.role = token.role;
            session.user.regNumber = token.regNumber;
            return session;
        },
        async jwt({ token, user }) {
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

// Export the POST handler for NextAuth
export async function POST(req, res) {
    return NextAuth(req, res, authOptions);
}

// Export the GET handler (for session fetching)
export async function GET(req, res) {
    return NextAuth(req, res, authOptions);
}
// Export the NextAuth handler function
export default async function handler(req, res) {
    return NextAuth(req, res, authOptions);
}