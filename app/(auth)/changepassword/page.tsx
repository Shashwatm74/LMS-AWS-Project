'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';


const passwordSchema = z.string().min(8, { message: 'Password must be at least 8 characters long\n' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter\n' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter\n' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number\n' })
    .regex(/[@$!%*?&#]/, { message: 'Password must contain at least one special character\n' });

export default function ChangePassword() {
    const [regNo, setRegNo] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const handleBack = () => {
        router.push('/dashboard');
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }
        if (newPassword == currentPassword) {
            setErrorMessage('New password cannot be the same as the current password');
            return;
        }

        const passwordValidationResult = passwordSchema.safeParse(newPassword);
        if (!passwordValidationResult.success) {
            setErrorMessage(passwordValidationResult.error.errors[0]?.message || 'Invalid password');
            return;
        }

        try {
            const response = await fetch('/api/user/changepassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ regNo, currentPassword, newPassword }),
            });

            if (response.ok) {
                toast.success('Password changed successfully');
                router.push('/dashboard');
            } else {
                const data = await response.json();
                setErrorMessage(data.error || 'Something went wrong');
            }
        } catch (error) {
            setErrorMessage('Failed to change password');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-96">
                <CardHeader>
                    <h1 className="text-xl font-semibold text-center">Change Password</h1>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleChangePassword}>
                        {/* Registration Number */}
                        <div className="mb-4">
                            <Label htmlFor="regNo">Registration Number</Label>
                            <Input
                                id="regNo"
                                type="text"
                                value={regNo}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegNo(e.target.value)}
                                autoComplete="username"
                                required
                            />
                        </div>

                        {/* Current Password */}
                        <div className="mb-4 relative">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                                id="currentPassword"
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                            <span
                                className="absolute right-2 top-8 cursor-pointer text-gray-500"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? <EyeOff /> : <Eye />}
                            </span>
                        </div>

                        {/* New Password */}
                        <div className="mb-4 relative">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                            <span
                                className="absolute right-2 top-8 cursor-pointer text-gray-500"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <EyeOff /> : <Eye />}
                            </span>
                        </div>

                        {/* Confirm New Password */}
                        <div className="mb-4 relative">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                            <span
                                className="absolute right-2 top-8 cursor-pointer text-gray-500"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff /> : <Eye />}
                            </span>
                        </div>

                        {/* Error message */}
                        {errorMessage && (
                            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
                        )}

                        {/* Submit button */}
                        <div className='flex gap-1'>

                            <Button type="submit">Change Password</Button>
                            <Button onClick={() => handleBack()}>Back</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
