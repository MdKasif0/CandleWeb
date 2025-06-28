
'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 font-sans text-foreground">
      <div className="w-full max-w-2xl">
        <header className="relative mb-8 flex h-14 items-center">
            <Link href="/account" className="absolute left-0 flex items-center text-muted-foreground transition-colors hover:text-foreground">
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Back</span>
            </Link>
        </header>
        
        <div className="px-2">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            
            <div className="flex items-center mb-10">
                <div className="w-1 h-6 bg-primary mr-4 rounded-full"></div>
                <p className="text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            <div className="space-y-8 text-foreground/80 leading-relaxed">
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-foreground">1. Introduction</h2>
                    <p>
                        Welcome to CandleWeb. We are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our application.
                    </p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-foreground">2. Information We Collect</h2>
                    <p>
                        We collect your email, name, and profile picture for account management via Firebase Authentication. Wish content (names, messages) is stored locally in your browser and is not sent to our servers.
                    </p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-foreground">3. Use of Information</h2>
                    <p>
                        Your information is used to provide and improve our services, authenticate your account, and analyze app usage to enhance user experience. We do not sell your personal information.
                    </p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-foreground">4. Data Storage and Security</h2>
                    <p>
                        Account information is securely stored by Google Firebase. Wish content is stored on your device. We take reasonable measures to protect your data, but no system is 100% secure.
                    </p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-foreground">5. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at <a href="mailto:mdkasifuddin123@gmail.com" className="text-primary underline">mdkasifuddin123@gmail.com</a>.
                    </p>
                </section>
            </div>
        </div>
      </div>
    </main>
  );
}
