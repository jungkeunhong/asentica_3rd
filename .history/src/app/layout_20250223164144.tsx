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
 
}
