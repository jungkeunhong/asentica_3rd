'use client';

import { useState } from 'react';
import { MenuToggle } from '@/components/ui/MenuToggle';
import { Sidebar } from '@/components/ui/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  
  return (
    <div className="min-h-screen">
      <MenuToggle onClick={toggleSidebar} isOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <main className="pt-16 px-4 md:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 