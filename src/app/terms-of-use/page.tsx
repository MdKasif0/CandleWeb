
'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function TermsOfUsePage() {
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
            <h1 className="text-4xl font-bold mb-8">Terms of Use</h1>
            
            <div className="flex items-center mb-10">
                <div className="w-1 h-6 bg-primary mr-4 rounded-full"></div>
                <p className="text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            <div className="space-y-8 text-foreground/80 leading-relaxed">
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-foreground">1. Agreement to Terms</h2>
                    <p>
                        By using the CandleWeb application (the "App"), you agree to be bound by these Terms of Use. If you disagree with any part of the terms, then you do not have permission to access the App.
                    </p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-foreground">2. User Content</h2>
                    <p>
                        You are responsible for the content you create, including names and messages ("User Content"). You grant CandleWeb a license to use this content to operate the App. You affirm that your content does not violate any third-party rights.
                    </p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-foreground">3. AI-Generated Content</h2>
                    <p>
                        The App uses AI to generate messages. We do not guarantee the accuracy or suitability of AI-generated content. You are responsible for reviewing and editing any AI-generated text.
                    </p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-foreground">4. Termination</h2>
                    <p>
                        We may terminate or suspend your access to our App at our sole discretion, without prior notice, for any reason, including a breach of these Terms.
                    </p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-foreground">5. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at <a href="mailto:mdkasifuddin123@gmail.com" className="text-primary underline">mdkasifuddin123@gmail.com</a>.
                    </p>
                </section>
            </div>
        </div>
      </div>
    </main>
  );
}
