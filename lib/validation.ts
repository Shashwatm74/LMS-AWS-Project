// lib/validation.ts
import { z } from 'zod';

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
        .min(8, 'New password must be at least 8 characters long\n')
        .regex(/[A-Z]/, 'New password must contain at least one uppercase letter\n')
        .regex(/[a-z]/, 'New password must contain at least one lowercase letter\n')
        .regex(/[0-9]/, 'New password must contain at least one number\n')
        .regex(/[@$!%*?&]/, 'New password must contain at least one special character\n'),
});
