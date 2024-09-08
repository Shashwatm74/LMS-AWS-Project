import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';



// API route handler
export async function POST(request: Request) {
    try {
        const { regNumber, otp, newPassword } = await request.json();

        if (!regNumber || !otp || !newPassword) {
            return NextResponse.json({ error: 'Registration number, OTP, and new password required' }, { status: 400 });
        }


        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in the database
        await prisma.user.update({
            where: { regNumber },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ message: 'Password has been reset successfully' }, { status: 200 });
    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
