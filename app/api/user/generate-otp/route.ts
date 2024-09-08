import { randomBytes } from 'crypto';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// OAuth2 configuration for Gmail
const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// Function to generate a random 6-digit OTP
const generateOtp = (): string => {
    return randomBytes(3).toString('hex').toUpperCase();  // Generates 6-character OTP
};

// Nodemailer transporter configuration with OAuth2
const getTransporter = async () => {
    const accessToken = await oAuth2Client.getAccessToken(); // Generate access token
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken.token as string,
        },
    });
};

// Function to send an OTP email
const sendOtpEmail = async (to: string, otp: string) => {
    const transporter = await getTransporter();
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Your OTP for Password Reset',
        text: `Your OTP is: ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to: ${to}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
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

        // Generate OTP and save to database
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

        await prisma.otp.create({
            data: {
                regNumber,
                otp,
                expiresAt,
            },
        });

        // Send OTP via email
        await sendOtpEmail(user.email, otp);

        return NextResponse.json({ message: 'OTP has been sent to your email' }, { status: 200 });
    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
