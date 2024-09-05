'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ForgotPassword() {
    const [regNumber, setRegNumber] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Make sure the regNumber and email are provided
        if (!regNumber || !email) {
            setMessage('Registration number and email are required.');
            return;
        }

        // Send request to the reset password API
        const response = await fetch('/api/auth/resetpasswordrequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ regNumber, email }),
        });

        if (response.ok) {
            setMessage('Password has been reset and sent to your email.');
        } else {
            const data = await response.json();
            setMessage(`Error: ${data.error || 'Could not reset password.'}`);
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
