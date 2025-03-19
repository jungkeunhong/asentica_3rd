'use client';

import { useMemo } from 'react';
import { Medspa, PriceData, FilterState } from '@/types';

type FilterFunction = (medspa: Medspa, priceData: PriceData[], getRandomTreatment: (medspa: Medspa) => PriceData | null) => boolean;

interface UseMedspaFiltersProps {
  medspas: Medspa[];
  activeFilters: Partial<FilterState>;
  priceData: PriceData[];
  userLocation: { lat: number; lng: number } | null;
  selectedFilter: string | null;
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
  getRandomTreatment: (medspa: Medspa) => PriceData | null;
  findTreatmentPriceNumber: (medspa: Medspa) => number;
}

export const useMedspaFilters = ({
  medspas,
  activeFilters,
  priceData,
  userLocation,
  selectedFilter,
  calculateDistance,
  getRandomTreatment,
  findTreatmentPriceNumber
}: UseMedspaFiltersProps) => {
  
  // Filter by village
  const filterByVillage: FilterFunction = (medspa) => {
    if (!activeFilters.villages || activeFilters.villages.length === 0) return true;
    return medspa.village ? activeFilters.villages.includes(medspa.village) : false;
  };

  // Filter by treatment category
  const filterByTreatmentCategory: FilterFunction = (medspa, priceItems) => {
    if (!activeFilters.treatmentCategories || activeFilters.treatmentCategories.length === 0) return true;
    
    // Create a set of selected categories (lowercase for case-insensitive comparison)
    const selectedCategories = new Set(
      activeFilters.treatmentCategories.map(cat => cat.toLowerCase())
    );
    
    // Check if any of this medspa's price data matches the selected categories
    return priceItems.some(price => 
      price.medspa_id === medspa.id && 
      price.treatment_category && 
      selectedCategories.has(price.treatment_category.toLowerCase())
    );
  };

  // Filter by efficacy
  const filterByEfficacy: FilterFunction = (medspa, priceItems) => {
    if (!activeFilters.efficacies || activeFilters.efficacies.length === 0) return true;
    
    // Create a set of selected efficacies (lowercase for case-insensitive comparison)
    const selectedEfficacies = new Set(
      activeFilters.efficacies.map(eff => eff.toLowerCase())
    );
    
    // Check if any of this medspa's price data matches the selected efficacies
    return priceItems.some(price => 
      price.medspa_id === medspa.id && 
      price.efficacy && 
      selectedEfficacies.has(price.efficacy.toLowerCase())
    );
  };

  // Filter by distance
  const filterByDistance = (medspa: Medspa): boolean => {
    if (activeFilters.distance === null || activeFilters.distance === undefined || !userLocation) {
      return true;
    }
    
    if (!medspa.lat || !medspa.lng) return false;
    
    const distance = calculateDistance(
      userLocation.lat, 
      userLocation.lng, 
      medspa.lat, 
      medspa.lng
    );
    
    return distance <= activeFilters.distance;
  };

  // Filter by price range
  const filterByPriceRange = (medspa: Medspa): boolean => {
    if (!activeFilters.priceRange || activeFilters.priceRange.length !== 2) {
      return true;
    }
    
    const [minPrice, maxPrice] = activeFilters.priceRange;
    if (minPrice <= 0 && maxPrice >= 10000) {
      return true; // Default price range, don't filter
    }
    
    const price = findTreatmentPriceNumber(medspa);
    return price >= minPrice && price <= maxPrice;
  };

  // Filter by Google star rating
  const filterByGoogleStars = (medspa: Medspa): boolean => {
    if (!activeFilters.googleStars || activeFilters.googleStars.length === 0) {
      return true;
    }
    
    const rating = medspa.google_star || 0;
    return activeFilters.googleStars.some(minRating => rating >= minRating);
  };

  // Filter by Yelp star rating
  const filterByYelpStars = (medspa: Medspa): boolean => {
    if (!activeFilters.yelpStars || activeFilters.yelpStars.length === 0) {
      return true;
    }
    
    const rating = medspa.yelp_star || 0;
    return activeFilters.yelpStars.some(minRating => rating >= minRating);
  };

  // Filter by Google reviews count
  const filterByGoogleReviews = (medspa: Medspa): boolean => {
    if (!activeFilters.googleReviews) {
      return true;
    }
    
    const reviewCount = medspa.google_review || 0;
    return reviewCount >= activeFilters.googleReviews;
  };

  // Filter by Yelp reviews count
  const filterByYelpReviews = (medspa: Medspa): boolean => {
    if (!activeFilters.yelpReviews) {
      return true;
    }
    
    const reviewCount = medspa.yelp_review || 0;
    return reviewCount >= activeFilters.yelpReviews;
  };

  // Filter by free consultation
  const filterByFreeConsultation = (medspa: Medspa): boolean => {
    if (activeFilters.freeConsultation === null || activeFilters.freeConsultation === undefined) {
      return true;
    }
    
    const hasConsultation = medspa.free_consultation === 'Yes';
    return activeFilters.freeConsultation === hasConsultation;
  };

  // Apply all filters and sorting
  const filteredMedspas = useMemo(() => {
    if (!medspas.length) return [];
    
    // Apply all filters
    let result = medspas.filter(medspa => 
      filterByVillage(medspa, priceData, getRandomTreatment) &&
      filterByTreatmentCategory(medspa, priceData, getRandomTreatment) && 
      filterByEfficacy(medspa, priceData, getRandomTreatment) && 
      filterByDistance(medspa) &&
      filterByPriceRange(medspa) &&
      filterByGoogleStars(medspa) &&
      filterByYelpStars(medspa) &&
      filterByGoogleReviews(medspa) &&
      filterByYelpReviews(medspa) &&
      filterByFreeConsultation(medspa)
    );
    
    // Apply sorting based on selected filter
    if (selectedFilter) {
      switch (selectedFilter) {
        case 'Price':
          // Sort by price (lowest first)
          result = result.sort((a, b) => {
            const priceA = findTreatmentPriceNumber(a);
            const priceB = findTreatmentPriceNumber(b);
            return priceA - priceB;
          });
          break;
          
        case 'google_star':
          // Sort by Google rating (highest first)
          result = result.sort((a, b) => {
            const ratingA = a.google_star || 0;
            const ratingB = b.google_star || 0;
            return ratingB - ratingA;
          });
          break;
          
        case 'google_review':
          // Sort by Google review count (highest first)
          result = result.sort((a, b) => {
            const reviewsA = a.google_review || 0;
            const reviewsB = b.google_review || 0;
            return reviewsB - reviewsA;
          });
          break;
          
        case 'yelp_star':
          // Sort by Yelp rating (highest first)
          result = result.sort((a, b) => {
            const ratingA = a.yelp_star || 0;
            const ratingB = b.yelp_star || 0;
            return ratingB - ratingA;
          });
          break;
          
        case 'yelp_review':
          // Sort by Yelp review count (highest first)
          result = result.sort((a, b) => {
            const reviewsA = a.yelp_review || 0;
            const reviewsB = b.yelp_review || 0;
            return reviewsB - reviewsA;
          });
          break;
          
        case 'Distance':
          // Sort by distance (nearest first)
          if (userLocation) {
            result = result.sort((a, b) => {
              try {
                // Use actual coordinates when available
                const coordsA = a.coordinates || (a.lat && a.lng ? { lat: a.lat, lng: a.lng } : null);
                const coordsB = b.coordinates || (b.lat && b.lng ? { lat: b.lat, lng: b.lng } : null);
                
                if (!coordsA || !coordsB) return 0;
                
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
          }
          break;
          
        case 'Free consultation':
          // Sort by free consultation availability
          result = result.sort((a, b) => {
            const hasConsultationA = a.free_consultation === 'Yes';
            const hasConsultationB = b.free_consultation === 'Yes';
            
            if (hasConsultationA && !hasConsultationB) return -1;
            if (!hasConsultationA && hasConsultationB) return 1;
            return 0;
          });
          break;
      }
    }
    
    return result;
  }, [
    medspas, 
    activeFilters, 
    priceData, 
    userLocation, 
    selectedFilter,
    calculateDistance,
    getRandomTreatment,
    findTreatmentPriceNumber,
    filterByVillage,
    filterByTreatmentCategory,
    filterByEfficacy,
    filterByDistance,
    filterByPriceRange,
    filterByGoogleStars,
    filterByYelpStars,
    filterByGoogleReviews,
    filterByYelpReviews,
    filterByFreeConsultation
  ]);
  
  return filteredMedspas;
}; 