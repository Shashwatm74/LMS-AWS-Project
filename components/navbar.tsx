'use client';

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";

export default function Navbar() {
    const { data: session } = useSession();
    const router = useRouter();

    const handleSignIn = () => {
        signIn();
    };

    const handleSignOut = () => {
        signOut();
    };

    const goToDashboard = () => {
        router.push('/dashboard');
    };

    return (
        <nav className="flex justify-between items-center p-4 text-white" style={{ backgroundColor: '#7a0e01', color: 'white' }}>
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

            {session ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button>Menu</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={goToDashboard}>
                            Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleSignOut}>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button onClick={handleSignIn}>Sign In</Button>
            )}
        </nav>
    );
}
