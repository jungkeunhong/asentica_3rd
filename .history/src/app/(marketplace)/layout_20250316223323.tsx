'use client';

import Navbar from '@/components/Navbar';
import { MainLayout } from '@/components/layouts/MainLayout';

export default function FullWidthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout>
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-grow bg-white pt-16">
          {children}
        </main>      
      </div>
    </MainLayout>
  );
} 