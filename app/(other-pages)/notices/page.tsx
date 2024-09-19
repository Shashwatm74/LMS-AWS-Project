'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface Notice {
    id: number;
    title: string;
    content: string;
}

const ViewerDashboard: React.FC = () => {
    const [notices, setNotices] = useState<Notice[]>([]);

    // Fetch the notices from the backend
    useEffect(() => {
        const fetchNotices = async () => {
            const response = await fetch('/api/notices');
            const data = await response.json();
            setNotices(data);
        };
        fetchNotices();
    }, []);

    return (
        <div className="container mx-auto py-8 pt-20">
            <h1 className="text-2xl font-bold capitalize mb-6">Public Notices</h1>

            <Card className="h-full rounded-none">
                <CardHeader>
                    <FileText className="w-4 h-4 mr-2" />
                    <span>Notices</span>
                </CardHeader>
                <CardContent>
                    {notices.length === 0 ? (
                        <p>No notices available</p>
                    ) : (
                        <div className="space-y-4">
                            {notices.map((notice) => (
                                <div key={notice.id} className="border p-4 rounded-md">
                                    <h3 className="font-bold">{notice.title}</h3>
                                    <p>{notice.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ViewerDashboard;
