
'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import NightSkyTemplate from '@/app/templates/night-sky/NightSkyTemplate';
import { Loader2 } from 'lucide-react';

function WishPreviewDisplay() {
    const searchParams = useSearchParams();

    // The data is read directly from URL search parameters for the preview.
    const wishData = {
        toName: searchParams.get('toName') || 'Someone',
        fromName: searchParams.get('fromName') || 'A Friend',
        message: searchParams.get('message') || 'Wishing you a day filled with happiness and a year filled with joy. Happy birthday!',
        template: searchParams.get('template') || 'night-sky',
    };

    const props = {
        toName: wishData.toName,
        fromName: wishData.fromName,
        message: wishData.message,
    };
    
    // For now, only NightSkyTemplate is handled here as it's the only non-static one.
    switch (wishData.template) {
        case 'night-sky':
            return <NightSkyTemplate {...props} />;
        default:
            return <div>Template preview not available.</div>;
    }
}

export default function WishPreviewPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen w-full items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <WishPreviewDisplay />
        </Suspense>
    );
}
