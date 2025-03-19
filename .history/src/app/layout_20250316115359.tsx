import type { Metadata } from "next";
import { Gotu, Geist, Geist_Mono } from "next/font/google";
import { Cormorant } from 'next/font/google'
import "./globals.css";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { Analytics } from "@vercel/analytics/react"
import { initMixpanel } from '../lib/mixpanelClient';

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

const cormorant = Cormorant({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
});

export const metadata: Metadata = {
  title: 'Asentica - Find Your Perfect Medical Spa',
  description: 'Discover and book the best medical spa treatments near you.',
};

// initMixpanel 호출
initMixpanel();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Apply scroll styles only after hydration
    document.documentElement.setAttribute('data-minimalscrollbar', 'yes');
    document.documentElement.style.overflowX = 'hidden';
    document.documentElement.style.overflowY = 'hidden';
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'hidden';
  }, []);

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${gotu.variable} ${cormorant.variable} bg-white`}
      >
        <FavoritesProvider>
          <div className="min-h-screen flex flex-col bg-white">
            <main className="flex-grow bg-white">{children}</main>
          </div>
        </FavoritesProvider>
        <Analytics />
      </body>
    </html>
  );
}
