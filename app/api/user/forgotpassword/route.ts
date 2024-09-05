// pages/api/auth/resetpasswordrequest.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma'; // Adjust according to your Prisma setup

const generateRandomPassword = () => {
    return randomBytes(4).toString('hex'); // Generates an 8-character password
};

const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to: string, password: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Your New Password',
        text: `Your new password is: ${password}`,
    };

    return transporter.sendMail(mailOptions);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { regNo, email } = req.body;

        if (!regNo || !email) {
            return res.status(400).json({ error: 'Registration number and email are required' });
        }

        const newPassword = generateRandomPassword();
        const hashedPassword = await hashPassword(newPassword);

        try {
            // Update the user's password in the database
            await prisma.user.update({
                where: { regNo },
                data: { password: hashedPassword }, // Ensure this matches your schema
            });

            // Send the new password via email
            await sendEmail(email, newPassword);

            res.status(200).json({ message: 'Password has been reset and sent to your email' });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
