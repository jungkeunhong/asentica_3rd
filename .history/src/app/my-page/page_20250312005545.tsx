'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFavorites } from '@/context/FavoritesContext';
import { ChevronLeftIcon, Heart, LogOut } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { createClient } from '@/utils/supabase/client';
import LoginModal from '@/components/LoginModal';
import { useRouter } from 'next/navigation';

// Define user type
interface UserProfile {
  id: string;
  email: string | undefined;
  name: string;
  avatar_url: string;
  created_at: string;
}

// Define MedSpa type for recently viewed and favorites
interface MedSpa {
  id: string;
  medspa_name: string;
  image_url1?: string;
  address?: string;
  location?: string;
  village?: string;
}

export default function MyPage() {
  const { favorites } = useFavorites();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<MedSpa | null>(null);
  const router = useRouter();
  
  // Check authentication status when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Set user data if logged in
          const { user: authUser } = session;
          
          setUser({
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
            avatar_url: authUser.user_metadata?.avatar_url || '/placeholder-user.jpg',
            created_at: new Date(authUser.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long'
            })
          });
          
          console.log('인증된 사용자 확인됨:', authUser.email);
        } else {
          // Show login modal if not logged in
          console.log('인증되지 않은 사용자, 로그인 모달 표시');
          setShowLoginModal(true);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Get recently viewed MedSpa from localStorage
    const getRecentlyViewed = () => {
      if (typeof window !== 'undefined') {
        const recentMedspa = localStorage.getItem('recentlyViewedMedspa');
        if (recentMedspa) {
          try {
            setRecentlyViewed(JSON.parse(recentMedspa));
          } catch (error) {
            console.error('Error parsing recently viewed MedSpa:', error);
          }
        }
      }
    };
    
    getRecentlyViewed();
    
    // 인증 상태 변경 감지
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // 로그인 이벤트 발생 시 사용자 정보 업데이트
        const { user: authUser } = session;
        
        setUser({
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
          avatar_url: authUser.user_metadata?.avatar_url || '/placeholder-user.jpg',
          created_at: new Date(authUser.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
          })
        });
        
        setShowLoginModal(false);
        console.log('로그인 이벤트 감지, 사용자 정보 업데이트');
      } else if (event === 'SIGNED_OUT') {
        // 로그아웃 이벤트 발생 시 사용자 정보 초기화
        setUser(null);
        setShowLoginModal(true);
        console.log('로그아웃 이벤트 감지, 사용자 정보 초기화');
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const handleLoginSuccess = () => {
    console.log('로그인 성공 처리');
    setShowLoginModal(false);
    
    // 로그인 성공 후 사용자 정보 업데이트
    const checkAuth = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { user: authUser } = session;
          
          setUser({
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
            avatar_url: authUser.user_metadata?.avatar_url || '/placeholder-user.jpg',
            created_at: new Date(authUser.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long'
            })
          });
          
          console.log('로그인 성공 후 사용자 정보 업데이트:', authUser.email);
        } else {
          console.error('로그인 성공 처리 중 세션을 찾을 수 없음');
          // 세션이 없으면 모달 다시 표시
          setShowLoginModal(true);
        }
      } catch (error) {
        console.error('로그인 성공 후 사용자 정보 업데이트 오류:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  };
  
  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      console.log('로그아웃 성공');
      // 로그아웃 후 홈페이지로 리다이렉트
      router.push('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-[#754731] animate-spin"></div>
        </div>
      </div>
    );
  }
  
  // 로그인되지 않은 경우 로그인 모달 표시
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => router.push('/')} 
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      
      {/* Only show MyPage content if user is logged in */}
      {user && (
        <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
          <div className="flex items-center mb-6">
            <Link href="/" className="text-black hover:underline">
              <ChevronLeftIcon className="h-6 w-6" />
            </Link>
            <h1 className="text-3xl font-semibold ml-auto mr-auto">Profile</h1>
            <Link href="/my-page/edit" className="text-black font-medium underline">
              Edit
            </Link>
          </div>
          
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden">
                  <Image 
                    src={user.avatar_url} 
                    alt="Profile" 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-rose-500 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                    <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-semibold">{user.name}</h2>
                <div className="flex flex-col md:flex-row md:gap-8 mt-4">
                  <div>
                    <p className="text-2xl font-semibold">{favorites.length}</p>
                    <p className="text-gray-600">Reviews</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{new Date(user.created_at).getFullYear()}</p>
                    <p className="text-gray-600">Years on Asentica</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Verified Information */}
          <div className="bg-white rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">{user.name}&apos;s confirmed information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-4">
                  <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                </svg>
                <p className="text-lg">Identity</p>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-4">
                  <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                </svg>
                <p className="text-lg">Email address</p>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-4">
                  <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                </svg>
                <p className="text-lg">Phone number</p>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/identity-verification" className="text-black underline font-medium">
                Learn about identity verification
              </Link>
            </div>
          </div>
          
          {/* Wishlists */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold">Wishlists</h2>
              <Link href="/edit-wishlists" className="text-black font-medium underline">
                Edit
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recently Viewed */}
              <div>
                {recentlyViewed ? (
                  <Link href={`/medspa/${recentlyViewed.id}`} className="block">
                    <div className="relative h-64 w-full rounded-xl overflow-hidden mb-2 hover:opacity-90 transition-opacity">
                      <Image 
                        src={recentlyViewed.image_url1 || '/placeholder-medspa.jpg'} 
                        alt={recentlyViewed.medspa_name || 'Recently Viewed MedSpa'} 
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <h4 className="text-white font-medium text-lg">{recentlyViewed.medspa_name}</h4>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="relative h-64 w-full rounded-xl overflow-hidden bg-gray-200 mb-2">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-16 h-16">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                )}
                <h3 className="text-xl font-medium">Recently viewed</h3>
              </div>
              
              {/* Saved Medspas */}
              {favorites.length > 0 ? (
                <div>
                  <div className="relative">
                    {favorites.length === 1 ? (
                      <Link href={`/medspa/${favorites[0].id}`} className="block">
                        <div className="relative h-64 w-full rounded-xl overflow-hidden mb-2 hover:opacity-90 transition-opacity">
                          <Image
                            src={favorites[0].image_url1 || '/placeholder-medspa.jpg'}
                            alt={favorites[0].medspa_name || 'MedSpa'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Link>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {favorites.slice(0, 4).map((favorite, index) => (
                          <Link key={favorite.id} href={`/medspa/${favorite.id}`} className="block">
                            <div className={`relative ${index < 2 ? 'h-32' : 'h-28'} w-full rounded-xl overflow-hidden hover:opacity-90 transition-opacity`}>
                              <Image
                                src={favorite.image_url1 || '/placeholder-medspa.jpg'}
                                alt={favorite.medspa_name || 'MedSpa'}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-medium">Favorite MedSpas</h3>
                  <p className="text-gray-600">{favorites.length} saved</p>
                </div>
              ) : (
                <div>
                  <div className="relative h-64 w-full rounded-xl overflow-hidden bg-gray-200 mb-2">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Heart className="h-16 w-16 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium">Favorite MedSpas</h3>
                  <p className="text-gray-600">0 saved</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 flex justify-between">
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <span className="text-xs mt-1">Explore</span>
            </div>
            <div className="flex flex-col items-center text-rose-500">
              <Heart className="w-6 h-6 fill-rose-500" />
              <span className="text-xs mt-1">Wishlists</span>
            </div>
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span className="text-xs mt-1">Appointments</span>
            </div>
            <div className="flex flex-col items-center relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              <span className="text-xs mt-1">Messages</span>
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">1</span>
            </div>
            <div className="flex flex-col items-center relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span className="text-xs mt-1">Profile</span>
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">1</span>
            </div>
          </div>
          
          {/* Sign Out Button - Now a floating button */}
          <button
            onClick={handleLogout}
            className="fixed bottom-24 right-6 bg-black text-white rounded-full p-4 shadow-lg hover:bg-gray-800 transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}
