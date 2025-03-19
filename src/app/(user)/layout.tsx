'use client';

import Navbar from '@/components/Navbar';
import { MainLayout as SidebarLayout } from '@/components/layouts/MainLayout';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarLayout>
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-grow bg-white pt-16">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white py-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarLayout>
  );
} 