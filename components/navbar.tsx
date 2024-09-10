'use client';

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import WhiteLogo from '@/public/images/whitelogo.svg'
import DownArrow from '@/public/images/downarrow.svg'

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
        <div className="sticky top-0 ">

            <nav className="flex justify-between items-center p-3.5 text-white bg-barn_red" >
                <div className="flex  p-0">
                    <a href="/">
                        <Image src={WhiteLogo} alt="FILOGO" className="h-12 w-60 ml-4" />
                    </a>
                </div>
                <div className="flex items-center gap-6  pr-6">
                    <ul className="flex space-x-4 gap-6  ml-8">
                        <li><a href="/#home" className="hover:underline gap-2 flex">WHO WE ARE <Image src={DownArrow} alt="down-arrow" width={12} /></a></li>
                        <li><a href="/#about" className="hover:underline gap-2  flex">COURSES <Image src={DownArrow} alt="down-arrow" width={12} /></a></li>
                        <li><a href="/#nursing" className="hover:underline gap-2 flex">ADMISSION <Image src={DownArrow} alt="down-arrow" width={12} /></a></li>
                        <li><a href="/#paramedic" className="hover:underline gap-2 flex">FACILITIES <Image src={DownArrow} alt="down-arrow" width={12} /></a></li>
                        <li><a href="/#founder" className="hover:underline gap-2 flex">GALLERY <Image src={DownArrow} alt="down-arrow" width={12} /></a></li>
                        {
                            session ? (
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
                                <button onClick={handleSignIn}>SIGN IN</button>
                            )
                        }
                    </ul>
                </div>
            </nav >
        </div>
    );
}
