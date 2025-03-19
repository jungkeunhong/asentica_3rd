'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, Users, LogIn, LogOut, X } from 'lucide-react';
import { MenuItem } from './MenuItem';
import LoginModal from '@/components/LoginModal';
import { createClient } from '@/utils/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  BadgeCheck, 
  BookmarkIcon, 
  Home, 
  PencilLine, 
  Settings, 
  User, 
  FileText, 
  History
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onCloseAction: () => void;
  isPermanent?: boolean;
}

type SidebarNavItem = {
  title: string
  href: string
  icon: React.ReactNode
}

const navItems: SidebarNavItem[] = [
  {
    title: "My Profile",
    href: "/my-page",
    icon: <User className="h-5 w-5" />,
  },
  {
    title: "Edit Profile",
    href: "/my-page/edit",
    icon: <PencilLine className="h-5 w-5" />,
  },
  {
    title: "Saved Content",
    href: "/my-page/saved",
    icon: <BookmarkIcon className="h-5 w-5" />,
  },
  {
    title: "Drafts",
    href: "/my-page/drafts",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Activity",
    href: "/my-page/activity",
    icon: <History className="h-5 w-5" />,
  },
  {
    title: "Badges",
    href: "/my-page/badges",
    icon: <BadgeCheck className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/my-page/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

export function Sidebar({ isOpen, onCloseAction, isPermanent = false }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
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
  
  // Handle click outside to close sidebar (only if not permanent)
  useEffect(() => {
    if (isPermanent) return;
    
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
  }, [isOpen, onCloseAction, isPermanent]);

  // Handle escape key to close sidebar (only if not permanent)
  useEffect(() => {
    if (isPermanent) return;
    
    const handleEscKey = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        onCloseAction();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onCloseAction, isPermanent]);
  
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
  
  // For permanent sidebar in layout, use a different class setup
  if (isPermanent) {
    return (
      <div className="hidden md:block md:w-64 md:flex-shrink-0 md:flex-col md:fixed md:inset-y-0">
        <div className="h-full flex flex-col bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="px-4 mb-5">
              <Link 
                href="/" 
                className={cn("font-bold text-xl", 
                  pathname === "/" ? "text-amber-700" : "text-amber-600"
                )}
              >
                Asentica
              </Link>
            </div>
            
            <SidebarNav />
            
            {isAuthenticated && (
              <div className="px-3 py-2 mt-2">
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
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
        className={`fixed top-0 left-0 h-full w-64 md:w-72 bg-white shadow-lg z-100 transform transition-transform duration-300 ease-in-out ${
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
                <SidebarNav />
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

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="w-full">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <Link 
            href="/"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            <Home className="h-5 w-5 text-gray-500" />
            <span>Home</span>
          </Link>
          <div className="my-3 h-px bg-gray-200" />
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Account
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100",
                  pathname === item.href ? "bg-amber-50 text-amber-800" : "text-gray-600"
                )}
              >
                <span className={cn(
                  "text-gray-500",
                  pathname === item.href ? "text-amber-600" : ""
                )}>
                  {item.icon}
                </span>
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 