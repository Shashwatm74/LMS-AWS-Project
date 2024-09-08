'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import Spinner from '@/components/ui/spinner';

// Define Zod schema for password validation
const passwordSchema = z.string().min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[@$!%*?&#]/, { message: 'Password must contain at least one special character' });

export default function ForgotPassword() {
    const [regNumber, setRegNumber] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState<'requestOtp' | 'verifyOtp' | 'resetPassword'>('requestOtp');
    const [message, setMessage] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [showResetButton, setShowResetButton] = useState(true);
    const [timer, setTimer] = useState(10); // Timer state
    const [loading, setLoading] = useState(false); // Loading state
    const router = useRouter();

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (timer > 0 && !showResetButton) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            clearInterval(interval);
            router.push('/signin');
        }
        return () => clearInterval(interval);
    }, [timer, showResetButton, router]);

    const handleBackToSignIn: React.MouseEventHandler<HTMLButtonElement> = () => {
        router.push('/signin');
    };

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Set loading to true

        if (!regNumber || !email) {
            setMessage('Registration number and email are required.');
            setLoading(false); // Set loading to false
            return;
        }

        const response = await fetch('/api/user/generate-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ regNumber, email }),
        });

        setLoading(false); // Set loading to false after request

        if (response.ok) {
            setMessage('OTP has been sent to your email.');
            setStep('verifyOtp');
        } else {
            const data = await response.json();
            setMessage(`Error: ${data.error || 'Could not send OTP.'}`);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Set loading to true

        if (!regNumber || !otp) {
            setMessage('Registration number and OTP are required.');
            setLoading(false); // Set loading to false
            return;
        }

        const response = await fetch('/api/user/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ regNumber, otp }),
        });

        setLoading(false); // Set loading to false after request

        if (response.ok) {
            setMessage('OTP verified. You can now reset your password.');
            setStep('resetPassword');
        } else {
            const data = await response.json();
            setMessage(`Error: ${data.error || 'Invalid or expired OTP.'}`);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Set loading to true

        try {
            passwordSchema.parse(newPassword); // Validate new password with Zod

            if (newPassword !== confirmPassword) {
                setMessage('Passwords do not match.');
                setLoading(false); // Set loading to false
                return;
            }

            const response = await fetch('/api/user/forgotpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ regNumber, otp, newPassword }),
            });

            setLoading(false); // Set loading to false after request

            if (response.ok) {
                setMessage('Password has been reset successfully');
                setShowResetButton(false); // Hide reset button
                setTimer(5); // Start countdown
            } else {
                const data = await response.json();
                setMessage(`Error: ${data.error || 'Could not reset password.'}`);
            }
        } catch (error) {
            setLoading(false); // Set loading to false on error

            if (error instanceof z.ZodError) {
                setMessage(`Error: ${error.errors[0].message}`);
            } else {
                setMessage('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-96">
                <CardHeader>
                    <h1 className="text-xl font-semibold text-center">Forgot Password</h1>
                </CardHeader>
                <CardContent>
                    {step === 'requestOtp' && (
                        <form onSubmit={handleRequestOtp}>
                            <div className="mb-4">
                                <Label htmlFor="regNumber">Registration Number</Label>
                                <Input
                                    id="regNumber"
                                    type="text"
                                    value={regNumber}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            {message && (
                                <p className={`text-center mb-4 ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>
                            )}
                            <Button type="submit" className="w-full relative" disabled={loading}>
                                {loading && <Spinner />}
                                {loading ? ' Processing...' : 'Send OTP'}
                            </Button>
                        </form>
                    )}

                    {step === 'verifyOtp' && (
                        <form onSubmit={handleVerifyOtp}>
                            <div className="mb-4">
                                <Label htmlFor="otp">OTP</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    value={otp}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                                    required
                                />
                            </div>
                            {message && (
                                <p className={`text-center mb-4 ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>
                            )}
                            <Button type="submit" className="w-full relative" disabled={loading}>
                                {loading && <Spinner />}
                                {loading ? ' Processing...' : 'Verify OTP'}
                            </Button>
                        </form>
                    )}

                    {step === 'resetPassword' && (
                        <form onSubmit={handleResetPassword}>
                            <div className="mb-4">
                                <Label htmlFor="newPassword">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={passwordVisible ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                    >
                                        {passwordVisible ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>
                            <div className="mb-4">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={confirmPasswordVisible ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                    >
                                        {confirmPasswordVisible ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>
                            {message && (
                                <p className={`text-center mb-4 ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>
                            )}
                            {showResetButton && (
                                <Button type="submit" className="w-full relative" disabled={loading}>
                                    {loading && <Spinner />}
                                    {loading ? ' Processing...' : 'Reset Password'}
                                </Button>
                            )}
                        </form>
                    )}

                    {!showResetButton && (
                        <div className="text-center mt-4 text-green-500">
                            <p>Redirecting you back to the sign-in page in {timer} seconds...</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
