import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface Notice {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    userName: string | null | undefined;
}

const ViewerNoticeBoard: React.FC = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await fetch('/api/notices');
            if (!response.ok) throw new Error('Failed to fetch notices');
            const data = await response.json();
            setNotices(data);
        } catch (error) {
            setError('Error fetching notices');
        }
    };

    return (
        <div className="space-y-4">
            {error ? (
                <p className="text-red-500">Error: {error}</p>
            ) : notices.length === 0 ? (
                <p>No notices available.</p>
            ) : (
                notices.map((notice) => (
                    <Card key={notice.id} className="mb-4">
                        <CardHeader>
                            <h2>{notice.title}</h2>
                            <p>Posted by: {notice.userName}</p>
                        </CardHeader>
                        <CardContent>
                            <p>{notice.content}</p>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
};

export default ViewerNoticeBoard;
