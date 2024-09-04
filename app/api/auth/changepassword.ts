import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Type definition for the request body
interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

// API Route to handle password change
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get session to check if user is authenticated
    const session = await getSession({ req });
    if (!session || !session.user?.regNumber) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { currentPassword, newPassword }: ChangePasswordRequest = req.body;

    try {
        // Fetch the user from the database
        const user = await prisma.user.findUnique({
            where: { regNumber: session.user.regNumber },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify the current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ error: 'Invalid current password' });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in the database
        await prisma.user.update({
            where: { regNumber: user.regNumber },
            data: { password: hashedNewPassword },
        });

        return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}
