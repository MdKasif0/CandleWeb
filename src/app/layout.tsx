import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";

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
      </body>
    </html>
  );
}
