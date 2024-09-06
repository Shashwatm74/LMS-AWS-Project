import { NextApiRequest, NextApiResponse } from 'next';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Function to generate a random 8-character password
const generateRandomPassword = (): string => {
    return randomBytes(4).toString('hex');  // Generates 8 random characters
};

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Correct capitalization
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send an email with the new password
const sendEmail = async (to: string, password: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Your New Password',
        text: `Your new password is: ${password}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to: ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

// API route handler
export async function POST(request: Request) {
    try {
        const { regNumber } = await request.json();

        if (!regNumber) {
            return NextResponse.json({ error: 'Registration number required' }, { status: 400 });
        }

        // Fetch user email from database
        const user = await prisma.user.findUnique({
            where: { regNumber },
            select: { email: true },
        });

        if (!user || !user.email) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Generate and hash a new password
        const newPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in the database
        await prisma.user.update({
            where: { regNumber },
            data: { password: hashedPassword },
        });

        // Send the new password via email
        await sendEmail(user.email, newPassword);

        return NextResponse.json({ message: 'Password has been sent to your email' }, { status: 200 });
    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
