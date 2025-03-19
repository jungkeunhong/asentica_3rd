'use client';

import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import SearchFilters, { FilterType } from '@/components/SearchFilters';
import ConsultationModal from '@/components/ConsultationModal';
import LoginModal from '@/components/LoginModal';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useFavorites } from '@/context/FavoritesContext';
import { createClient } from '@/utils/supabase/client';
import FilterModal from '@/components/FilterModal';

// Import new components and utilities
import { MedspaCard } from '@/components/medspa/MedspaCard';
import { useMedspaFilters } from '@/hooks/useMedspaFilters';
import { calculateDistance } from '@/utils/distanceUtils';
import { Medspa, PriceData, FilterState } from '@/types';

const DynamicMap = dynamic(() => import('@/components/DynamicMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-lg bg-gray-200 flex items-center justify-center">
      <p className="text-gray-500">loading map...</p>
    </div>
  )
});

interface SearchContentProps {
  initialMedspas: Medspa[];
  searchQuery: string;
  priceData?: PriceData[];
  error?: Error;
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

  const router = useRouter();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  
  // State
  const [medspas, setMedspas] = useState<Medspa[]>(initialMedspas);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedMedspa, setSelectedMedspa] = useState<Medspa | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Partial<FilterState>>({});
  const [loading, setLoading] = useState(false);
  
  // Refs
  const scrollThreshold = useRef(false);
  const tenthItemRef = useRef<HTMLDivElement>(null);
  const coordinatesProcessed = useRef(false);
  
  // Find relevant treatments and get random treatment
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

  // Helper function to find treatment price as a number for sorting
  const findTreatmentPriceNumber = (medspa: Medspa): number => {
    try {
      const priceResult = getRandomTreatment(medspa);
      
      // If it's a PriceData object
      if (priceResult && priceResult.standard_price) {
        const priceStr = priceResult.standard_price;
        
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
  };

  // Use the custom hook for filtering
  const filteredMedspas = useMedspaFilters({
    medspas,
    activeFilters,
    priceData,
    userLocation,
    selectedFilter,
    calculateDistance,
    getRandomTreatment,
    findTreatmentPriceNumber
  });

  // Toggle favorite status
  const toggleFavorite = (medspa: Medspa) => {
    // Check login status
    const checkLoginStatus = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Toggle favorite if logged in
        if (isFavorite(medspa.id)) {
          removeFavorite(medspa.id);
        } else {
          addFavorite(medspa);
        }
      } else {
        // Show login modal if not logged in
        setSelectedMedspa(medspa);
        setShowLoginModal(true);
      }
    };
    
    checkLoginStatus();
  };

  // Handle login success
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    
    // Add favorite after login (if a medspa was selected)
    if (selectedMedspa) {
      addFavorite(selectedMedspa);
    }
    
    // Show consultation modal after login (if scrolled past threshold)
    if (selectedMedspa && scrollThreshold.current) {
      setIsConsultationModalOpen(true);
    }
  };

  // Process medspa coordinates
  useEffect(() => {
    if (coordinatesProcessed.current) return;
    
    const medspaWithCoordinates = medspas.map(medspa => {
      const hasValidLat = medspa.lat !== null && medspa.lat !== undefined && !isNaN(medspa.lat);
      const hasValidLng = medspa.lng !== null && medspa.lng !== undefined && !isNaN(medspa.lng);
      
      const coords = (hasValidLat && hasValidLng) ? {
        lat: medspa.lat as number,
        lng: medspa.lng as number
      } : undefined;
      
      return {
        ...medspa,
        coordinates: coords
      };
    });
    
    setMedspas(medspaWithCoordinates as Medspa[]);
    coordinatesProcessed.current = true;
  }, [medspas]);

  // Get user location
  useEffect(() => {
    navigator.permissions?.query({ name: 'geolocation' })
      .then(permissionStatus => {
        if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
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
            {
              maximumAge: 300000, // Cache location for 5 minutes
              timeout: 10000     // Wait up to 10 seconds
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

  // Fetch search results when search query changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) return; // Keep using initialMedspas if no search query

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

  // Check login status on component mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    
    checkLoginStatus();
  }, []);

  // Intersection Observer for login modal
  useEffect(() => {
    if (!isLoggedIn && !scrollThreshold.current && tenthItemRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setShowLoginModal(true);
            scrollThreshold.current = true;
            observer.disconnect();
          }
        },
        {
          threshold: 0.5,
          rootMargin: '100px'
        }
      );

      observer.observe(tenthItemRef.current);
      return () => observer.disconnect();
    }
  }, [isLoggedIn, filteredMedspas]);

  // Get available villages for filter modal
  const availableVillages = Array.from(new Set(
    medspas
      .map(medspa => medspa.village)
      .filter((village): village is string => typeof village === 'string' && village.trim() !== '')
  )).sort();

  // Handle filter change
  const handleFilterChange = (filter: FilterType) => {
    setSelectedFilter(filter);
    
    // Reset scroll position when filter changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Handle apply filters from FilterModal
  const handleApplyFilters = (filters: Partial<FilterState>) => {
    setActiveFilters(filters);
  };

  // Toggle map view
  const toggleMapView = () => {
    setMapLoading(true);
    setShowMap(!showMap);
    setTimeout(() => setMapLoading(false), 1000);
  };

  // Handle medspa card click
  const handleMedspaClick = (medspaId: string) => {
    router.push(`/medspa/${medspaId}`);
  };

  // Handle consultation request
  const handleConsultationRequest = (medspa: Medspa) => {
    setSelectedMedspa(medspa);
    setIsConsultationModalOpen(true);
  };

  return (
    <>
      <div className="relative flex flex-col min-h-screen">
        <div className="sticky top-0 z-40 bg-white">
          <div className="container mx-auto px-4 pt-4 pb-1 flex items-center justify-between">
            {/* Back Button */}
            <Link href="/" className="flex items-center text-black">
              <ChevronLeftIcon className="h-6 w-6" />
            </Link>

            {/* Search Bar */}
            <div className="w-[480px] flex-1 mx-4">
              <SearchBar 
                initialValue={searchQuery} 
                onSearch={(value) => {
                  if (value.trim()) {
                    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
                  }
                }}
                className="mt-0"
              />
            </div>

            {/* Map Toggle Button */}
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
            {/* Loading indicator */}
            {loading && (
              <div className="text-center text-gray-600 py-1">
                <p>Searching...</p>
              </div>
            )}
          </div>
        </div>

        {/* Map/List View Toggle */}
        {mapLoading ? (
          <div className="container mx-auto px-4 py-2 h-[calc(100vh-140px)] flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
              <p className="text-gray-600">Loading {showMap ? "map" : "list"}...</p>
            </div>
          </div>
        ) : showMap ? (
          <div className="container mx-auto py-1 h-[calc(100vh-140px)]">
            <DynamicMap 
              medspas={filteredMedspas} 
              onMedspaSelect={(medspa) => handleMedspaClick(medspa.id)}
            />
          </div>
        ) : (
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-col gap-4">
              {filteredMedspas.map((medspa, index) => (
                <div 
                  key={medspa.id}
                  ref={index === 9 ? tenthItemRef : null}
                >
                  <MedspaCard
                    medspa={medspa}
                    isFavorite={isFavorite(medspa.id)}
                    onToggleFavorite={() => toggleFavorite(medspa)}
                    onConsultationRequestAction={() => handleConsultationRequest(medspa)}
                    onCardClick={() => handleMedspaClick(medspa.id)}
                    userLocation={userLocation}
                    searchQuery={searchQuery}
                    getRandomTreatment={getRandomTreatment}
                    calculateDistance={calculateDistance}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
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
