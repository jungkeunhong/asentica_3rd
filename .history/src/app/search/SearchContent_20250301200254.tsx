'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {  MapPin, Navigation, Phone, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import SearchFilters, { FilterType } from '@/components/SearchFilters';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import dynamic from 'next/dynamic';
import ConsultationModal from '@/components/ConsultationModal';
import LoginModal from '@/components/LoginModal';
import { useFavorites } from '@/context/FavoritesContext';
import { createClient } from '@/utils/supabase/client';

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
  const [selectedMedspa, setSelectedMedspa] = useState<Medspa | undefined>(undefined);
  
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

  // 필터링된 MedSpa 목록
  const filteredMedspas = useMemo(() => {
    if (!medspas.length) return [];
    
    let medspasCopy = [...medspas];
    
    // 검색어가 있는 경우에만 검색어로 필터링
    if (searchQuery.trim()) {
      medspasCopy = medspasCopy.filter(medspa => {
        const searchTerms = searchQuery.toLowerCase().split(' ');
        
        // 각 검색어가 메드스파 정보에 포함되어 있는지 확인
        return searchTerms.every(term => {
          return (
            (medspa.medspa_name && medspa.medspa_name.toLowerCase().includes(term)) ||
            (medspa.village && medspa.village.toLowerCase().includes(term)) ||
            (medspa.location && medspa.location.toLowerCase().includes(term)) ||
            (medspa.best_treatment && medspa.best_treatment.toLowerCase().includes(term)) ||
            (medspa.treatment1 && medspa.treatment1.toLowerCase().includes(term)) ||
            (medspa.treatment2 && medspa.treatment2.toLowerCase().includes(term)) ||
            (medspa.treatment3 && medspa.treatment3.toLowerCase().includes(term)) ||
            (medspa.treatment4 && medspa.treatment4.toLowerCase().includes(term)) ||
            (medspa.treatment5 && medspa.treatment5.toLowerCase().includes(term)) ||
            (medspa.treatment6 && medspa.treatment6.toLowerCase().includes(term))
          );
        });
      });
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
          
          // 스크롤이 화면 높이의 30% 이상일 때 모달 표시
          if (scrollPercentage > 0.3) {
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

  // 드래그 핸들러
  const handleDragEnd = (medspaId: string, info: PanInfo, imageCount: number) => {
    // 이미지가 1개 이하면 슬라이드 처리 안함
    if (imageCount <= 1) return;
    
    const currentIndex = currentImageIndexes[medspaId] || 0;
    
    // 왼쪽으로 드래그하면 다음 이미지 (오른쪽으로 이동)
    if (info.offset.x < -50) {
      const newIndex = (currentIndex + 1) % imageCount;
      setCurrentImageIndexes({
        ...currentImageIndexes,
        [medspaId]: newIndex
      });
    }
    // 오른쪽으로 드래그하면 이전 이미지 (왼쪽으로 이동)
    else if (info.offset.x > 50) {
      const newIndex = (currentIndex - 1 + imageCount) % imageCount;
      setCurrentImageIndexes({
        ...currentImageIndexes,
        [medspaId]: newIndex
      });
    }
  };
  
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

  // 꽉 찬 별 SVG 컴포넌트
  const FilledStar = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      height="20px" 
      viewBox="0 -960 960 960" 
      width="20px" 
      {...props}
    >
      <path d="m243-144 237-141 237 141-63-266 210-179-276-23-108-252-108 251-276 24 210 179-63 266Z" />
    </svg>
  );

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
              onFilterChange={(filter) => setSelectedFilter(filter)}
            />
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
                              className="relative w-full h-full"
                              drag="x"
                              dragConstraints={{ left: 0, right: 0 }}
                              onDragEnd={(e, info) => handleDragEnd(medspa.id, info, imageUrls.length)}
                            >
                              {/* Favorite heart icon */}
                              <button 
                                className={`absolute top-2 right-2 p-1 rounded-full z-10 ${
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
                        {/* Free consultation button */}
                        <div className="flex gap-2 mb-1">
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
                        {/* Medspa name and village */}
                        <h3 className="cormorant text-xl font-semibold text-black truncate">
                          {medspa.medspa_name}
                        </h3>
                        <div className="flex items-center text-gray-500 text-[12px] mb-1">
                          {userLocation && (
                            <span className="flex items-center whitespace-nowrap mr-2">
                              <Navigation className="h-3.5 w-3.5 text-gray-400 mr-0.5" />
                              {getMedspaDistance(medspa)?.toFixed(1) || '?'}mil
                            </span>
                          )}
                          <div className="flex items-center truncate">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0 mr-0.5" />
                            <span className="truncate">{medspa.village}</span>
                          </div>
                        </div>
 
                        {/* Ratings */}
                        <div className="flex flex-col gap-0.5 mt-3">
                          {/* Google rating */}
                          <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
                              <path fill="#000000" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#000000" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#000000" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                              <path fill="#000000" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <FilledStar className="w-4 h-4 fill-current text-black" />
                            <span className="text-xs text-black">{medspa.google_star || ''}</span>
                            <span className="text-xs text-gray-500">({medspa.google_review || 0})</span>
                          </div>

                          {/* Yelp rating - 데이터가 있을 때만 표시 */}
                          {medspa.yelp_star && medspa.yelp_review && (
                            <div className="flex items-center gap-1">                              
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 228.097 228.097">
                                  <g>
                                    <path fill="#000000" d="M173.22,68.06c8.204,6.784,30.709,25.392,27.042,38.455c-1.696,5.867-8.434,7.746-13.43,9.579 c-11.505,4.171-23.33,7.471-35.339,9.9c-9.717,1.971-30.48,6.279-26.63-10.909c1.512-6.646,6.875-12.284,11.184-17.28 c8.846-10.404,17.876-21.405,28.555-29.93c0.871-0.688,1.925-0.871,2.842-0.733C169.232,66.41,171.386,66.502,173.22,68.06z"/>
                                    <path fill="#000000" d="M161.119,205.197c-7.196-5.821-12.284-14.942-16.684-22.917c-4.309-7.7-11.092-17.876-12.238-26.813 c-2.337-18.38,24.292-7.333,31.947-4.675c10.175,3.575,37.447,7.517,34.422,23.421c-2.521,12.971-18.151,28.784-31.213,30.801 c-0.137,0.046-0.321,0-0.504,0c-0.046,0.046-0.092,0.092-0.137,0.137c-0.367,0.183-0.779,0.413-1.192,0.596 C163.961,206.573,162.449,206.252,161.119,205.197z"/>
                                    <path fill="#000000" d="M101.58,157.896c14.484-6.004,15.813,10.175,15.721,19.984c-0.137,11.688-0.504,23.421-1.375,35.063 c-0.321,4.721-0.137,10.405-4.629,13.384c-5.546,3.667-16.225,0.779-21.955-1.008c-0.183-0.092-0.367-0.183-0.55-0.229 c-12.054-2.108-26.767-7.654-28.188-18.792c-0.138-1.283,0.367-2.429,1.146-3.3c0.367-0.688,0.733-1.329,1.146-1.925 c1.788-2.475,3.85-4.675,5.913-6.921c3.483-5.179,7.242-10.175,11.229-14.988C85.813,172.197,92.917,161.471,101.58,157.896z"/>
                                    <path fill="#000000" d="M103.689,107.661c-21.13-17.371-41.71-44.276-52.344-69.164 c-8.113-18.93,12.513-30.48,28.417-35.705c21.451-7.059,29.976-0.917,32.13,20.534c1.788,18.471,2.613,37.08,2.475,55.643 c-0.046,7.838,2.154,20.488-2.429,27.547c0.733,2.888-3.621,4.95-6.096,2.979c-0.367-0.275-0.733-0.642-1.146-0.963 C104.33,108.303,104.009,108.028,103.689,107.661z"/>
                                    <path fill="#000000" d="M101.397,134.566c1.696,7.517-3.621,10.542-9.854,13.384c-11.092,4.996-22.734,8.984-34.422,12.284 c-6.784,1.879-17.188,6.371-23.742,1.375c-4.95-3.758-5.271-11.596-5.729-17.28c-1.008-12.696,0.917-42.993,18.517-44.276 c8.617-0.596,19.388,7.104,26.447,11.138c9.396,5.409,19.48,11.596,26.492,20.076C100.159,131.862,101.03,132.916,101.397,134.566z"/>
                                  </g>
                                </svg>

                              <FilledStar className="w-4 h-4 fill-current text-black" />
                              <span className="text-xs text-black">{medspa.yelp_star}</span>
                              <span className="text-xs text-gray-500">({medspa.yelp_review})</span>
                            </div>
                          )}

                        </div>
                      </div>
                    </div>
                    
                    {/* Treatment Price */}
                    <div className="text-left mt-2">
                      <span className="text-lg font-normal text-black">
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
                          stroke-width="0.5" 
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
                          strokeWidth="0.5"
                        >
                          <path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z"/>
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
