import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import Script from "next/script";
import ParticleBackground from "@/components/ParticleBackground";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL("https://candleweb.netlify.app"),
  applicationName: "CandleWeb",
  title: {
    default: "CandleWeb: Personalized Birthday Websites",
    template: "%s | CandleWeb",
  },
  description: "Create and share beautiful, personalized AI-powered 'Happy Birthday' websites in minutes. A unique way to celebrate friends and loved ones.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/candleweb-icon.png",
    shortcut: "/candleweb-icon.png",
    apple: "/candleweb-icon.png",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  openGraph: {
    title: "CandleWeb: Personalized Birthday Websites",
    description: "Create and share beautiful, personalized AI-powered 'Happy Birthday' websites in minutes.",
    url: "https://candleweb.netlify.app",
    siteName: 'CandleWeb',
    images: [
      {
        url: '/candleweb-cover.png',
        width: 1200,
        height: 630,
        alt: 'CandleWeb social sharing image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "CandleWeb: Personalized Birthday Websites",
    description: "Create and share beautiful, personalized AI-powered 'Happy Birthday' websites in minutes.",
    images: ['/candleweb-cover.png'],
  },
  keywords: ['birthday wishes', 'personalized birthday', 'ai message generator', 'ecard', 'digital birthday card', 'happy birthday website'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ParticleBackground />
        <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              disableTransitionOnChange
            >
            {children}
            <Toaster />
            </ThemeProvider>
        </AuthProvider>
        <Script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" strategy="afterInteractive" />
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            // Only initialize OneSignal on the production domain to avoid errors in development
            if (window.location.hostname === 'candleweb.netlify.app') {
              window.OneSignalDeferred = window.OneSignalDeferred || [];
              OneSignalDeferred.push(async function(OneSignal) {
                await OneSignal.init({
                  appId: "${process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID}",
                  safari_web_id: "web.onesignal.auto.27be598e-7a22-4ed6-a01a-10378439b214",
                  notifyButton: {
                    enable: true,
                  },
                });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
