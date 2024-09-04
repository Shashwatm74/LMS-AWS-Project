import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export async function POST(request: Request) {
    const { currentPassword, newPassword }: ChangePasswordRequest = await request.json();

    // Get session to check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.regNumber) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { regNumber: session.user.regNumber },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return NextResponse.json({ error: 'Invalid current password' }, { status: 400 });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { regNumber: user.regNumber },
            data: { password: hashedNewPassword },
        });

        return NextResponse.json({ message: 'Password changed successfully' }, { status: 200 });
    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
