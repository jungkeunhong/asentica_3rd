'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 검색창이 열릴 때 포커스
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // 검색어 변경 시 API 호출
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        // 실제 API 호출 대신 더미 데이터 필터링
        const filteredSuggestions = dummySearchSuggestions.filter(item =>
          item.text.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        // API 호출 시뮬레이션을 위한 지연
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setSuggestions(filteredSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // 디바운스 처리
    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 키보드 내비게이션
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      onClose();
    }
  };

  // 검색 실행
  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    
    // 최근 검색어에 추가
    const savedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
    const recentSearches = savedSearches ? JSON.parse(savedSearches) : [];
    
    const updatedRecentSearches = [
      query,
      ...recentSearches.filter((item: string) => item !== query)
    ].slice(0, 5); // 최대 5개 저장
    
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedRecentSearches));
    
    // 검색 결과 페이지로 이동
    router.push(`/search?q=${encodeURIComponent(query)}`);
    
    // 검색창 닫기
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-white z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={onClose}
                className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </button>
              
              <div className="flex-1 flex items-center border-b border-gray-200">
                <Search size={20} className="text-gray-400 mr-3" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe what you're looking for..."
                  className="w-full py-3 focus:outline-none font-light text-lg"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
            
            {/* 검색 결과 */}
            <div className="mt-4">
              {isLoading ? (
                <div className="p-4 text-center">
                  <div className="w-6 h-6 mx-auto rounded-full border-2 border-t-transparent border-gray-300 animate-spin"></div>
                </div>
              ) : (
                <div>
                  {/* 검색어 자동완성 */}
                  {suggestions.length > 0 ? (
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={`suggestion-${suggestion.id}`}
                          onClick={() => handleSearch(suggestion.text)}
                          className={`flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer rounded-md ${
                            selectedIndex === index ? 'bg-gray-100' : ''
                          }`}
                        >
                          <Search size={16} className="text-gray-400 mr-3" />
                          <span className="font-light">{suggestion.text}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    searchQuery.trim() !== '' && (
                      <div className="p-4 text-center text-gray-500 font-light">
                        No results found
                      </div>
                    )
                  )}
                  
                  {/* 검색 버튼 */}
                  {searchQuery.trim() !== '' && (
                    <div
                      onClick={() => handleSearch(searchQuery)}
                      className="flex items-center justify-between px-4 py-3 mt-2 hover:bg-gray-100 cursor-pointer rounded-md"
                    >
                      <div className="flex items-center">
                        <Search size={16} className="text-gray-600 mr-3" />
                        <span className="font-light">Search for &ldquo;{searchQuery}&rdquo;</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 