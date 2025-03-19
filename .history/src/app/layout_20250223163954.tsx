import type { Metadata } from "next";
import { Gotu, Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import "./globals.css";

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

const gotu = Gotu({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-gotu',
});

export const metadata: Metadata = {
  title: 'Asentica - Find Your Perfect Medical Spa',
  description: 'Discover and book the best medical spa treatments near you.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${gotu.variable}`}
      >
        <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b">
          <div className="container mx-auto px-4 h-full flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">Asentica</Link>
            <nav className="flex items-center space-x-4">
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </nav>
          </div>
        </div>
        <div className="pt-16"> 
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
