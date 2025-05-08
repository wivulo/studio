import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Snake Mania',
  description: 'A classic snake game built with Next.js and Firebase Studio.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased h-full flex flex-col overflow-hidden`}>
        <div className="flex-grow flex flex-col overflow-hidden">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
