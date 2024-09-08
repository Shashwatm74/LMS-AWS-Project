import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// API route handler
export async function POST(request: Request) {
    try {
        const { regNumber, otp } = await request.json();

        if (!regNumber || !otp) {
            return NextResponse.json({ error: 'Registration number and OTP required' }, { status: 400 });
        }

        // Find and verify OTP
        const otpRecord = await prisma.otp.findFirst({
            where: {
                regNumber,
                otp,
                expiresAt: { gte: new Date() },
                verified: false,
            },
        });

        if (!otpRecord) {
            return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
        }

        // Mark OTP as verified
        await prisma.otp.update({
            where: { id: otpRecord.id },
            data: { verified: true },
        });

        return NextResponse.json({ message: 'OTP verified' }, { status: 200 });
    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
