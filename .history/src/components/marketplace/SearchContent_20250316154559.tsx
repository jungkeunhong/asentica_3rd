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

  // Check login status on mount
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        
        // Fetch search results from API
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        
        const data = await response.json();
        
        if (data && data.medspas) {
          setMedspas(data.medspas);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch if search query changes and is not empty
    if (searchQuery && searchQuery.trim() !== '') {
      fetchSearchResults();
    }
    
    const checkLoginStatus = async () => {
      const supabase = createClient();
      await supabase.auth.getSession();
    };
    
    checkLoginStatus();
  }, [searchQuery]);

  // Intersection observer for tenth item
  useEffect(() => {
    if (!tenthItemRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          scrollThreshold.current = true;
        }
      },
      { threshold: 0.5 }
    );
    
    observer.observe(tenthItemRef.current);
    
    return () => {
      if (tenthItemRef.current) {
        observer.unobserve(tenthItemRef.current);
      }
    };
  }, [filteredMedspas]);

  // Handle filter change
  const handleFilterChange = (filter: FilterType) => {
    setSelectedFilter(filter);
    
    // Show filter modal for mobile
    if (window.innerWidth < 768) {
      setShowFilterModal(true);
    }
  };

  // Handle apply filters
  const handleApplyFilters = (filters: Partial<FilterState>) => {
    setActiveFilters(filters);
    setShowFilterModal(false);
  };

  // Toggle map view
  const toggleMapView = () => {
    setMapLoading(true);
    setShowMap(!showMap);
    setTimeout(() => {
      setMapLoading(false);
    }, 500);
  };

  // Handle medspa click
  const handleMedspaClick = (medspaId: string) => {
    router.push(`/medspa/${medspaId}`);
  };

  // Handle consultation request
  const handleConsultationRequest = (medspa: Medspa) => {
    setSelectedMedspa(medspa);
    
    // Check if user is logged in
    const checkLoginStatus = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsConsultationModalOpen(true);
      } else {
        setShowLoginModal(true);
      }
    };
    
    checkLoginStatus();
  };

  // Handle filter modal open
  const handleOpenFilterModal = () => {
    setShowFilterModal(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Back button and search bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/" className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </Link>
          <SearchBar initialValue={searchQuery} onSearch={(value) => router.push(`/search?q=${encodeURIComponent(value)}`)} />
          <button
            onClick={toggleMapView}
            className="cormorant ml-auto text-sm font-medium text-black hover:text-amber-700"
          >
            {showMap ? 'List' : 'Map'}
          </button>
        </div>
        
        {/* Filters */}
        <SearchFilters 
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
          onOpenFilterModal={handleOpenFilterModal}
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1 px-4 py-4">
        {/* Results count */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {loading ? 'Searching...' : `${filteredMedspas.length} results`}
          </h2>
        </div>
        
        {/* Map view */}
        {showMap && (
          <div className="h-[calc(100vh-200px)] mb-4 rounded-lg overflow-hidden">
            {mapLoading ? (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Loading map...</p>
              </div>
            ) : (
              <DynamicMap 
                medspas={filteredMedspas}
                onMedspaSelect={(medspa) => handleMedspaClick(medspa.id)}
              />
            )}
          </div>
        )}
        
        {/* List view */}
        {!showMap && (
          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse bg-gray-100 rounded-lg p-4 h-48"></div>
              ))
            ) : filteredMedspas.length > 0 ? (
              // Results list
              filteredMedspas.map((medspa, index) => (
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
              ))
            ) : (
              // No results
              <div className="text-center py-8">
                <p className="text-gray-500">No results found for &quot;{searchQuery}&quot;</p>
                <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Modals */}
      <AnimatePresence>
        {isConsultationModalOpen && selectedMedspa && (
          <ConsultationModal
            medspa={selectedMedspa}
            isOpen={isConsultationModalOpen}
            onClose={() => setIsConsultationModalOpen(false)}
          />
        )}
        
        {showLoginModal && (
          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
        
        {showFilterModal && (
          <FilterModal
            isOpen={showFilterModal}
            onClose={() => setShowFilterModal(false)}
            onApplyFilters={handleApplyFilters}
            initialFilters={activeFilters}
            availableVillages={[]}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 