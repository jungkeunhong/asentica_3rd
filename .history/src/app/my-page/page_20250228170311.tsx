'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFavorites } from '@/context/FavoritesContext';
import { User, Heart, MapPin, Star, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import LoginModal from '@/components/LoginModal';
import { createClient } from '@/utils/supabase/client';

export default function MyPage() {
  const { favorites } = useFavorites();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // 로그인 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // 로그인된 사용자 정보 설정
          setUser(session.user);
        } else {
          // 로그인되지 않은 경우 로그인 모달 표시
          setShowLoginModal(true);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // 로그인 성공 처리
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // 로그인 후 사용자 정보 다시 가져오기
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };
    fetchUser();
  };
  
  // 로딩 중 표시
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--beige-bg)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#754731]"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[var(--beige-bg)]">
      <Navbar />
      
      {/* 로그인 모달 */}
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      
      {/* 사용자가 로그인한 경우에만 MyPage 내용 표시 */}
      {user && (
        <div className="container mx-auto px-4 pt-24 pb-12">
          {/* 기존 MyPage 내용 */}
          {/* ... */}
        </div>
      )}
    </div>
  );
}
