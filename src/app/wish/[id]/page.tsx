
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import NightSkyTemplate from '@/app/templates/night-sky/NightSkyTemplate';
import { Loader2 } from 'lucide-react';

interface WishData {
  id: string;
  toName: string;
  fromName: string;
  message: string;
  template: string;
  closingMessages?: string;
  secretMessage?: string;
  blowCandlesInstruction?: string;
  wishYouTheBestMessage?: string;
  letsBlowCandlesTitle?: string;
  thanksForWatchingTitle?: string;
  didYouLikeItMessage?: string;
  endMessage?: string;
  profilePhoto?: string;
  beautifulMemories?: { src: string }[];
  specialGiftMessage?: string;
  friendsMessages?: { name: string; message: string }[];
  saveKeepsakeMessage?: string;
}

function WishDisplay() {
    const params = useParams();
    const id = params.id as string;
    const [wishData, setWishData] = useState<WishData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined' && id) {
            try {
                const wishList: WishData[] = JSON.parse(localStorage.getItem('userWishes') || '[]');
                const fullData = wishList.find(wish => wish.id === id);

                if (fullData) {
                    setWishData(fullData);
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

    if (wishData.template === 'night-sky') {
        return <NightSkyTemplate toName={wishData.toName} fromName={wishData.fromName} message={wishData.message} />;
    }

    if (wishData.template === 'premium-night-sky' || wishData.template === 'celestial-wishes') {
        if (typeof window !== 'undefined') {
            // For premium templates, we pass the ID and let the template's JS fetch from localStorage
            const url = `/templates/${wishData.template}/index.html?id=${wishData.id}`;
            window.location.href = url;
        }
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4">Redirecting to your wish...</p>
            </div>
        );
    }

    return <NightSkyTemplate toName={wishData.toName} fromName={wishData.fromName} message={wishData.message} />;
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

    