'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, LogIn } from 'lucide-react'; // 트렌디한 아이콘 라이브러리
import { createClient } from '@/utils/supabase/client';
import LoginModal from './LoginModal';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // 초기 인증 상태 확인
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
    console.log('로그인 성공, my-page로 리다이렉트');
    router.push('/my-page');
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-gray-200/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-8">
          <div className="font-extrabold flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center">
              <span className="cormorant text-2xl text-black drop-shadow-xs">Asentica</span>
            </Link>
            {loading ? (
              <div className="w-6 h-6 rounded-full border-2 border-t-transparent border-[#754731] animate-spin"></div>
            ) : isAuthenticated ? (
              <Link 
                href="/my-page" 
                className="flex items-center gap-2 px-4 py-2 hover:text-black transition-all duration-300"
              >
                <User size={24} className="text-[#754731] hover:text-black" />
              </Link>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 hover:text-black transition-all duration-300"
              >
                <LogIn size={24} className="text-[#754731] hover:text-black" />
              </button>
            )}
          </div>
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
