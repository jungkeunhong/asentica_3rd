'use client';

import { useState, useEffect, useMemo } from 'react';
import { Star, MapPin, Navigation } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import SearchFilters, { FilterType } from '@/components/SearchFilters';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import dynamic from 'next/dynamic';

// 동적으로 DynamicMap 컴포넌트 로드 (클라이언트 사이드에서만 로드)
const DynamicMap = dynamic(() => import('@/components/DynamicMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-lg bg-gray-200 flex items-center justify-center">
      <p className="text-gray-500">지도를 불러오는 중...</p>
    </div>
  )
});

interface Medspa {
  id: string;
  medspa_name: string;
  village: string;
  location: string;
  address: string;
  google_star?: number;
  google_review?: number;
  yelp_star?: number;
  yelp_review?: number;
  best_treatment?: string;
  free_consultation?: string;
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

export default function SearchContent({ initialMedspas, searchQuery, error }: SearchContentProps) {
  if (error) {
    throw error;
  }

  const [medspas] = useState<Medspa[]>(initialMedspas);
  
  // 지도 표시 상태 관리
  const [showMap, setShowMap] = useState(false);
  
  // 지도 로딩 상태 관리
  const [mapLoading, setMapLoading] = useState(false);
  
  // 이미지 슬라이더를 위한 상태 관리
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{[key: string]: number}>({});
  
  // 이미지 슬라이더 방향 (1: 오른쪽, -1: 왼쪽)
  const [[direction, count], setDirectionAndCount] = useState([0, 0]);
  
  // 필터 상태 관리
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(null);
  
  // 사용자 위치 상태
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // 사용자 위치 가져오기
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
  useEffect(() => {
    // lat, lng 값을 coordinates 객체로 변환
    const medspaWithCoordinates = medspas.map(medspa => ({
      ...medspa,
      coordinates: medspa.lat && medspa.lng ? {
        lat: medspa.lat,
        lng: medspa.lng
      } : undefined
    }));
    
    // 상태 업데이트는 하지 않고 이미 coordinates 속성이 있는 경우 사용
  }, [medspas]);

  // 드래그 핸들러
  const handleDragEnd = (medspaId: string, info: PanInfo, imageCount: number) => {
    // 이미지가 1개 이하면 슬라이드 처리 안함
    if (imageCount <= 1) return;
    
    const currentIndex = currentImageIndexes[medspaId] || 0;
    
    // 왼쪽으로 드래그하면 다음 이미지 (오른쪽으로 이동)
    if (info.offset.x < -50) {
      const newIndex = (currentIndex + 1) % imageCount;
      setDirectionAndCount([1, count + 1]);
      setCurrentImageIndexes({
        ...currentImageIndexes,
        [medspaId]: newIndex
      });
    }
    // 오른쪽으로 드래그하면 이전 이미지 (왼쪽으로 이동)
    else if (info.offset.x > 50) {
      const newIndex = (currentIndex - 1 + imageCount) % imageCount;
      setDirectionAndCount([-1, count - 1]);
      setCurrentImageIndexes({
        ...currentImageIndexes,
        [medspaId]: newIndex
      });
    }
  };
  
  // 이미지 인덱스 변경 함수
  const changeImageIndex = (medspaId: string, newIndex: number, imageCount: number) => {
    const currentIndex = currentImageIndexes[medspaId] || 0;
    const direction = newIndex > currentIndex ? 1 : -1;
    
    setDirectionAndCount([direction, newIndex > currentIndex ? count + 1 : count - 1]);
    setCurrentImageIndexes({
      ...currentImageIndexes,
      [medspaId]: newIndex
    });
  };

  console.log('Initial Medspas:', initialMedspas); // 디버깅용 로그

  // 필터링된 MedSpa 목록
  const filteredMedspas = useMemo(() => {
    if (!selectedFilter) return medspas;
    
    const medspasCopy = [...medspas];
    
    switch (selectedFilter) {
      case 'Rating':
        // Yelp 평점 기준으로 정렬 (높은 순)
        return medspasCopy.sort((a, b) => {
          const ratingA = a.yelp_star || 0;
          const ratingB = b.yelp_star || 0;
          return ratingB - ratingA;
        });
        
      case 'Review':
        // 리뷰 수 기준으로 정렬 (많은 순)
        return medspasCopy.sort((a, b) => {
          const reviewsA = a.yelp_review || 0;
          const reviewsB = b.yelp_review || 0;
          return reviewsB - reviewsA;
        });
        
      case 'Price':
        // 가격 기준으로 정렬 (낮은 순)
        return medspasCopy.sort((a, b) => {
          try {
            // 검색 쿼리에 맞는 트리트먼트 가격 찾기
            const priceA = findTreatmentPriceNumber(a, searchQuery || '');
            const priceB = findTreatmentPriceNumber(b, searchQuery || '');
            return priceA - priceB;
          } catch (error) {
            console.error('Error sorting by price:', error);
            return 0;
          }
        });
        
      case 'Distance':
        // 거리 기준으로 정렬 (가까운 순)
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
        // 무료 상담 제공 여부로 필터링
        return medspasCopy.filter(medspa => 
          medspa.free_consultation && 
          medspa.free_consultation.trim() !== ''
        );
        
      default:
        return medspasCopy;
    }
  }, [medspas, selectedFilter, searchQuery, userLocation]);

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
  const findTreatmentPriceNumber = (medspa: Medspa, query: string): number => {
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
  };

  // Get distance between user and medspa
  const getMedspaDistance = (medspa: Medspa): number | null => {
    if (!userLocation) return null;
    
    try {
      // 실제 좌표 사용
      const coords = medspa.coordinates || (medspa.lat && medspa.lng ? { lat: medspa.lat, lng: medspa.lng } : {
        lat: 40.7128 + (Math.random() * 0.05 - 0.025),
        lng: -74.0060 + (Math.random() * 0.05 - 0.025)
      });
      
      return calculateDistance(
        userLocation.lat, userLocation.lng,
        coords.lat, coords.lng
      );
    } catch (error) {
      console.error('Error calculating distance:', error);
      return null;
    }
  };

  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-white">
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
            <span className="text-sm font-medium">
              {showMap ? "List" : "Map"}
            </span>
          </button>
        </div>
        <div className="container mx-auto pl-2 pb-2">
          <SearchFilters 
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
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
        <div className="container mx-auto px-4 py-2 h-[calc(100vh-140px)]">
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
                            <AnimatePresence initial={false} custom={direction}>
                              <motion.div 
                                key={currentIndex}
                                custom={direction}
                                initial={{ 
                                  opacity: 0,
                                  x: direction > 0 ? 100 : -100 
                                }}
                                animate={{ 
                                  opacity: 1,
                                  x: 0,
                                  transition: { duration: 0.3 }
                                }}
                                exit={{ 
                                  opacity: 0,
                                  x: direction > 0 ? -100 : 100,
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
                                      changeImageIndex(medspa.id, index, imageUrls.length);
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
                      <div className="flex items-center text-gray-500 text-sm mb-1">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>{medspa.village}</span>
                        {userLocation && (
                          <span className="flex items-center ml-1">
                            <Navigation className="h-3.5 w-3.5 mx-1 text-gray-400" />
                            {getMedspaDistance(medspa)?.toFixed(1) || '?'} miles
                          </span>
                        )}
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
                            <button className="cormorant text-3xl bg-black text-white px-4 py-1 rounded-full text-sm">
                              {medspa.free_consultation}
                            </button>
                          ) : (
                            <button className="cormorant text-3xl bg-gray-200 text-gray-500 px-4 py-1 rounded-full text-sm">
                              Free Consultation
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Reviews - 이미지와 왼쪽 정렬 */}
                  <div className="mt-2 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="min-w-[24px] w-6 h-6 flex-shrink-0 flex items-center justify-center">
                        <Image 
                          src="/icons/thumbup.png" 
                          alt="Positive" 
                          width={24} 
                          height={24}
                          className="w-6 h-6 text-black object-contain flex-shrink-0"
                        />
                      </div>
                      <span className="gotu text-sm text-black">{medspa.good_review_short || ""}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="min-w-[24px] w-6 h-6 flex-shrink-0 flex items-center justify-center">
                        <Image 
                          src="/icons/thumbdown.png" 
                          alt="Negative" 
                          width={24} 
                          height={24}
                          className="w-6 h-6 object-contain flex-shrink-0"
                        />
                      </div>
                      <span className="gotu text-sm text-black">{medspa.bad_review_short || ""}</span>
                    </div>
                  </div>
                  {/* Treatment Price */}
                  <div className="text-left">
                    <span className="gotu text-lg font-bold text-black">
                      {findTreatmentPrice(medspa, searchQuery)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}