'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Listen for toggle-sidebar event from Navbar
  useEffect(() => {
    const handleToggleSidebar = () => {
      setIsSidebarOpen(prev => !prev);
    };
    
    window.addEventListener('toggle-sidebar', handleToggleSidebar);
    
    return () => {
      window.removeEventListener('toggle-sidebar', handleToggleSidebar);
    };
  }, []);
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  
  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className={`transition-all duration-300 ${
        isSidebarOpen && !isMobile ? 'ml-64' : 'ml-0'
      }`}>
        {children}
      </div>
    </>
  );
} 