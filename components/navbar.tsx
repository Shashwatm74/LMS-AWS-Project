'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import WhiteLogo from '@/public/images/whitelogo.svg';
import DownArrow from '@/public/images/downarrow.svg';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [isSession, setSession] = useState(false);

    // Use useEffect to set session state based on 'session'
    useEffect(() => {
        if (session) {
            setSession(true);
        } else {
            setSession(false);
        }
    }, [session]);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 1150);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        <div className="fixed top-0 left-0 right-0 z-50 w-100">
            <nav className="flex justify-between items-center p-3 mr-0 text-white bg-barn_red">
                <div className="flex p-0">
                    <a href="/">
                        <Image src={WhiteLogo} alt="FILOGO" className="h-11 w-60 ml-4 min-w-40" />
                    </a>
                </div>
                <div className="flex items-center pr-6 py-0">
                    {isSmallScreen ? (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <div className="flex flex-col gap-1 hover:cursor-pointer">
                                    <div className="bg-white h-1 w-6"></div>
                                    <div className="bg-white h-1 w-6"></div>
                                    <div className="bg-white h-1 w-6"></div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-80 mt-5 h-screen">
                                <DropdownMenuItem>
                                    <a href="/#home" className="w-full">WHO WE ARE</a>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <a href="/#about" className="w-full">COURSES</a>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <a href="/#nursing" className="w-full">ADMISSION</a>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <a href="/#paramedic" className="w-full">FACILITIES</a>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <a href="/#founder" className="w-full">GALLERY</a>
                                </DropdownMenuItem>
                                {isSession ? (
                                    <>
                                        <DropdownMenuItem onSelect={goToDashboard}>
                                            Dashboard
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={handleSignOut}>
                                            Logout
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <DropdownMenuItem onSelect={handleSignIn}>
                                        SIGN IN
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <ul className="flex space-x-2 gap-2 ml-8">
                            <li className="mt-1">
                                <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger className="gap-2 flex hover:cursor-pointer hover:underline items-center focus:outline-none">
                                        WHO WE ARE <Image src={DownArrow} alt="down-arrow" width={12} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-screen mt-4">
                                        <div className="max-w-screen-xl mx-auto px-4 py-6">
                                            <div className="grid grid-cols-3 gap-8">
                                                <DropdownMenuItem className="focus:bg-transparent">
                                                    <h3 className="font-bold mb-2">Column 1</h3>
                                                    <ul>
                                                        <li>we are who we are</li>
                                                        <li>we are who we are</li>
                                                    </ul>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="focus:bg-transparent">
                                                    <h3 className="font-bold mb-2">Column 2</h3>
                                                    <ul>
                                                        <li>we are who we are</li>
                                                        <li>we are who we are</li>
                                                    </ul>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="focus:bg-transparent">
                                                    <h3 className="font-bold mb-2">Column 3</h3>
                                                    <ul>
                                                        <li>we are who we are</li>
                                                        <li>we are who we are</li>
                                                    </ul>
                                                </DropdownMenuItem>
                                            </div>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </li>
                            <li className="mt-1">
                                <a href="/#about" className="hover:underline gap-2 flex">
                                    COURSES <Image src={DownArrow} alt="down-arrow" width={12} />
                                </a>
                            </li>
                            <li className="mt-1">
                                <a href="/#nursing" className="hover:underline gap-2 flex">
                                    ADMISSION <Image src={DownArrow} alt="down-arrow" width={12} />
                                </a>
                            </li>
                            <li className="mt-1">
                                <a href="/#paramedic" className="hover:underline gap-2 flex">
                                    FACILITIES <Image src={DownArrow} alt="down-arrow" width={12} />
                                </a>
                            </li>
                            <li className="mt-1">
                                <a href="/#founder" className="hover:underline gap-2 flex">
                                    GALLERY <Image src={DownArrow} alt="down-arrow" width={12} />
                                </a>
                            </li>
                            {isSession ? (
                                <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                        <Avatar className="w-8 h-8 cursor-pointer rounded-full">
                                            <AvatarImage src="/path/to/profile-image.jpg" alt="Profile" />
                                            <AvatarFallback className="bg-barn_red text-white rounded-full border-2 border-white">
                                                {session?.user?.role[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="mt-3 w-40">
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
                            )}
                        </ul>
                    )}
                </div>
            </nav>
        </div>
    );
}
