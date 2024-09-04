import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

interface ForgotPasswordRequest {
    regNumber: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { regNumber }: ForgotPasswordRequest = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { regNumber },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 360000);

        await prisma.user.update({
            where: { regNumber: user.regNumber },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
        const mailOptions = {
            to: `${user.regNumber}@yourdomain.com`,
            from: 'no-reply@yourdomain.com',
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}
