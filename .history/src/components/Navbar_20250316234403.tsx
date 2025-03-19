'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { LogIn, Menu, Search, X, Clock, ArrowRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import LoginModal from './LoginModal';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';

// 검색 제안 타입 정의
interface SearchSuggestion {
  id: number;
  text: string;
  type: string;
}

// 더미 검색 데이터
const dummySearchSuggestions: SearchSuggestion[] = [
  { id: 1, text: 'botox', type: 'treatment' },
  { id: 2, text: 'facial', type: 'treatment' },
  { id: 3, text: 'laser hair removal', type: 'treatment' },
  { id: 4, text: 'dermal fillers', type: 'treatment' },
  { id: 5, text: 'microdermabrasion', type: 'treatment' },
  { id: 6, text: 'chemical peel', type: 'treatment' },
  { id: 7, text: 'hydrafacial', type: 'treatment' },
  { id: 8, text: 'coolsculpting', type: 'treatment' },
  { id: 9, text: 'acne treatment', type: 'treatment' },
  { id: 10, text: 'skin rejuvenation', type: 'treatment' },
];

// 최근 검색어 저장 키
const RECENT_SEARCHES_KEY = 'recent_searches';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
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

  // 최근 검색어 로드
  useEffect(() => {
    const savedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // 검색어 변경 시 API 호출 (디바운스 적용)
  useEffect(() => {
    if (debouncedSearchQuery.trim() === '') {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        // 실제 API 호출 대신 더미 데이터 필터링
        const filteredSuggestions = dummySearchSuggestions.filter(item =>
          item.text.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
        
        // API 호출 시뮬레이션을 위한 지연
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setSuggestions(filteredSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchQuery]);

  // 검색창 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target as Node) &&
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 키보드 내비게이션
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;
    
    // 위 화살표
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    }
    // 아래 화살표
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev >= suggestions.length - 1 ? 0 : prev + 1));
    }
    // 엔터
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSearch(suggestions[selectedIndex].text);
      } else if (searchQuery.trim() !== '') {
        handleSearch(searchQuery);
      }
    }
    // ESC
    else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // 검색 실행
  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    
    // 최근 검색어에 추가
    const updatedRecentSearches = [
      query,
      ...recentSearches.filter(item => item !== query)
    ].slice(0, 5); // 최대 5개 저장
    
    setRecentSearches(updatedRecentSearches);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedRecentSearches));
    
    // 검색 결과 페이지로 이동
    router.push(`/search?q=${encodeURIComponent(query)}`);
    
    // 검색창 닫기
    setSearchQuery('');
    setShowSuggestions(false);
    setIsSearchOpen(false);
  };

  // 최근 검색어 삭제
  const removeRecentSearch = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedRecentSearches = [...recentSearches];
    updatedRecentSearches.splice(index, 1);
    setRecentSearches(updatedRecentSearches);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedRecentSearches));
  };

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
    if (!isSearchOpen) {
      // 검색창이 열릴 때 포커스
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      // 검색창이 닫힐 때 초기화
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-gray-200/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-8">
          <div className="font-extrabold flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center">
              <span className="cormorant text-2xl text-black font-light tracking-tighter">Asentica</span>
            </Link>
            
            <div className="flex items-center">
              {/* 검색 버튼 및 확장형 검색 바 */}
              <div className="relative mr-2">
                <button
                  onClick={toggleSearch}
                  className={`flex items-center p-2 rounded-full ${isSearchOpen ? 'bg-gray-100' : ''} hover:bg-gray-100 transition-all duration-300`}
                  aria-label="Search"
                >
                  {isSearchOpen ? (
                    <X size={20} className="text-gray-600" />
                  ) : (
                    <Search size={20} className="text-gray-600" />
                  )}
                </button>
                
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 'auto', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-0 z-10"
                    >
                      <div className="flex items-center bg-white rounded-full shadow-md">
                        <div className="relative flex-grow">
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder="Describe what you're looking for..."
                            className="w-64 py-2 pl-4 pr-10 rounded-l-full focus:outline-none"
                          />
                          {searchQuery && (
                            <button
                              onClick={() => setSearchQuery('')}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              aria-label="Clear search"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => handleSearch(searchQuery)}
                          className="bg-amber-900 hover:bg-amber-800 text-white p-2 rounded-r-full"
                          aria-label="Submit search"
                        >
                          <Search size={20} />
                        </button>
                      </div>
                      
                      {/* 검색어 자동완성 및 최근 검색어 */}
                      <AnimatePresence>
                        {showSuggestions && (
                          <motion.div
                            ref={suggestionsRef}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full right-0 mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden z-50"
                          >
                            {isLoading ? (
                              <div className="p-4 text-center">
                                <div className="w-6 h-6 mx-auto rounded-full border-2 border-t-transparent border-amber-900 animate-spin"></div>
                              </div>
                            ) : (
                              <div className="max-h-80 overflow-y-auto">
                                {/* 최근 검색어 */}
                                {recentSearches.length > 0 && searchQuery.trim() === '' && (
                                  <div className="p-2">
                                    <div className="text-xs font-medium text-gray-500 px-2 py-1">
                                      Recent Searches
                                    </div>
                                    {recentSearches.map((search, index) => (
                                      <div
                                        key={`recent-${index}`}
                                        onClick={() => handleSearch(search)}
                                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
                                      >
                                        <div className="flex items-center">
                                          <Clock size={16} className="text-gray-400 mr-2" />
                                          <span>{search}</span>
                                        </div>
                                        <button
                                          onClick={(e) => removeRecentSearch(index, e)}
                                          className="text-gray-400 hover:text-gray-600"
                                          aria-label="Remove search item"
                                        >
                                          <X size={16} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {/* 검색어 자동완성 */}
                                {suggestions.length > 0 ? (
                                  <div className="p-2">
                                    {searchQuery.trim() !== '' && (
                                      <div className="text-xs font-medium text-gray-500 px-2 py-1">
                                        Suggestions
                                      </div>
                                    )}
                                    {suggestions.map((suggestion, index) => (
                                      <div
                                        key={`suggestion-${suggestion.id}`}
                                        onClick={() => handleSearch(suggestion.text)}
                                        className={`flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md ${
                                          selectedIndex === index ? 'bg-gray-100' : ''
                                        }`}
                                      >
                                        <Search size={16} className="text-gray-400 mr-2" />
                                        <span>{suggestion.text}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  searchQuery.trim() !== '' && (
                                    <div className="p-4 text-center text-gray-500">
                                      No results found
                                    </div>
                                  )
                                )}
                                
                                {/* 검색 버튼 */}
                                {searchQuery.trim() !== '' && (
                                  <div
                                    onClick={() => handleSearch(searchQuery)}
                                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer border-t border-gray-200"
                                  >
                                    <div className="flex items-center">
                                      <Search size={16} className="text-amber-900 mr-2" />
                                      <span>Search for &ldquo;{searchQuery}&rdquo;</span>
                                    </div>
                                    <ArrowRight size={16} className="text-amber-900" />
                                  </div>
                                )}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
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

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
