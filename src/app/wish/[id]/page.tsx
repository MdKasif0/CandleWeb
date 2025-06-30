
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import type { Metadata } from 'next';
import { useSearchParams, useParams } from 'next/navigation';
import NightSkyTemplate from '@/app/templates/night-sky/NightSkyTemplate';
import PremiumNightSkyTemplate from '@/app/templates/premium-night-sky/PremiumNightSkyTemplate';
// import CelestialWishesTemplate from '@/app/templates/celestial-wishes/CelestialWishesTemplate';
import { Loader2 } from 'lucide-react';

interface WishData {
  toName: string;
  fromName: string;
  message: string;
  template: string;
  closingMessages?: string;
  secretMessage?: string;
}

// This is a workaround since we can't do async metadata generation in a client component easily.
// A server component wrapper would be the ideal solution.
// export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
//   // In a real app, you would fetch metadata based on the id.
//   // Since our data is in localStorage, we can't do that on the server.
//   // We'll rely on a client-side solution or static metadata for now.
//   return {
//     title: 'A Special Birthday Wish!',
//     description: 'A personalized birthday wish created with CandleWeb.',
//   };
// }

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
    
    const premiumProps = {
        ...props,
        closingMessages: wishData.closingMessages,
        secretMessage: wishData.secretMessage
    }

    switch (wishData.template) {
        case 'night-sky':
            return <NightSkyTemplate {...props} />;
        case 'premium-night-sky':
            // This template is pure HTML/CSS/JS, so we redirect to it.
            // A better approach would be a rewrite to a React component.
            if (typeof window !== 'undefined') {
                const urlParams = new URLSearchParams({
                    toName: wishData.toName,
                    fromName: wishData.fromName,
                    message: wishData.message,
                    closingMessages: wishData.closingMessages || '',
                    secretMessage: wishData.secretMessage || ''
                });
                window.location.href = `/premium-night-sky/index.html?${urlParams.toString()}`;
            }
            return null; // Should not be reached
        case 'celestial-wishes':
             if (typeof window !== 'undefined') {
                const urlParams = new URLSearchParams({
                    toName: wishData.toName,
                    fromName: wishData.fromName,
                    message: wishData.message,
                });
                window.location.href = `/celestial-wishes/celestial-wishes.html?${urlParams.toString()}`;
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
