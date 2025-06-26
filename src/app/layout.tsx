import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Happy Birthday Kasif',
  description: 'An interactive birthday wishes experience',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
