
'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function TermsOfUsePage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 md:p-6 font-sans text-foreground">
      <div className="w-full max-w-4xl">
        <div className="relative mb-8 flex items-center justify-center py-4">
          <Link href="/account" className="absolute left-0 flex items-center text-muted-foreground transition-colors hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
            <span className="ml-1">Back</span>
          </Link>
          <h1 className="text-2xl font-bold">Terms of Use</h1>
        </div>
        
        <div className="prose dark:prose-invert max-w-none bg-card p-6 md:p-8 rounded-lg border">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <h2>1. Agreement to Terms</h2>
          <p>By using our application, CandleWeb (the "App"), you agree to be bound by these Terms of Use ("Terms"). If you do not agree to these Terms, do not use the App.</p>

          <h2>2. Changes to Terms or Services</h2>
          <p>We may modify the Terms at any time. If we do so, we’ll let you know either by posting the modified Terms on the site or through other communications. It’s important that you review the Terms whenever we modify them because if you continue to use the App after we have posted modified Terms, you are indicating to us that you agree to be bound by the modified Terms.</p>

          <h2>3. Who May Use the App</h2>
          <p>You may use the App only if you are 13 years or older and are not barred from using the App under applicable law.</p>

          <h2>4. Privacy Policy</h2>
          <p>Please refer to our <Link href="/privacy-policy">Privacy Policy</Link> for information on how we collect, use, and disclose information from our users.</p>

          <h2>5. User Content</h2>
          <p>For purposes of these Terms, "User Content" means text, and other works of authorship that you provide to be made available through the App. This includes names, messages, and any other personalization details you provide.</p>
          <p>By making any User Content available through the App you hereby grant to CandleWeb a non-exclusive, transferable, worldwide, royalty-free license to use, copy, modify, and distribute your User Content in connection with operating and providing the App.</p>
          <p>You are solely responsible for all your User Content. You represent and warrant that you own all your User Content or you have all rights that are necessary to grant us the license rights in your User Content under these Terms.</p>

          <h2>6. AI-Generated Content</h2>
          <p>The App may use generative artificial intelligence (AI) to create birthday messages. While we strive to provide high-quality and appropriate content, we cannot guarantee the uniqueness, accuracy, or suitability of AI-generated content. You are responsible for reviewing and editing any AI-generated content before use.</p>

          <h2>7. General Prohibitions</h2>
          <p>You agree not to do any of the following:</p>
          <ul>
            <li>Post, upload, publish, submit or transmit any User Content that: (i) infringes, misappropriates or violates a third party’s patent, copyright, trademark, trade secret, moral rights or other intellectual property rights, or rights of publicity or privacy; (ii) is fraudulent, false, misleading or deceptive; (iii) is defamatory, obscene, pornographic, vulgar or offensive;</li>
            <li>Use, display, mirror or frame the App or any individual element within the App, CandleWeb’s name, any CandleWeb trademark, logo or other proprietary information, or the layout and design of any page or form contained on a page, without CandleWeb’s express written consent;</li>
            <li>Attempt to probe, scan or test the vulnerability of any CandleWeb system or network or breach any security or authentication measures;</li>
            <li>Avoid, bypass, remove, deactivate, impair, descramble or otherwise circumvent any technological measure implemented by CandleWeb or any of CandleWeb’s providers or any other third party (including another user) to protect the App.</li>
          </ul>

          <h2>8. Termination</h2>
          <p>We may terminate your access to and use of the App, at our sole discretion, at any time and without notice to you. You may cancel your account at any time by sending an email to us at mdkasifuddin123@gmail.com.</p>
          
          <h2>9. Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us at <a href="mailto:mdkasifuddin123@gmail.com">mdkasifuddin123@gmail.com</a>.</p>
        </div>
      </div>
    </main>
  );
}
