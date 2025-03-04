'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {  MapPin, Navigation, Phone, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import SearchFilters, { FilterType } from '@/components/SearchFilters';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import ConsultationModal from '@/components/ConsultationModal';
import LoginModal from '@/components/LoginModal';
import { useFavorites } from '@/context/FavoritesContext';
import { createClient } from '@/utils/supabase/client';
import { MedspaRatings } from "@/components/ui/medspa-ratings";
import { XMarkIcon } from '@heroicons/react/24/outline';

const DynamicMap = dynamic(() => import('@/components/DynamicMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-lg bg-gray-200 flex items-center justify-center">
      <p className="text-gray-500">loading map...</p>
    </div>
  )
});

interface Medspa {
  id: string;
  medspa_name: string;
  village: string;
  location: string;
  address?: string;
  number?: string;
  google_star?: number;
  google_review?: number;
  yelp_star?: number;
  yelp_review?: number;
  best_treatment?: string;
  free_consultation?: string;
  good_review_short?: string;
  bad_review_short?: string;
  treatment1?: string;
  treatment2?: string;
  treatment3?: string;
  treatment4?: string;
  treatment5?: string;
  treatment6?: string;
  price1?: string;
  price2?: string;
  price3?: string;
  price4?: string;
  price5?: string;
  price6?: string;
  image_url1: string;
  image_url2: string; 
  image_url3: string;
  lat?: number;
  lng?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface SearchContentProps {
  initialMedspas: Medspa[];
  searchQuery: string;
  error?: Error;
}

export default function SearchContent({
  initialMedspas,
  searchQuery,
  error,
}: SearchContentProps) {
  if (error) {
    throw error;
  }

  const [medspas, setMedspas] = useState<Medspa[]>(initialMedspas as Medspa[]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedMedspa, setSelectedMedspa] = useState<Medspa | null>(null);
  
  // 로그인 모달 상태 추가
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const scrollThreshold = useRef(false);
  
  const router = useRouter();
  

  const [showMap, setShowMap] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{[key: string]: number}>({});
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(null);

  // Favorites context
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  
  // Toggle favorite status
  const toggleFavorite = (medspa: Medspa) => {
    // 로그인 상태 확인
    const checkLoginStatus = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // 로그인된 경우 즐겨찾기 토글
        if (isFavorite(medspa.id)) {
          removeFavorite(medspa.id);
        } else {
          addFavorite(medspa);
        }
      } else {
        // 로그인되지 않은 경우 로그인 모달 표시
        setSelectedMedspa(medspa);
        setShowLoginModal(true);
      }
    };
    
    checkLoginStatus();
  };

  // 로그인 성공 핸들러
  const handleLoginSuccess = () => {
    console.log('로그인 성공, 현재 페이지 유지');
    setIsLoggedIn(true);
    setShowLoginModal(false);
    
    // 로그인 성공 후 즐겨찾기 추가 (선택된 메드스파가 있는 경우)
    if (selectedMedspa) {
      addFavorite(selectedMedspa);
    }
    
    // 로그인 성공 후 상담 모달 표시 (선택된 메드스파가 있는 경우)
    if (selectedMedspa && scrollThreshold.current) {
      setIsConsultationModalOpen(true);
    }
  };

  // 사용자 위치 상태
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          console.log('Error getting location');
        }
      );
    }
  }, []);

  // 메드스파 좌표 설정
  const coordinatesProcessed = useRef(false);
  
  useEffect(() => {
    // 이미 처리했으면 다시 처리하지 않음
    if (coordinatesProcessed.current) {
      return;
    }
    
    console.log('Processing coordinates for medspas');
    
    // lat, lng 값을 coordinates 객체로 변환
    const medspaWithCoordinates = medspas.map(medspa => {
      // 좌표가 유효한지 확인 (null, undefined, NaN 체크)
      const hasValidLat = medspa.lat !== null && medspa.lat !== undefined && !isNaN(medspa.lat);
      const hasValidLng = medspa.lng !== null && medspa.lng !== undefined && !isNaN(medspa.lng);
      
      // 좌표가 유효한 경우에만 coordinates 객체 생성
      const coords = (hasValidLat && hasValidLng) ? {
        lat: medspa.lat as number,
        lng: medspa.lng as number
      } : undefined;
      
      // 좌표가 없는 경우 로그 출력
      if (!coords) {
        console.warn(`MedSpa ${medspa.id} (${medspa.medspa_name}) is missing valid coordinates`);
      } else {
        console.log(`MedSpa ${medspa.id} - lat: ${medspa.lat}, lng: ${medspa.lng}, coords:`, coords);
      }
      
      return {
        ...medspa,
        coordinates: coords
      };
    });
    
    // 콘솔에 좌표가 있는 MedSpa 수 출력
    const medspaWithValidCoords = medspaWithCoordinates.filter(m => m.coordinates);
    console.log(`${medspaWithValidCoords.length} out of ${medspaWithCoordinates.length} MedSpas have valid coordinates`);
    
    // 상태 업데이트
    setMedspas(medspaWithCoordinates as Medspa[]);
    
    // 처리 완료 표시
    coordinatesProcessed.current = true;
  }, [medspas]);

  // 거리 계산 함수 (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // 지구 반경 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceKm = R * c;
    // Convert to miles
    return distanceKm * 0.621371;
  };

  // Helper function to find treatment price based on search query
  const findTreatmentPrice = (medspa: Medspa, query: string) => {
    try {
      const treatments = [
        { treatment: medspa.treatment1, price: medspa.price1 },
        { treatment: medspa.treatment2, price: medspa.price2 },
        { treatment: medspa.treatment3, price: medspa.price3 },
        { treatment: medspa.treatment4, price: medspa.price4 },
        { treatment: medspa.treatment5, price: medspa.price5 },
        { treatment: medspa.treatment6, price: medspa.price6 },
      ];
      const matchingTreatment = treatments.find(t => 
        t.treatment && typeof t.treatment === 'string' && t.treatment.toLowerCase().includes(query.toLowerCase())
      );

      return matchingTreatment?.price || '';
    } catch (error) {
      console.error('Error finding treatment price:', error);
      return '';
    }
  };
  
  // Helper function to find treatment price as a number for sorting
  const findTreatmentPriceNumber = useCallback((medspa: Medspa, query: string): number => {
    try {
      const priceStr = findTreatmentPrice(medspa, query);
      if (!priceStr) return Infinity; // 가격 정보가 없으면 맨 뒤로
      
      // 가격 문자열에서 숫자만 추출 (예: "$100" -> 100)
      const priceMatch = priceStr.match(/\$?(\d+)/);
      return priceMatch ? parseInt(priceMatch[1], 10) : Infinity;
    } catch (error) {
      console.error('Error converting price to number:', error);
      return Infinity;
    }
  }, []);

  // Basic stemming function to improve search matching
  const stemWord = (word: string): string => {
    if (!word || word.length < 3) return word;
    
    const stemmed = word.toLowerCase();
    
    // Common suffixes
    const suffixes = [
      'ing', 'ed', 's', 'es', 'ies', 'ly', 'ment', 'ness', 'tion', 'sion'
    ];
    
    // Special cases for medical treatments
    const specialCases: Record<string, string> = {
      'botox': 'botox',
      'fillers': 'filler',
      'filling': 'filler',
      'filled': 'filler',
      'lasers': 'laser',
      'lasering': 'laser',
      'facial': 'facial',
      'facials': 'facial',
      'peels': 'peel',
      'peeling': 'peel',
      'microneedling': 'microneedle',
      'needling': 'needle',
      'sculpting': 'sculpt',
      'sculpted': 'sculpt',
      'treatment': 'treat',
      'treatments': 'treat',
      'treating': 'treat',
      'treated': 'treat',
      'removal': 'remove',
      'removing': 'remove',
      'removed': 'remove',
      'injection': 'inject',
      'injections': 'inject',
      'injecting': 'inject',
      'injected': 'inject'
    };
    
    // Check for special cases first
    if (specialCases[stemmed]) {
      return specialCases[stemmed];
    }
    
    // Try to remove common suffixes
    for (const suffix of suffixes) {
      if (stemmed.endsWith(suffix) && stemmed.length > suffix.length + 2) {
        return stemmed.slice(0, -suffix.length);
      }
    }
    
    return stemmed;
  };

  // Function to highlight matching terms in text
  const highlightMatches = (text: string, searchTerms: string[]): React.ReactNode => {
    if (!text || !searchTerms.length) return text;
    
    const lowerText = text.toLowerCase();
    const segments: { text: string; isMatch: boolean }[] = [];
    let lastIndex = 0;
    
    // Find all matches and their positions
    const matches: { start: number; end: number }[] = [];
    
    searchTerms.forEach(term => {
      if (term.length < 2) return;
      
      let startIndex = 0;
      while (startIndex < lowerText.length) {
        const index = lowerText.indexOf(term, startIndex);
        if (index === -1) break;
        
        matches.push({ start: index, end: index + term.length });
        startIndex = index + 1;
      }
    });
    
    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);
    
    // Merge overlapping matches
    const mergedMatches: { start: number; end: number }[] = [];
    matches.forEach(match => {
      const lastMatch = mergedMatches[mergedMatches.length - 1];
      
      if (lastMatch && match.start <= lastMatch.end) {
        // Matches overlap, merge them
        lastMatch.end = Math.max(lastMatch.end, match.end);
      } else {
        // No overlap, add as new match
        mergedMatches.push({ ...match });
      }
    });
    
    // Create segments based on matches
    mergedMatches.forEach(match => {
      // Add non-matching segment before current match
      if (match.start > lastIndex) {
        segments.push({
          text: text.substring(lastIndex, match.start),
          isMatch: false
        });
      }
      
      // Add matching segment
      segments.push({
        text: text.substring(match.start, match.end),
        isMatch: true
      });
      
      lastIndex = match.end;
    });
    
    // Add remaining text after last match
    if (lastIndex < text.length) {
      segments.push({
        text: text.substring(lastIndex),
        isMatch: false
      });
    }
    
    // If no matches were found, return the original text
    if (segments.length === 0) {
      return text;
    }
    
    // Render segments with highlights
    return (
      <>
        {segments.map((segment, i) => 
          segment.isMatch ? (
            <mark key={i} className="bg-yellow-100 font-medium px-0.5 rounded">
              {segment.text}
            </mark>
          ) : (
            segment.text
          )
        )}
      </>
    );
  };

  // 필터링된 MedSpa 목록
  const filteredMedspas = useMemo(() => {
    if (!medspas.length) return [];
    
    let medspasCopy = [...medspas];
    
    // 검색어가 있는 경우에만 검색어로 필터링
    if (searchQuery.trim()) {
      // 검색어를 개별 단어로 분리
      const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
      
      // 검색어의 stemmed 버전도 준비
      const stemmedSearchTerms = searchTerms.map(term => stemWord(term));
      
      // 각 메드스파에 점수 부여
      const scoredMedspas = medspasCopy.map(medspa => {
        let score = 0;
        const fieldsToSearch = [
          medspa.medspa_name,
          medspa.village,
          medspa.location,
          medspa.best_treatment,
          medspa.treatment1,
          medspa.treatment2,
          medspa.treatment3,
          medspa.treatment4,
          medspa.treatment5,
          medspa.treatment6
        ];
        
        // 각 검색어에 대해 점수 계산
        searchTerms.forEach((term, idx) => {
          const stemmedTerm = stemmedSearchTerms[idx];
          
          fieldsToSearch.forEach(field => {
            if (field) {
              const fieldLower = field.toLowerCase();
              const fieldWords = fieldLower.split(/\s+|,|\(|\)|-|\//).filter(w => w.length > 0);
              const stemmedFieldWords = fieldWords.map(w => stemWord(w));
              
              // 정확한 일치 (가장 높은 점수)
              if (fieldLower === term) {
                score += 10;
              }
              // 단어 포함 (높은 점수)
              else if (fieldLower.includes(term)) {
                score += 5;
              }
              // 단어 단위 일치 (중간 점수)
              else if (fieldWords.some(word => word === term)) {
                score += 4;
              }
              // 스테밍된 단어 일치 (중간 점수)
              else if (stemmedFieldWords.some(word => word === stemmedTerm)) {
                score += 3;
              }
              // 유사 단어 (부분 일치, 낮은 점수)
              else if (term.length > 3 && fieldLower.includes(term.substring(0, Math.ceil(term.length * 0.7)))) {
                score += 2;
              }
              // 매우 짧은 검색어(2-3자)의 경우 부분 일치도 허용
              else if (term.length >= 2 && term.length <= 3 && fieldLower.includes(term)) {
                score += 1;
              }
            }
          });
        });
        
        return { medspa, score };
      });
      
      // 점수가 0보다 큰 메드스파만 필터링하고 점수 순으로 정렬
      const filteredScoredMedspas = scoredMedspas
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);
      
      // 점수 정보 제거하고 메드스파만 반환
      medspasCopy = filteredScoredMedspas.map(item => item.medspa);
    }
    
    // 필터 적용 (검색어 유무와 관계없이)
    if (selectedFilter) {
      console.log(`Applying filter: ${selectedFilter} to ${medspasCopy.length} medspas`);
      
      switch (selectedFilter) {
        case 'Price':
          // 가격 기준 정렬 (낮은 가격순)
          return medspasCopy.sort((a, b) => {
            const priceA = findTreatmentPriceNumber(a, searchQuery);
            const priceB = findTreatmentPriceNumber(b, searchQuery);
            return priceA - priceB;
          });
          
        case 'google_star':
          // Google 평점 기준 정렬 (높은 평점순)
          return medspasCopy.sort((a, b) => {
            const ratingA = a.google_star || 0;
            const ratingB = b.google_star || 0;
            return ratingB - ratingA;
          });
          
        case 'google_review':
          // Google 리뷰 수 기준 정렬 (많은 리뷰순)
          return medspasCopy.sort((a, b) => {
            const reviewsA = a.google_review || 0;
            const reviewsB = b.google_review || 0;
            return reviewsB - reviewsA;
          });
          
        case 'yelp_star':
          // Yelp 평점 기준 정렬 (높은 평점순)
          return medspasCopy.sort((a, b) => {
            const ratingA = a.yelp_star || 0;
            const ratingB = b.yelp_star || 0;
            return ratingB - ratingA;
          });
          
        case 'yelp_review':
          // Yelp 리뷰 수 기준 정렬 (많은 리뷰순)
          return medspasCopy.sort((a, b) => {
            const reviewsA = a.yelp_review || 0;
            const reviewsB = b.yelp_review || 0;
            return reviewsB - reviewsA;
          });
          
        case 'Distance':
          // 거리 기준 정렬 (가까운 순)
          if (!userLocation) return medspasCopy;
          
          return medspasCopy.sort((a, b) => {
            try {
              // 실제 좌표 사용
              const coordsA = a.coordinates || (a.lat && a.lng ? { lat: a.lat, lng: a.lng } : {
                lat: 40.7128 + (Math.random() * 0.05 - 0.025),
                lng: -74.0060 + (Math.random() * 0.05 - 0.025)
              });
              
              const coordsB = b.coordinates || (b.lat && b.lng ? { lat: b.lat, lng: b.lng } : {
                lat: 40.7128 + (Math.random() * 0.05 - 0.025),
                lng: -74.0060 + (Math.random() * 0.05 - 0.025)
              });
              
              // 사용자 위치와의 거리 계산
              const distanceA = calculateDistance(
                userLocation.lat, userLocation.lng,
                coordsA.lat, coordsA.lng
              );
              
              const distanceB = calculateDistance(
                userLocation.lat, userLocation.lng,
                coordsB.lat, coordsB.lng
              );
              
              return distanceA - distanceB;
            } catch (error) {
              console.error('Error sorting by distance:', error);
              return 0;
            }
          });
          
        case 'Free consultation':
          // 무료 상담 제공 여부로 필터링 및 정렬
          // 무료 상담 있는 MedSpa를 먼저 보여주고, 그 다음에 나머지를 보여줌
          return medspasCopy.sort((a, b) => {
            const hasConsultationA = a.free_consultation && a.free_consultation.trim() !== '';
            const hasConsultationB = b.free_consultation && b.free_consultation.trim() !== '';
            
            if (hasConsultationA && !hasConsultationB) return -1;
            if (!hasConsultationA && hasConsultationB) return 1;
            return 0;
          });
      }
    }
    
    // 필터가 없거나 기본 케이스
    return medspasCopy;
  }, [medspas, selectedFilter, searchQuery, userLocation, findTreatmentPriceNumber]);

  // 로그인 상태 확인 및 스크롤 감지 useEffect 추가
  useEffect(() => {
    // 로그인 상태 확인
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        const isAuthenticated = !!data.session;
        console.log('로그인 상태:', isAuthenticated);
        setIsLoggedIn(isAuthenticated);
        
        // 로그인 상태가 확인되면 모달을 표시하지 않음
        if (isAuthenticated) {
          setShowLoginModal(false);
          scrollThreshold.current = true; // 로그인 되었으므로 더 이상 모달 표시 안함
        } else {
          // 로그아웃 상태일 때는 scrollThreshold 초기화
          scrollThreshold.current = false;
        }
      } catch (error) {
        console.error('인증 상태 확인 중 오류:', error);
        setIsLoggedIn(false); // 오류 발생 시 로그아웃 상태로 간주
        scrollThreshold.current = false; // 오류 발생 시 scrollThreshold 초기화
      }
    };
    
    checkAuth();
    
    // 클라이언트 사이드에서만 실행
    if (typeof window !== 'undefined') {
      console.log('스크롤 이벤트 리스너 등록');
      
      // 스크롤 이벤트 리스너 추가
      const handleScroll = () => {
        // 로그인하지 않은 상태에서만 모달 표시 로직 실행
        if (!isLoggedIn && !scrollThreshold.current) {
          const scrollPosition = window.scrollY;
          const windowHeight = window.innerHeight;
          const scrollPercentage = scrollPosition / windowHeight;
          
          // 스크롤이 화면 높이의 80% 이상일 때 모달 표시
          if (scrollPercentage > 0.8) {
            console.log('스크롤 위치에 따른 로그인 모달 표시');
            setShowLoginModal(true);
            scrollThreshold.current = true; // 한 번만 표시하도록 설정
          }
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isLoggedIn]);
  
  // 이미지 인덱스 변경 함수
  const changeImageIndex = (medspaId: string, newIndex: number) => {
    setCurrentImageIndexes({
      ...currentImageIndexes,
      [medspaId]: newIndex
    });
  };

  console.log('Initial Medspas:', initialMedspas); // 디버깅용 로그

  const handleMedspaClick = (medspaId: string) => {
    router.push(`/medspa/${medspaId}`);
  };

  // 지도 표시 전환 핸들러
  const toggleMapView = () => {
    setMapLoading(true);
    setShowMap(!showMap);
    // 지도 로딩 상태 해제 (지도가 로드되면 DynamicMap 컴포넌트에서 처리됨)
    setTimeout(() => setMapLoading(false), 1000);
  };

  // Get distance between user and medspa
  const getMedspaDistance = (medspa: Medspa): number | null => {
    if (!userLocation) return null;
    
    try {
      // 좌표 유효성 검사
      let coords;
      
      if (medspa.coordinates) {
        // coordinates 객체 사용
        coords = medspa.coordinates;
        console.log(`Using coordinates object for distance calculation (MedSpa ${medspa.id})`);
      } else if (medspa.lat !== undefined && medspa.lng !== undefined) {
        // lat, lng 값 유효성 검사
        const isValidLat = !isNaN(medspa.lat) && medspa.lat >= -90 && medspa.lat <= 90;
        const isValidLng = !isNaN(medspa.lng) && medspa.lng >= -180 && medspa.lng <= 180;
        
        if (isValidLat && isValidLng) {
          coords = { lat: medspa.lat, lng: medspa.lng };
          console.log(`Using lat/lng properties for distance calculation (MedSpa ${medspa.id})`);
        } else {
          console.warn(`Invalid lat/lng values for MedSpa ${medspa.id}: lat=${medspa.lat}, lng=${medspa.lng}`);
          // 뉴욕 기준 랜덤 좌표 생성 (fallback)
          coords = {
            lat: 40.7128 + (Math.random() * 0.05 - 0.025),
            lng: -74.0060 + (Math.random() * 0.05 - 0.025)
          };
          console.log(`Using fallback coordinates for distance calculation (MedSpa ${medspa.id})`);
        }
      } else {
        // 좌표가 없는 경우 뉴욕 기준 랜덤 좌표 생성 (fallback)
        coords = {
          lat: 40.7128 + (Math.random() * 0.05 - 0.025),
          lng: -74.0060 + (Math.random() * 0.05 - 0.025)
        };
        console.log(`No coordinates available, using fallback for distance calculation (MedSpa ${medspa.id})`);
      }
      
      // 사용자 위치 좌표 유효성 검사
      if (isNaN(userLocation.lat) || isNaN(userLocation.lng)) {
        console.error('Invalid user location coordinates:', userLocation);
        return null;
      }
      
      return calculateDistance(
        userLocation.lat, userLocation.lng,
        coords.lat, coords.lng
      );
    } catch (error) {
      console.error(`Error calculating distance for MedSpa ${medspa.id}:`, error);
      return null;
    }
  };

  // Handle phone call
  const handleCall = (phoneNumber: string | undefined, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to medspa detail
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      alert('Phone number not available');
    }
  };

  // Handle filter change
  const handleFilterChange = (filter: FilterType) => {
    setSelectedFilter(filter);
    
    // 필터 변경 시 스크롤 위치 초기화
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
    
    // If we're on a search page with a query, maintain the query
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/search');
    }
    
    // Reset scroll position
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <div className="relative flex flex-col min-h-screen">
        <div className="sticky top-0 z-40 bg-white">
          <div className="container mx-auto px-4 pt-4 pb-1 flex items-center justify-between">
            {/* Back Button (왼쪽) */}
            <Link href="/" className="flex items-center text-black">
              <ChevronLeftIcon className="h-6 w-6" />
            </Link>

            {/* Search Bar (가운데) */}
            <div className="w-[480px] flex-1 mx-4">
              <SearchBar 
                initialValue={searchQuery} 
                onSearch={(value) => console.log(value)}
                className="mt-0"
              />
            </div>

            {/* Map 버튼 */}
            <button 
              onClick={toggleMapView} 
              className={`flex items-center justify-center rounded-full p-2.5 transition-colors ${
                showMap 
                  ? 'bg-transparent text-black hover:text-gray-500' 
                  : 'bg-transparent text-black hover:text-gray-500'
              }`}
              aria-label={showMap ? "Show list" : "Show map"}
              disabled={mapLoading}
            >
              <span className="gotu text-lg font-semibold text-[#754731]">
                {showMap ? "List" : "Map"}
              </span>
            </button>
          </div>
          <div className="container mx-auto pl-3 pb-2">
            <SearchFilters 
              selectedFilter={selectedFilter}
              onFilterChange={handleFilterChange}
            />
            {selectedFilter && (
            )}
          </div>
        </div>

        {/* 지도/목록 뷰 전환 */}
        {mapLoading ? (
          // 로딩 상태
          <div className="container mx-auto px-4 py-2 h-[calc(100vh-140px)] flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
              <p className="text-gray-600">Loading {showMap ? "map" : "list"}...</p>
            </div>
          </div>
        ) : showMap ? (
          // 지도 뷰
          <div className="container mx-auto py-1 h-[calc(100vh-140px)]">
            <DynamicMap 
              medspas={filteredMedspas} 
              onMedspaSelect={(medspa) => handleMedspaClick(medspa.id)}
            />
          </div>
        ) : (
          // 목록 뷰
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-col gap-4">
              {filteredMedspas.map((medspa) => {
                console.log('Processing medspa:', medspa); // 디버깅용 로그
                const imageUrls = [medspa.image_url1, medspa.image_url2, medspa.image_url3].filter(Boolean) as string[];
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
                              className="flex"
                              drag="x"
                              dragConstraints={{ left: -32 * (imageUrls.length - 1), right: 0 }}
                              dragElastic={0.2}
                              dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                              onDragEnd={(e, info) => {
                                const threshold = 50; // 드래그 임계값
                                const draggedDistance = info.offset.x;
                                
                                // 드래그 방향과 거리에 따라 인덱스 변경
                                if (Math.abs(draggedDistance) > threshold) {
                                  if (draggedDistance < 0 && currentIndex < imageUrls.length - 1) {
                                    changeImageIndex(medspa.id, currentIndex + 1);
                                  } else if (draggedDistance > 0 && currentIndex > 0) {
                                    changeImageIndex(medspa.id, currentIndex - 1);
                                  }
                                }
                              }}
                              animate={{ x: -currentIndex * 128 }} // 이미지 너비에 맞게 조정
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              style={{ touchAction: "none" }} // 모바일에서 스와이프 시 전체 페이지가 움직이지 않도록 설정
                            >
                              {imageUrls.map((url, index) => (
                                <div key={index} className="w-32 h-32 flex-shrink-0">
                                  <Image 
                                    src={url} 
                                    alt={`${medspa.medspa_name} image ${index + 1}`}
                                    width={128}
                                    height={128}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      objectPosition: 'center'
                                    }}
                                    priority={index === 0}
                                  />
                                </div>
                              ))}
                            </motion.div>
                          ) : (
                            <div className="text-gray-400">No Image</div>
                          )}
                          
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
                        </div>
                      </div>

                      {/* Right side - Content */}
                      <div className="flex-1 flex flex-col">
                        {/* Free consultation button with heart */}
                        <div className="flex justify-between items-center mb-1">
                          <div>
                            {medspa.free_consultation && medspa.free_consultation.trim() !== '' ? (
                              <button className="text-3xl text-left text-amber-900 py-1 text-sm">
                                {medspa.free_consultation}
                              </button>
                            ) : (
                              <button className="text-3xl text-left text-gray-500 py-1 text-sm">
                                Paid Consultation
                              </button>
                            )}
                          </div>
                          
                          {/* Favorite heart icon */}
                          <button 
                            className={`p-1 rounded-full ${
                              isFavorite(medspa.id) 
                                ? 'bg-white/80 text-red-500' 
                                : 'bg-white/60 text-gray-500 hover:bg-white/80'
                            } transition-all duration-200`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(medspa);
                            }}
                            aria-label={isFavorite(medspa.id) ? "Remove from favorites" : "Add to favorites"}
                          >
                            <Heart 
                              size={18} 
                              className={isFavorite(medspa.id) ? "fill-red-500" : ""} 
                            />
                          </button>
                        </div>
                        {/* Medspa name and village */}
                        <h3 className="cormorant text-xl font-semibold text-black break-words">
                          {searchQuery ? highlightMatches(medspa.medspa_name, searchQuery.split(' ')) : medspa.medspa_name}
                        </h3>
                        <div className="flex items-center text-gray-500 text-[12px] mb-1">
                          {userLocation && (
                            <span className="flex items-center whitespace-nowrap mr-2">
                              <Navigation className="h-3.5 w-3.5 text-gray-400 mr-1" />
                              {getMedspaDistance(medspa)?.toFixed(1) || '?'}mil
                            </span>
                          )}
                          <div className="flex items-center truncate">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0 mr-1" />
                            <span className="truncate">{searchQuery ? highlightMatches(medspa.village, searchQuery.split(' ')) : medspa.village}</span>
                          </div>
                        </div>
 
                        <MedspaRatings 
                          googleStar={medspa.google_star} 
                          googleReview={medspa.google_review} 
                          yelpStar={medspa.yelp_star} 
                          yelpReview={medspa.yelp_review} 
                        />
                      </div>
                    </div>
                    
                    {/* Treatment Price */}
                    <div className="text-left mt-2">
                      <span className="text-2xl font-bold text-black">
                        {findTreatmentPrice(medspa, searchQuery) && (
                          <>
                            {searchQuery} - {findTreatmentPrice(medspa, searchQuery)}
                          </>
                        )}
                      </span>
                    </div>
                    
                    
                    {/* Reviews - 이미지와 왼쪽 정렬 */}
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="min-w-[20px] w-5 h-5 flex-shrink-0 flex items-center justify-center">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            height="20px" 
                            viewBox="0 -960 960 960" 
                            width="20px" 
                            fill="#6b7280" 
                            stroke="#6b7280" 
                          >
                            <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z"/>
                          </svg>
                        </div>
                        <span className="text-base text-gray-500">{medspa.good_review_short || ""}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="min-w-[20px] w-5 h-5 flex-shrink-0 flex items-center justify-center">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            height="20px" 
                            viewBox="0 -960 960 960" 
                            width="20px" 
                            fill="#6b7280"
                            stroke="#6b7280"
                          >
                            <path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l54 220 174-174v-406Zm0 406v406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z"/>
                          </svg>
                        </div>
                        <span className="text-base text-gray-500">{medspa.bad_review_short || ""}</span>
                      </div>
                    </div>

                    {/* Call and Consultation CTA Buttons */}
                    <div className="flex flex-row gap-3">
                      <button 
                        onClick={(e) => handleCall(medspa.number, e)}
                        className="btn bg-amber-900 hover:bg-amber-950 text-white border-none hover:shadow-lg transform flex items-center justify-center gap-2 w-12"
                        title="call"
                        aria-label="call"
                      >
                        <Phone size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Clicked Get Consultation for:', medspa.medspa_name);
                          setSelectedMedspa(medspa);
                          setIsConsultationModalOpen(true);
                        }}
                        className="btn bg-white hover:bg-amber-800 border border-amber-900 text-amber-900 hover:text-white hover:border-amber-800 hover:shadow-lg transform flex items-center justify-center gap-2 flex-1"
                      >
                        <span>Get Consultation</span>
                      </button>
                    </div>

                    
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <ConsultationModal 
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        medspa={selectedMedspa}
      />
      
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}
