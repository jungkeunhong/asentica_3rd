'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogIn, Menu, Search } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import LoginModal from './LoginModal';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SearchBar from './ui/SearchBar';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  
  const supabase = createClient();
  const router = useRouter();

  // 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Authentication check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    
    // 로그인 성공 시 my-page로 리다이렉트
    router.push('/my-page');
  };

  const toggleSidebar = () => {
    // 커스텀 이벤트를 발생시켜 MainLayout에 알림
    const event = new CustomEvent('toggle-sidebar');
    window.dispatchEvent(event);
    
    // 디버깅을 위한 콘솔 로그 추가
    console.log('Toggle sidebar event dispatched');
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-40 backdrop-blur-md bg-white/70 border-b border-gray-200/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-8">
          <div className="font-extrabold flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center">
              <span className="cormorant text-2xl text-black font-light tracking-tighter">Asentica</span>
            </Link>
            
            <div className="flex items-center">
              {/* 검색 버튼 */}
              <button
                onClick={toggleSearch}
                className="flex items-center p-2 rounded-full hover:bg-gray-100 transition-all duration-300 mr-2"
                aria-label="Search"
              >
                <Search size={20} className="text-gray-600" />
              </button>
              
              {/* Menu Button */}
              <button
                onClick={toggleSidebar}
                className="flex items-center px-3 py-2 hover:text-black transition-all duration-300"
                aria-label="Toggle menu"
              >
                <Menu size={24} className="text-black stroke-width-1 hover:text-black" />
              </button>
              
              {loading ? (
                <div className="w-6 h-6 rounded-full border-2 border-t-transparent border-[#754731] animate-spin"></div>
              ) : isAuthenticated ? (
                <Link 
                  href="/my-page" 
                  className="flex items-center gap-2 px-4 py-2 hover:text-black transition-all duration-300"
                >
                  <Image 
                    src="/icons/account.png" 
                    alt="My Account" 
                    width={24} 
                    height={24} 
                    priority={false}
                  /> 
                </Link>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 hover:text-black transition-all duration-300 -ml-4"
                  aria-label="Log in"
                >
                  <LogIn size={24} className="text-black stroke-width-1 hover:text-black" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 검색 바 컴포넌트 */}
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
