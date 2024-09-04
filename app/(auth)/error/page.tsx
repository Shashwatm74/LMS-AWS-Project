'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const error = searchParams.get('error');

    let errorMessage = 'An unknown error occurred.';
    switch (error) {
        case 'CredentialsSignin':
            errorMessage = 'Invalid registration number or password.';
            break;
        case 'InvalidPassword':
            errorMessage = 'Invalid password.';
            break;
        case 'UserNotFound':
            errorMessage = 'Registration number not found in the database.';
            break;
        default:
            errorMessage = 'Something went wrong. Please try again.';
            break;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-96">
                <CardHeader>
                    <h1 className="text-xl font-semibold text-center">Authentication Error</h1>
                </CardHeader>
                <CardContent>
                    <p className="text-center mb-4">{errorMessage}</p>
                    <Button onClick={() => router.push('/auth/signin')}>
                        Back to Sign In
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
