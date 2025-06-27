import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://candleweb.netlify.app"),
  applicationName: "CandleWeb",
  title: {
    default: "CandleWeb - Personalized Birthday Websites",
    template: "%s | CandleWeb",
  },
  description: "Create and share beautiful, personalized AI-powered 'Happy Birthday' websites in minutes. A unique way to celebrate friends and loved ones.",
  manifest: "/manifest.webmanifest",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c2e" },
  ],
  openGraph: {
    title: "CandleWeb - Personalized Birthday Websites",
    description: "Create and share beautiful, personalized AI-powered 'Happy Birthday' websites in minutes.",
    url: "https://candleweb.netlify.app",
    siteName: 'CandleWeb',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
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
    title: "CandleWeb - Personalized Birthday Websites",
    description: "Create and share beautiful, personalized AI-powered 'Happy Birthday' websites in minutes.",
    images: ['https://placehold.co/1200x630.png'],
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
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-E3DSBX4H5C"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-E3DSBX4H5C');
          `}
        </Script>
      </body>
    </html>
  );
}
