'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link from Next.js
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from 'next-auth/react';
import { Button } from "@/components/ui/button";

export default function SignIn() {
    const [regNumber, setRegNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await signIn('credentials', {
            reg_number: regNumber,
            password: password,
            redirect: false,
        });

        if (result?.error) {
            switch (result.error) {
                case 'CredentialsSignin':
                    setErrorMessage('Invalid registration number or password');
                    break;
                case 'InvalidPassword':
                    setErrorMessage('Invalid password');
                    break;
                case 'UserNotFound':
                    setErrorMessage('Registration number not found in the database');
                    break;
                default:
                    setErrorMessage('Something went wrong. Please try again.');
                    break;
            }
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-96">
                <CardHeader>
                    <h1 className="text-xl font-semibold text-center">Sign In</h1>
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
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4 flex items-center">
                            <input
                                id="showPassword"
                                type="checkbox"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                                className="mr-2"
                            />
                            <Label htmlFor="showPassword">Show Password</Label>
                        </div>
                        {errorMessage && (
                            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
                        )}
                        <Button type="submit" className="w-full mb-4">
                            Sign In
                        </Button>
                        <div className="text-center">
                            <Link href="/forgot-password" className="text-blue-500 hover:underline">
                                Forgot Password?
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
