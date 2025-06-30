
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import type { Metadata } from 'next';
import { useSearchParams, useParams } from 'next/navigation';
import NightSkyTemplate from '@/app/templates/night-sky/NightSkyTemplate';
import { Loader2 } from 'lucide-react';

interface WishData {
  toName: string;
  fromName: string;
  message: string;
  template: string;
  closingMessages?: string;
  secretMessage?: string;
}

function WishDisplay() {
    const params = useParams();
    const id = params.id as string;
    const [wishData, setWishData] = useState<WishData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined' && id) {
            try {
                const wishList: any[] = JSON.parse(localStorage.getItem('userWishes') || '[]');
                const mainData = wishList.find(wish => wish.id === id);

                if (mainData) {
                    const additionalDataString = localStorage.getItem(`wish_data_${id}`);
                    const additionalData = additionalDataString ? JSON.parse(additionalDataString) : {};
                    
                    const fullData: WishData = {
                        toName: mainData.toName || 'Someone',
                        fromName: mainData.fromName || 'A friend',
                        message: mainData.message || 'Happy Birthday!',
                        template: mainData.template || 'night-sky',
                        closingMessages: additionalData.closingMessages || '',
                        secretMessage: additionalData.secretMessage || '',
                    };

                    setWishData(fullData);

                    // Update document title dynamically
                    document.title = `A Birthday Wish for ${fullData.toName}!`;

                }
            } catch (error) {
                console.error("Failed to load wish data", error);
            } finally {
                setLoading(false);
            }
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!wishData) {
      return <div>Template not found or data is missing.</div>;
    }

    const props = { 
        toName: wishData.toName,
        fromName: wishData.fromName,
        message: wishData.message
    };
    
    const urlParams = new URLSearchParams({
        toName: wishData.toName,
        fromName: wishData.fromName,
        message: wishData.message,
        closingMessages: wishData.closingMessages || '',
        secretMessage: wishData.secretMessage || ''
    });

    switch (wishData.template) {
        case 'night-sky':
            return <NightSkyTemplate {...props} />;
        case 'premium-night-sky':
        case 'celestial-wishes':
             if (typeof window !== 'undefined') {
                window.location.href = `/templates/${wishData.template}/index.html?${urlParams.toString()}`;
            }
            return null;
        default:
            return <NightSkyTemplate {...props} />;
    }
}


export default function WishPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen w-full items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <WishDisplay />
        </Suspense>
    );
}
