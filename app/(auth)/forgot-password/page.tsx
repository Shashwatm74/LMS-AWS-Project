'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ForgotPassword() {
    const [regNumber, setRegNumber] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Here you would send a request to your API to handle sending the reset token
        const response = await fetch('@/api/auth/forgotpassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ regNumber }),
        });

        if (response.ok) {
            setMessage('Password reset instructions have been sent to your email.');
        } else {
            setMessage('Error: Could not send password reset instructions.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-96">
                <CardHeader>
                    <h1 className="text-xl font-semibold text-center">Forgot Password</h1>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
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
                        {message && (
                            <p className="text-red-500 text-center mb-4">{message}</p>
                        )}
                        <Button type="submit" className="w-full">
                            Reset Password
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
