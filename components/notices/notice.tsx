'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import noticeRed from '@/public/images/noticeRed.svg';
import noticeWhite from '@/public/images/noticeWhite.svg'
import Contact from '@/components/(footer)/contact';
import Footer from '../(footer)/footer';

interface Notice {
    id: number;
    title: string;
    content: string;
}

const ViewerDashboard: React.FC = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [error, setError] = useState<string | null>(null);
    // Fetch the notices from the backend
    useEffect(() => {
        const fetchNotices = async () => {
            try {

                const response = await fetch('/api/notices');
                const data = await response.json();
                setNotices(data);
            }
            catch (error) {
                console.log(error)
                setError('Error fetching notices check your internet connection');
            }
        };
        fetchNotices();
    }, []);

    return (
        <>
            <section className="container mx-auto py-8 pt-20 min-h-screen">
                <h1 className="text-3xl pt-14 pb-4 text-center font-bold mb-6 text-barn_red font-cinzel">IMPORTANT NOTICES</h1>

                <Card className="h-full rounded-none border-none">

                    <CardContent>
                        {error ? (
                            <p className="text-red-500">Error: {error}</p>
                        ) :
                            notices.length === 0 ? (
                                <p>No notices available</p>
                            ) : (


                                <div className="space-y-6">
                                    {notices?.map((notice, index) => (
                                        <div key={notice.id} className={`rounded-md font-helvetica overflow-hidden ${index % 2 === 0 ? 'bg-ivory' : 'bg-charcoal'}`}>
                                            <div className={`p-4 flex items-start ${index % 2 === 0 ? 'text-barn_red' : 'text-white'}`}>
                                                <div className="flex-shrink-0 mr-4">
                                                    <Image
                                                        className='h-24'
                                                        src={index % 2 === 0 ? noticeRed : noticeWhite}
                                                        alt="Notice background"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold  text-lg mb-2">{notice.title.toLocaleUpperCase()}</h3>
                                                    <p className={`text-sm ${index % 2 === 0 ? 'text-charcoal' : 'text-white'}`}>
                                                        {notice.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            )}
                    </CardContent>
                </Card>
            </section>
            <Footer />

        </>
    );
};

export default ViewerDashboard;
