'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, Users, LogIn, LogOut, X } from 'lucide-react';
import { MenuItem } from './MenuItem';
import LoginModal from '@/components/LoginModal';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { 
  BadgeCheck, 
  BookmarkIcon, 
  PencilLine, 
  Settings, 
  User, 
  FileText, 
  History
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
  
  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target as Node)) {
        onCloseAction();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    // Prevent scrolling when sidebar is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
        onClick={onCloseAction}
      />
      
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 md:w-72 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="cormorant text-xl font-semibold text-black tracking-tighter">Asentica</h2>
            <button 
              onClick={onCloseAction}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
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
                
                <div className="pt-2 pb-2">
                  <div className="my-2 h-px bg-gray-200" />
                  <div className="space-y-1 px-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
                        onClick={onCloseAction}
                      >
                        <span className="text-gray-500">{item.icon}</span>
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                
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