'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFavorites } from '@/context/FavoritesContext';
import { User, Heart, MapPin, Star, ArrowLeft, Phone, Navigation } from 'lucide-react';
import Navbar from '@/components/Navbar';
import LoginModal from '@/components/LoginModal';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyPage() {
  const { favorites, removeFavorite } = useFavorites();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  
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
  
  // 이미지 인덱스 변경 함수
  const changeImageIndex = (medspaId, index) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [medspaId]: index
    }));
  };

  // 드래그 종료 처리 함수
  const handleDragEnd = (medspaId, info, totalImages) => {
    if (Math.abs(info.offset.x) < 50) return;
    
    const currentIndex = currentImageIndexes[medspaId] || 0;
    let newIndex;
    
    if (info.offset.x > 0) {
      // 오른쪽으로 드래그 (이전 이미지)
      newIndex = currentIndex - 1;
      if (newIndex < 0) newIndex = totalImages - 1;
    } else {
      // 왼쪽으로 드래그 (다음 이미지)
      newIndex = (currentIndex + 1) % totalImages;
    }
    
    changeImageIndex(medspaId, newIndex);
  };

  // 전화 연결 함수
  const handleCall = (number, e) => {
    e.stopPropagation();
    if (number) {
      window.location.href = `tel:${number}`;
    } else {
      alert('전화번호가 제공되지 않았습니다.');
    }
  };

  // 즐겨찾기 제거 함수
  const handleRemoveFavorite = (medspaId, e) => {
    e.stopPropagation();
    removeFavorite(medspaId);
  };

  // 메드스파 상세 페이지로 이동
  const handleMedspaClick = (medspaId) => {
    window.location.href = `/medspa/${medspaId}`;
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
          <h1 className="text-2xl font-bold mb-6">My Favorites</h1>
          
          {favorites.length === 0 ? (
            <div className="bg-white p-8 rounded-lg text-center">
              <Heart size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-4">You don't have any favorites yet</p>
              <Link href="/search" className="inline-flex items-center text-[#754731] hover:underline">
                <ArrowLeft size={16} className="mr-2" />
                Go to search
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {favorites.map((medspa) => {
                const imageUrls = [medspa.image_url1, medspa.image_url2, medspa.image_url3].filter(Boolean);
                const currentIndex = currentImageIndexes[medspa.id] || 0;
                
                return (
                  <div 
                    key={medspa.id}
                    onClick={() => handleMedspaClick(medspa.id)}
                    className="flex flex-col gap-4 bg-white border-b p-4 cursor-pointer hover:border-b"
                  >
                    <div className="flex gap-4">
                      <div className="flex flex-col w-32 gap-2">
                        {/* 이미지 슬라이더 구현 */}
                        <div className="relative w-32 h-32 overflow-hidden rounded-md">
                          {imageUrls.length > 0 ? (
                            <motion.div 
                              className="relative w-full h-full"
                              drag="x"
                              dragConstraints={{ left: 0, right: 0 }}
                              onDragEnd={(e, info) => handleDragEnd(medspa.id, info, imageUrls.length)}
                            >
                              {/* Remove from favorites button */}
                              <button 
                                className="absolute top-2 right-2 p-1 rounded-full z-10 bg-white/80 text-red-500 transition-all duration-200"
                                onClick={(e) => handleRemoveFavorite(medspa.id, e)}
                                aria-label="Remove from favorites"
                              >
                                <Heart size={18} className="fill-red-500" />
                              </button>
                              
                              <AnimatePresence initial={false} custom={1}>
                                <motion.div 
                                  key={currentIndex}
                                  custom={1}
                                  initial={{ 
                                    opacity: 0,
                                    x: 100 
                                  }}
                                  animate={{ 
                                    opacity: 1,
                                    x: 0,
                                    transition: { duration: 0.3 }
                                  }}
                                  exit={{ 
                                    opacity: 0,
                                    x: -100,
                                    transition: { duration: 0.3 }
                                  }}
                                  className="absolute w-full h-full"
                                >
                                  <Image 
                                    src={imageUrls[currentIndex]} 
                                    alt={`${medspa.medspa_name} image ${currentIndex + 1}`}
                                    width={128}
                                    height={128}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      objectPosition: 'center'
                                    }}
                                    priority={currentIndex === 0}
                                  />
                                </motion.div>
                              </AnimatePresence>
                              
                              {/* 이미지 인디케이터 (닷) */}
                              {imageUrls.length > 1 && (
                                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
                                  {imageUrls.map((_, index) => (
                                    <button
                                      key={index}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        changeImageIndex(medspa.id, index);
                                      }}
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        currentIndex === index 
                                          ? 'bg-white' 
                                          : 'bg-white/50'
                                      }`}
                                      aria-label={`Go to image ${index + 1}`}
                                    />
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          ) : (
                            <div className="text-gray-400">No Image</div>
                          )}
                        </div>
                      </div>

                      {/* Right side - Content */}
                      <div className="flex-1 flex flex-col">
                        {/* Medspa name and village */}
                        <h3 className="cormorant text-xl font-semibold text-black">
                          {medspa.medspa_name}
                        </h3>
                        <div className="flex items-center text-gray-500 text-[9px] mb-1">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span>{medspa.village}</span>
                        </div>
 
                        {/* Ratings */}
                        <div className="flex flex-col gap-2 mt-2">
                          {/* Google rating */}
                          <div className="flex items-center gap-1">
                            <Image src="/images/google-logo.png" alt="Google" width={24} height={24} />
                            <Star className="w-4 h-4 fill-current text-yellow-400" />
                            <span className="text-xs text-black">{medspa.google_star || ''}</span>
                            <span className="text-xs text-gray-500">({medspa.google_review || 0})</span>
                          </div>

                          {/* Yelp rating - 데이터가 있을 때만 표시 */}
                          {medspa.yelp_star && medspa.yelp_review && (
                            <div className="flex items-center gap-1">
                              <Image src="/images/yelp-logo.png" alt="Yelp" width={24} height={24} />
                              <Star className="w-4 h-4 fill-current text-red-500" />
                              <span className="text-xs text-black">{medspa.yelp_star}</span>
                              <span className="text-xs text-gray-500">({medspa.yelp_review})</span>
                            </div>
                          )}
                          {/* Free consultation button */}
                          <div className="flex gap-2">
                            {medspa.free_consultation && medspa.free_consultation.trim() !== '' ? (
                              <button className="gotu text-3xl bg-gray-200 text-gray-500 px-4 py-1 rounded-full text-sm">
                                {medspa.free_consultation}
                              </button>
                            ) : (
                              <button className="gotu text-3xl bg-gray-200 text-gray-500 px-4 py-1 rounded-full text-sm">
                                Paid Consultation
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Reviews - 이미지와 왼쪽 정렬 */}
                    <div className="mt-2 space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="min-w-[20px] w-5 h-5 flex-shrink-0 flex items-center justify-center">
                          <Image 
                            src="/icons/thumbup.png" 
                            alt="Positive" 
                            width={20} 
                            height={20}
                            className="w-6 h-6 text-black object-contain flex-shrink-0"
                          />
                        </div>
                        <span className="gotu text-sm text-black">{medspa.good_review_short || ""}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="min-w-[20px] w-5 h-5 flex-shrink-0 flex items-center justify-center">
                          <Image 
                            src="/icons/thumbdown.png" 
                            alt="Negative" 
                            width={20} 
                            height={20}
                            className="w-6 h-6 object-contain flex-shrink-0"
                          />
                        </div>
                        <span className="gotu text-sm text-black">{medspa.bad_review_short || ""}</span>
                      </div>
                    </div>

                    {/* Call and Consultation CTA Buttons */}
                    <div className="flex flex-row gap-3">
                      <button 
                        onClick={(e) => handleCall(medspa.number, e)}
                        className="btn bg-amber-800 hover:bg-amber-900 text-white border-none hover:shadow-lg transform flex items-center justify-center gap-2 w-12"
                        title="전화하기"
                        aria-label="전화하기"
                      >
                        <Phone size={16} />
                      </button>
                      <button 
                        className="btn bg-white hover:bg-amber-800 border border-amber-800 text-amber-800 hover:text-white hover:border-amber-800 hover:shadow-lg transform flex items-center justify-center gap-2 flex-1"
                      >
                        <span>Get Consultation</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}