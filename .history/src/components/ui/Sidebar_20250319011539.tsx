'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, Users, LogIn, LogOut, X } from 'lucide-react';
import { MenuItem } from './MenuItem';
import LoginModal from '@/components/LoginModal';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  User, 
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

export function Sidebar({ isOpen, onCloseAction }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();
  const supabase = createClient();
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Authentication check error:', error);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);
  
  // Handle login success
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    onCloseAction(); // Close the sidebar
    
    // Redirect to my-page
    router.push('/my-page');
  };
  
  // Enhanced click outside handler with capture phase for better detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If sidebar is open and click is outside the sidebar
      if (isOpen && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target as Node)) {
        onCloseAction();
      }
    };
    
    // Use the capture phase for more reliable event detection
    document.addEventListener('mousedown', handleClickOutside, true);
    
    // Prevent scrolling when sidebar is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.body.style.overflow = '';
    };
  }, [isOpen, onCloseAction]);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        onCloseAction();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onCloseAction]);
  
  // Handle close button click with stopPropagation to prevent event bubbling
  const handleCloseButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    onCloseAction();
  };
  
  // Handle login button click
  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
    onCloseAction(); // Close the sidebar when opening the login modal
  };
  
  // Handle community click
  const handleCommunityClick = () => {
    router.push('/community');
    onCloseAction();
  };

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };
  
  return (
    <>
      {/* Overlay - detect clicks outside the sidebar */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-40"
          aria-hidden="true"
          onClick={onCloseAction}
        />
      )}
      
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 md:w-72 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="cormorant text-xl text-black tracking-tighter">Asentica</h2>
            <button 
              onClick={handleCloseButtonClick}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 active:bg-gray-200"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <MenuItem href="/search" icon={<Search size={20} />} onClick={onCloseAction}>
              Find medspa
            </MenuItem>
            <MenuItem href="/community" icon={<Users size={20} />} onClick={handleCommunityClick}>
              Explore community
            </MenuItem>
            {isAuthenticated ? (
              <>
                <MenuItem href="/my-page" icon={<User size={20} />} onClick={onCloseAction}>
                  My Account
                </MenuItem>
                
                
                <div className="pt-4">
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div 
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={handleLoginClick}
              >
                <span className="text-amber-900"><LogIn size={20} /></span>
                <span>Login</span>
              </div>
            )}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t text-xs text-gray-500">
            <p>© 2024 Asentica. All rights reserved.</p>
          </div>
        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
} 