
'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 md:p-6 font-sans text-foreground">
      <div className="w-full max-w-4xl">
        <div className="relative mb-8 flex items-center justify-center py-4">
          <Link href="/account" className="absolute left-0 flex items-center text-muted-foreground transition-colors hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
            <span className="ml-1">Back</span>
          </Link>
          <h1 className="text-2xl font-bold">Privacy Policy</h1>
        </div>
        
        <div className="prose dark:prose-invert max-w-none bg-card p-6 md:p-8 rounded-lg border">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <p>This Privacy Policy describes how CandleWeb ("we", "us", or "our") collects, uses, and discloses your information in connection with your use of our application (the "App").</p>

          <h2>1. Information We Collect</h2>
          <p>We collect information in the following ways:</p>
          <ul>
            <li><strong>Information You Provide to Us:</strong>
              <ul>
                <li><strong>Account Information:</strong> When you create an account, we collect your email address, and optionally, your name and profile picture. This information is handled via Firebase Authentication.</li>
                <li><strong>Wish Content:</strong> We collect the names and messages you provide when creating a birthday wish ("User Content"). This information is stored locally on your device's browser storage (localStorage) and is not transmitted to our servers.</li>
              </ul>
            </li>
            <li><strong>Information Collected Automatically:</strong> We may collect information about your device and usage of our App, such as IP address, browser type, and operating system, through standard web logs and analytics tools like Google Analytics.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our App;</li>
            <li>Personalize your experience;</li>
            <li>Authenticate users and secure your account;</li>
            <li>Communicate with you, including responding to your inquiries;</li>
            <li>Analyze usage and trends to improve our App.</li>
          </ul>
          
          <h2>3. How We Share Your Information</h2>
          <p>We do not sell your personal information. We may share information as follows:</p>
          <ul>
            <li><strong>With Service Providers:</strong> We use third-party service providers to help us operate our App, such as Google Firebase for authentication and Google Analytics for usage analysis. These providers have access to your information only to perform services on our behalf and are obligated not to disclose or use it for any other purpose.</li>
            <li><strong>For Legal Reasons:</strong> We may disclose information if we believe it's required by law, regulation, or legal process.</li>
          </ul>

          <h2>4. Data Storage and Security</h2>
          <p>Your account information (email, name, photo) is securely stored by Google Firebase. Your created wishes (names, messages, template choices) are stored in your browser's localStorage. This means they remain on your device and are not uploaded to our servers. We take reasonable measures to protect your information, but no security system is impenetrable.</p>
          
          <h2>5. Your Choices</h2>
          <p>You can access and modify your account information through the "My Account" page in the App. You can also delete your created wishes from the dashboard, which removes them from your browser's localStorage. If you wish to delete your account entirely, please contact us.</p>
          
          <h2>6. Children's Privacy</h2>
          <p>Our App is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.</p>

          <h2>7. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. If we make material changes, we will notify you by posting the new policy on this page.</p>

          <h2>8. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:mdkasifuddin123@gmail.com">mdkasifuddin123@gmail.com</a>.</p>
        </div>
      </div>
    </main>
  );
}
