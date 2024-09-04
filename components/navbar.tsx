// components/Navbar.tsx
'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";

export default function Navbar() {
    const router = useRouter();

    const handleSignIn = () => {
        router.push('/signin');
    };

    return (
        <nav className="flex justify-between items-center p-4  text-white" style={{ backgroundColor: '#7a0e01', color: 'white' }}>
            <div className="flex items-center">
                <h1 className="text-xl font-bold">FI Institute</h1>
                <ul className="flex space-x-4 ml-8">
                    <li><a href="/" className="hover:underline">Home</a></li>
                    <li><a href="/about" className="hover:underline">About</a></li>
                    <li><a href="/nursing" className="hover:underline">Nursing Course</a></li>
                    <li><a href="/paramedic" className="hover:underline">Paramedic Course</a></li>
                    <li><a href="/founder" className="hover:underline">Founder</a></li>
                </ul>
            </div>
            <Button onClick={handleSignIn}>Sign In</Button>
        </nav>
    );
}
