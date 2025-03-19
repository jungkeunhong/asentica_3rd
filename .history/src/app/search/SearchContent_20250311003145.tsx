'use client';

import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import SearchFilters, { FilterType } from '@/components/SearchFilters';
import ConsultationModal from '@/components/ConsultationModal';
import LoginModal from '@/components/LoginModal';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import {  MapPin, Navigation, Phone, Heart } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { createClient } from '@/utils/supabase/client';
import { MedspaRatings } from "@/components/ui/medspa-ratings";
import FilterModal from '@/components/FilterModal';

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
  image_url1: string;
  image_url2: string; 
  image_url3: string;
  lat?: number;
  lng?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  review1_text?: string;
  google_map_link?: string;
  yelp_url?: string;
}

interface PriceData {
  id: string;
  medspa_id: string;
  medspa_name: string;
  treatment_category: string;
  efficacy: string;
  treatment_name: string;
  treatment_description: string;
  standard_price: string;
  standard_unit: string;
  standard_price_note: string;
  duration: string;
  member_price: string;
  member_unit: string;
  member_price_note: string;
  package_duration: string;
  additional_info: string;
  contact: string;
}

interface SearchContentProps {
  initialMedspas: Medspa[];
  searchQuery: string;
  priceData?: PriceData[];
  error?: Error;
}

// 필터 상태 인터페이스 정의
interface FilterState {
  priceRange: [number, number];
  googleStars: number[];
  yelpStars: number[];
  villages: string[];
  facilities: string[];
  distance: number | null;
  treatmentCategories: string[];
  efficacies: string[];
}

export default function SearchContent({
  initialMedspas,
  searchQuery,
  priceData = [],
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
  const tenthItemRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  

  const [showMap, setShowMap] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{[key: string]: number}>({});
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Partial<FilterState>>({});
  const [advancedFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    googleStars: [],
    yelpStars: [],
    villages: [],
    facilities: [],
    distance: null,
    treatmentCategories: [],
    efficacies: []
  });

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

  useEffect(() => {
    const fetchPrices = async () => {
      const supabase = createClient();
      
      const { data, error } = await supabase.from('price_test').select('*');
      
      if (error) {
        console.error('Error fetching price data:', error);
        return;
      }
  
      console.log('✅ Full price_test data:', data); // Check if ANY data exists
    };
  
    fetchPrices();
  }, []);

  // 사용자 위치 상태
  useEffect(() => {
    // First check if we already have permission
    navigator.permissions?.query({ name: 'geolocation' })
      .then(permissionStatus => {
        if (permissionStatus.state === 'granted') {
          // Permission already granted, get location
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
            },
            (error) => {
              console.log('Error getting location:', error);
            },
            // Add options for better performance
            {
              maximumAge: 300000, // Cache location for 5 minutes
              timeout: 10000     // Wait up to 10 seconds
            }
          );
        } else if (permissionStatus.state === 'prompt') {
          // Only ask for permission if not yet decided
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
            },
            (error) => {
              console.log('Error getting location:', error);
            }
          );
        }
      })
      .catch(() => {
        // Fallback for browsers that don't support permissions API
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
            },
            (error) => {
              console.log('Error getting location:', error);
            }
          );
        }
      });
  }, []);

  // ... rest of the code ...
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

  const findRelevantTreatments = (medspa: Medspa): PriceData[] => {
    try {
      if (!priceData || !medspa.id) return [];

      // Get treatments based on active filters
      const treatmentCategories = activeFilters.treatmentCategories ?? [];
      const efficacies = activeFilters.efficacies ?? [];
      const hasFilteredCategories = treatmentCategories.length > 0;
      const hasFilteredEfficacies = efficacies.length > 0;

      if (hasFilteredCategories || hasFilteredEfficacies) {
        return priceData.filter(price => 
          price.medspa_id === medspa.id && (
            // Match treatment categories
            (hasFilteredCategories &&
              price.treatment_category &&
              treatmentCategories.map(c => c.toLowerCase()).includes(price.treatment_category.toLowerCase())) ||
            // Match efficacies
            (hasFilteredEfficacies &&
              price.efficacy &&
              efficacies.map(e => e.toLowerCase()).includes(price.efficacy.toLowerCase()))
          )
        );
      }

      // If no filters but has search query
      if (searchQuery) {
        const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
        return priceData.filter(price => 
          price.medspa_id === medspa.id &&
          searchTerms.some(term => 
            (price.treatment_name && price.treatment_name.toLowerCase().includes(term)) ||
            (price.treatment_category && price.treatment_category.toLowerCase().includes(term)) ||
            (price.efficacy && price.efficacy.toLowerCase().includes(term))
          )
        );
      }

      return [];
    } catch (error) {
      console.error('Error finding relevant treatments:', error);
      return [];
    }
  };

  const getRandomTreatment = (medspa: Medspa): PriceData | null => {
    const relevantTreatments = findRelevantTreatments(medspa);
    if (relevantTreatments.length === 0) return null;
    
    // Get a random treatment from the relevant ones
    const randomIndex = Math.floor(Math.random() * relevantTreatments.length);
    return relevantTreatments[randomIndex];
  };

  // Update the existing findTreatmentPrice function to use the new logic
  const findTreatmentPrice = (medspa: Medspa): PriceData | null => {
    return getRandomTreatment(medspa);
  };

  // Helper function to find treatment price as a number for sorting
  const findTreatmentPriceNumber = useCallback((medspa: Medspa): number => {
    try {
      const priceResult = findTreatmentPrice(medspa);
      
      // If it's a PriceData object
      if (typeof priceResult === 'object' && priceResult !== null) {
        const priceStr = priceResult.standard_price;
        if (!priceStr) return Infinity;
        
        // Convert to string to ensure match works
        const priceStrValue = String(priceStr);
        const priceMatch = priceStrValue.match(/\$?(\d+)/);
        return priceMatch ? parseInt(priceMatch[1], 10) : Infinity;
      }
      
      // If no price found
      return Infinity;
    } catch (error) {
      console.error('Error converting price to number:', error);
      return Infinity;
    }
  }, [findTreatmentPrice]);

  // Add this function to format price display
  const formatPriceDisplay = (priceData: PriceData | string) => {
    if (typeof priceData === 'string') {
      return priceData; // Return the string as is
    }
    

    // Format the price data object
    const formattedPrice = new Intl.NumberFormat('en-US').format(Number(priceData.standard_price || 0));
    const standardUnit = priceData.standard_unit ? priceData.standard_unit.toLowerCase() : 'unit';
    const standardPrice = `$${formattedPrice} per ${standardUnit}`;

    
    // Check if member price exists
    if (priceData.member_price) {
      const formattedMemberPrice = new Intl.NumberFormat('en-US').format(Number(priceData.member_price));
      const memberUnit = priceData.member_unit ? priceData.member_unit.toLowerCase() : 'unit';
      const memberPrice = `$${formattedMemberPrice} per ${memberUnit}`;
      
      return (
        <div>
          <div>{standardPrice}</div>
          <div className="text-sm text-green-600">Member: {memberPrice}</div>
        </div>
      );
    }
    
    return <div>{standardPrice}</div>;
  };
  // Basic stemming function to improve search matching
    // Function to highlight matching terms in text

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

  // 🔹 State for loading status during search
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch search results from Supabase when searchQuery changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        return; // Keep using initialMedspas if no search query
      }

      setLoading(true);
      const supabase = createClient();
      
      try {
        const { data, error } = await supabase
          .from('medspa_nyc')
          .select('*')
          .or(`medspa_name.ilike.%${searchQuery}%, best_treatment.ilike.%${searchQuery}%, village.ilike.%${searchQuery}%, location.ilike.%${searchQuery}%`)
          .limit(20);

        if (error) {
          console.error('Error fetching search results:', error);
        } else if (data) {
          console.log('🔍 Search results:', data.length);
          setMedspas(data);
        }
      } catch (err) {
        console.error('Error in search:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  // Get unique villages for the filter
  const availableVillages = useMemo(() => {
    const villages = medspas
      .map(medspa => medspa.village)
      .filter((village): village is string => 
        typeof village === 'string' && village.trim() !== ''
      );
    return [...new Set(villages)].sort();
  }, [medspas]);
  
  // 필터링된 MedSpa 목록
  const filteredMedspas = useMemo(() => {
    if (!medspas.length) return [];
    
    let medspasCopy = [...medspas];
    console.log('Initial medspas count:', medspasCopy.length);
    console.log('Active filters:', activeFilters);
    console.log('Price data available:', priceData?.length || 0);
    
    // Apply location filters if any from activeFilters
    if (activeFilters.villages && activeFilters.villages.length > 0) {
      medspasCopy = medspasCopy.filter(medspa => 
        medspa.village && activeFilters.villages?.includes(medspa.village)
      );
      console.log(`Filtered to ${medspasCopy.length} medspas by location`);
    }
    
    // Filter by treatment categories
    if (activeFilters.treatmentCategories && activeFilters.treatmentCategories.length > 0) {
      console.log('Filtering by treatment categories:', activeFilters.treatmentCategories);
      console.log('Total price data records:', priceData.length);
      
      // Create a Set of medspa names that have the selected treatment categories
      const medspaNames = new Set<string>();
      
      // Convert treatment categories to lowercase for case-insensitive comparison
      const selectedCategories = activeFilters.treatmentCategories.map(cat => cat.toLowerCase());
      
      // Loop through price data to find matching treatment categories
      priceData.forEach(price => {
        if (price.treatment_category && 
            selectedCategories.includes(price.treatment_category.toLowerCase()) &&
            price.medspa_name) {
          console.log(`Found match: ${price.medspa_name} - ${price.treatment_category}`);
          medspaNames.add(price.medspa_name);
        }
      });
      
      console.log('Medspas with selected categories:', Array.from(medspaNames));
      
      // Filter medspas by these names
      if (medspaNames.size > 0) {
        const beforeCount = medspasCopy.length;
        medspasCopy = medspasCopy.filter(medspa => {
          const hasMatch = medspa.medspa_name && medspaNames.has(medspa.medspa_name);
          if (!hasMatch) {
            console.log(`Filtered out: ${medspa.medspa_name}`);
          }
          return hasMatch;
        });
        console.log(`Filtered from ${beforeCount} to ${medspasCopy.length} medspas by treatment categories`);
      }
    }
    
    // Filter by efficacies
    if (activeFilters.efficacies && activeFilters.efficacies.length > 0) {
      console.log('Filtering by efficacies:', activeFilters.efficacies);
      
      // Create a Set of medspa names that have the selected efficacies
      const medspaNames = new Set<string>();
      
      // Convert efficacies to lowercase for case-insensitive comparison
      const selectedEfficacies = activeFilters.efficacies.map(eff => eff.toLowerCase());
      
      // Loop through price data to find matching efficacies
      priceData.forEach(price => {
        if (price.efficacy && 
            selectedEfficacies.includes(price.efficacy.toLowerCase()) &&
            price.medspa_name) {
          console.log(`Found efficacy match: ${price.medspa_name} - ${price.efficacy}`);
          medspaNames.add(price.medspa_name);
        }
      });
      
      console.log('Medspas with selected efficacies:', Array.from(medspaNames));
      
      // Filter medspas by these names
      if (medspaNames.size > 0) {
        const beforeCount = medspasCopy.length;
        medspasCopy = medspasCopy.filter(medspa => {
          const hasMatch = medspa.medspa_name && medspaNames.has(medspa.medspa_name);
          if (!hasMatch) {
            console.log(`Filtered out by efficacy: ${medspa.medspa_name}`);
          }
          return hasMatch;
        });
        console.log(`Filtered from ${beforeCount} to ${medspasCopy.length} medspas by efficacies`);
      }
    }
    
    // Apply distance filter
    if (activeFilters.distance !== null && activeFilters.distance !== undefined && userLocation) {
      console.log('Filtering by distance:', activeFilters.distance);
      
      medspasCopy = medspasCopy.filter(medspa => {
        if (!medspa.lat || !medspa.lng) return false;
        
        const distance = calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          medspa.lat, 
          medspa.lng
        );
        
        return distance <= activeFilters.distance!;
      });
      
      console.log(`Filtered to ${medspasCopy.length} medspas by distance`);
    }
    
    // Apply advanced filters
    if (advancedFilters) {
      // Filter by price range
      if (advancedFilters.priceRange && advancedFilters.priceRange.length === 2) {
        const [minPrice, maxPrice] = advancedFilters.priceRange;
        if (minPrice > 0 || maxPrice < 1000) {
          medspasCopy = medspasCopy.filter(medspa => {
            const price = findTreatmentPriceNumber(medspa);
            return price >= minPrice && price <= maxPrice;
          });
        }
      }
      
      // Filter by Google star ratings
      if (advancedFilters.googleStars && advancedFilters.googleStars.length > 0) {
        medspasCopy = medspasCopy.filter(medspa => {
          const rating = Math.floor(medspa.google_star || 0);
          return advancedFilters.googleStars.includes(rating);
        });
      }
      
      // Filter by Yelp star ratings
      if (advancedFilters.yelpStars && advancedFilters.yelpStars.length > 0) {
        medspasCopy = medspasCopy.filter(medspa => {
          const rating = Math.floor(medspa.yelp_star || 0);
          return advancedFilters.yelpStars.includes(rating);
        });
      }
      
      // Filter by villages/locations from advancedFilters if activeFilters doesn't have villages
      if (!activeFilters.villages && advancedFilters.villages && advancedFilters.villages.length > 0) {
        medspasCopy = medspasCopy.filter(medspa => {
          return advancedFilters.villages.includes(medspa.village);
        });
      }
      
      // Filter by facilities
      if (advancedFilters.facilities && advancedFilters.facilities.length > 0) {
        medspasCopy = medspasCopy.filter(medspa => {
          // Check if medspa has the selected facilities
          return advancedFilters.facilities.every(facility => {
            if (facility === 'Free consultation') {
              return medspa.free_consultation === 'Yes';
            }
            // Add other facility checks as needed
            return true;
          });
        });
      }
    }
    
    // 🔹 Apply sorting based on selected filter
    if (selectedFilter) {
      console.log(`Applying filter: ${selectedFilter} to ${medspasCopy.length} medspas`);
      
      switch (selectedFilter) {
        case 'Price':
          // 가격 기준 정렬 (낮은 가격순)
          return medspasCopy.sort((a, b) => {
            const priceA = findTreatmentPriceNumber(a);
            const priceB = findTreatmentPriceNumber(b);
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
  }, [medspas, selectedFilter, searchQuery, userLocation, findTreatmentPriceNumber, advancedFilters, activeFilters, priceData, calculateDistance]);

  // Check login status on component mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    
    checkLoginStatus();
  }, []);

  // Intersection Observer to show login modal when 10th item is visible
  useEffect(() => {
    // Only set up observer if user is not logged in and modal hasn't been shown yet
    if (!isLoggedIn && !scrollThreshold.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setShowLoginModal(true);
            scrollThreshold.current = true;
            observer.disconnect(); // Disconnect after triggering once
          }
        },
        {
          threshold: 0.5, // Trigger when 50% of the element is visible
          rootMargin: '100px' // Add some margin to trigger slightly before the element is fully visible
        }
      );

      // Only observe if the tenth item ref exists
      if (tenthItemRef.current) {
        observer.observe(tenthItemRef.current);
      }

      return () => observer.disconnect();
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
        const isValidLng = medspa.lng !== null && medspa.lng !== undefined && !isNaN(medspa.lng);
        
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
  
  // Handle apply filters from FilterModal
  const handleApplyFilters = (filters: Partial<FilterState>) => {
    console.log('Received filters in handleApplyFilters:', filters);
    console.log('Treatment categories received:', filters.treatmentCategories);
    console.log('Efficacies received:', filters.efficacies);
    setActiveFilters(filters);
    console.log('Active filters after update:', activeFilters);
  };
  
  // Clear all filters - Commented out but kept for future reference
  /* const clearAllFilters = () => {
    setSelectedFilter(null);

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
  }; */

  console.log('Received priceData:', {
    totalRecords: priceData.length,
    sampleRecords: priceData.slice(0, 3),
    uniqueTreatmentCategories: [...new Set(priceData.map(p => p.treatment_category))],
    uniqueMedspas: [...new Set(priceData.map(p => p.medspa_name))]
  });

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
                onSearch={(value) => {
                  if (value.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(value.trim())}`;
                  }
                }}
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
            <div className="flex items-center gap-2">
              <SearchFilters 
                selectedFilter={selectedFilter}
                onFilterChange={handleFilterChange}
                onOpenFilterModal={() => setShowFilterModal(true)}
              />
            </div>
            {selectedFilter && (
              <div></div>
            )}
            {/* Loading indicator */}
            {loading && (
              <div className="text-center text-gray-600 py-1">
                <p>Searching...</p>
              </div>
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
              {filteredMedspas.map((medspa, index) => {
                console.log('Processing medspa:', medspa); // 디버깅용 로그
                const imageUrls = [medspa.image_url1, medspa.image_url2, medspa.image_url3].filter(Boolean) as string[];
                const currentIndex = currentImageIndexes[medspa.id] || 0;
                
                return (
                  <div 
                    key={medspa.id}
                    ref={index === 9 ? tenthItemRef : null}
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
                        <h3 className="cormorant text-xl font-semibold text-black break-words leading-[1.1]">
                          {searchQuery ? highlightMatches(medspa.medspa_name, searchQuery.split(' ')) : medspa.medspa_name}
                        </h3>
                        <div className="flex items-center text-gray-500 text-[12px] mt-1">
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
                          google_map_link={medspa.google_map_link}
                          yelp_url={medspa.yelp_url}
                        />
                      </div>
                    </div>
                    
                    {/* Treatment Price */}                    
                    <div className="text-left mt-2">
                      <span className="text-2xl font-bold text-black">
                        {(() => {
                          const priceData = getRandomTreatment(medspa);
                          if (!priceData) return null;
                          
                          return (
                            <>
                              <div className="text-base font-light mb-1">
                                {priceData.treatment_name}
                                {priceData.treatment_category && (
                                  <span className="text-sm text-gray-500 ml-2">
                                    ({priceData.treatment_category})
                                  </span>
                                )}
                              </div>
                              {formatPriceDisplay(priceData)}
                            </>
                          );
                        })()}
                      </span>
                    </div>

                    {/* Review Preview - New Section */}
                    {medspa.review1_text && (
                      <div className="text-left text-gray-600 text-sm ">
                        "{medspa.review1_text.slice(0, 50)}...
                        {medspa.review1_text.length > 20 && (
                          <span className="text-amber-900 font-medium ml-1 cursor-pointer">Read more</span>
                        )}
                      </div>
                    )}

                    {/* Reviews - 이미지와 왼쪽 정렬 */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="min-w-[20px] w-5 h-5 flex-shrink-0 flex items-center justify-center">
                          <Image 
                            src="/icons/thumb_up_gray.png"
                            alt="Thumb up"
                            width={20}
                            height={20}
                            className="text-gray-500 relative top-[1px]"
                          />
                        </div>
                        <span className="text-base text-gray-500">{medspa.good_review_short || ""}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="min-w-[20px] w-5 h-5 flex-shrink-0 flex items-center justify-center">
                        <Image 
                            src="/icons/thumb_down_gray.png"
                            alt="Thumb down"
                        
                            width={20}
                            height={20}
                            className="text-gray-500 relative top-[1px]"
                          />
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
                        className="btn bg-white hover:bg-amber-900 border border-amber-900 text-amber-900 hover:text-white hover:border-amber-900 hover:shadow-lg transform flex items-center justify-center gap-2 flex-1"
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
      
      <AnimatePresence>
        {showFilterModal && (
          <FilterModal
            isOpen={showFilterModal}
            onClose={() => setShowFilterModal(false)}
            onApplyFilters={handleApplyFilters}
            availableVillages={availableVillages}
            initialFilters={activeFilters}
          />
        )}
      </AnimatePresence>
    </>
  );
}
