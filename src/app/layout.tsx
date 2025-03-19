import type { Metadata } from "next";
import { Gotu, Inter, Roboto_Mono } from "next/font/google";
import { Cormorant } from 'next/font/google'
import "./globals.css";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { Analytics } from "@vercel/analytics/react"


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased ${gotu.variable} ${cormorant.variable} bg-white`}
        suppressHydrationWarning
      >
        <FavoritesProvider>
            {children}
        </FavoritesProvider>
        <Analytics />
      </body>
    </html>
  );
}

