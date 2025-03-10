'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// Define the filter state interface
interface FilterState {
  priceRange: [number, number];
  googleStars: number[];
  yelpStars: number[];
  villages: string[];
  roomsAndBeds: {
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  facilities: string[];
}

// Define the props for the FilterModal component
interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  availableVillages: string[];
  initialFilters?: Partial<FilterState>;
}

// Default price range values
const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000;

// Star rating options
const STAR_RATINGS = [1, 2, 3, 4, 5];

// Facility options
const FACILITIES = [
  'Free consultation',
  'Online booking',
  'Weekend hours',
  'Evening hours',
  'Parking available'
];

export default function FilterModal({
  isOpen,
  onClose,
  onApplyFilters,
  availableVillages,
  initialFilters
}: FilterModalProps) {
  // Initialize filter state with defaults or initial values
  const [filters, setFilters] = useState<FilterState>({
    priceRange: initialFilters?.priceRange || [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE],
    googleStars: initialFilters?.googleStars || [],
    yelpStars: initialFilters?.yelpStars || [],
    villages: initialFilters?.villages || [],
    roomsAndBeds: initialFilters?.roomsAndBeds || {
      bedrooms: 0,
      beds: 0,
      bathrooms: 0
    },
    facilities: initialFilters?.facilities || []
  });

  // Handle price range changes
  const handlePriceChange = (index: number, value: number) => {
    const newPriceRange = [...filters.priceRange] as [number, number];
    newPriceRange[index] = value;
    
    // Ensure min <= max
    if (index === 0 && value > newPriceRange[1]) {
      newPriceRange[1] = value;
    } else if (index === 1 && value < newPriceRange[0]) {
      newPriceRange[0] = value;
    }
    
    setFilters({ ...filters, priceRange: newPriceRange });
  };

  // Handle star rating selection
  const toggleStarRating = (rating: number, type: 'google' | 'yelp') => {
    const currentRatings = type === 'google' ? [...filters.googleStars] : [...filters.yelpStars];
    const index = currentRatings.indexOf(rating);
    
    if (index === -1) {
      currentRatings.push(rating);
    } else {
      currentRatings.splice(index, 1);
    }
    
    if (type === 'google') {
      setFilters({ ...filters, googleStars: currentRatings });
    } else {
      setFilters({ ...filters, yelpStars: currentRatings });
    }
  };

  // Handle village selection
  const toggleVillage = (village: string) => {
    const currentVillages = [...filters.villages];
    const index = currentVillages.indexOf(village);
    
    if (index === -1) {
      currentVillages.push(village);
    } else {
      currentVillages.splice(index, 1);
    }
    
    setFilters({ ...filters, villages: currentVillages });
  };

  // Handle facility selection
  const toggleFacility = (facility: string) => {
    const currentFacilities = [...filters.facilities];
    const index = currentFacilities.indexOf(facility);
    
    if (index === -1) {
      currentFacilities.push(facility);
    } else {
      currentFacilities.splice(index, 1);
    }
    
    setFilters({ ...filters, facilities: currentFacilities });
  };

  // Handle rooms and beds changes
  const handleRoomsBedsChange = (type: 'bedrooms' | 'beds' | 'bathrooms', value: number) => {
    // Ensure value is not negative
    const newValue = Math.max(0, value);
    
    setFilters({
      ...filters,
      roomsAndBeds: {
        ...filters.roomsAndBeds,
        [type]: newValue
      }
    });
  };

  // Handle reset filters
  const handleReset = () => {
    setFilters({
      priceRange: [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE],
      googleStars: [],
      yelpStars: [],
      villages: [],
      roomsAndBeds: {
        bedrooms: 0,
        beds: 0,
        bathrooms: 0
      },
      facilities: []
    });
  };

  // Handle apply filters
  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black bg-opacity-50 pt-16">
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
          <h2 className="text-lg font-medium">Filter by</h2>
          <button 
            onClick={handleReset}
            className="text-blue-500 font-medium"
          >
            Reset
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4 space-y-6">
          {/* Price Range */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Price range</h3>
            <p className="text-sm text-gray-500">Treatment prices including fees and taxes</p>
            
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">Minimum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceChange(0, parseInt(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border rounded-lg"
                    min={0}
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">Maximum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceChange(1, parseInt(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border rounded-lg"
                    min={filters.priceRange[0]}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rooms and Beds */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium">Rooms and beds</h3>
            
            <div className="space-y-4">
              {/* Bedrooms */}
              <div className="flex items-center justify-between">
                <span>Bedrooms</span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleRoomsBedsChange('bedrooms', filters.roomsAndBeds.bedrooms - 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded-full"
                    disabled={filters.roomsAndBeds.bedrooms <= 0}
                  >
                    −
                  </button>
                  <span className="w-8 text-center">{filters.roomsAndBeds.bedrooms}</span>
                  <button 
                    onClick={() => handleRoomsBedsChange('bedrooms', filters.roomsAndBeds.bedrooms + 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded-full text-blue-500 border-blue-500"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Beds */}
              <div className="flex items-center justify-between">
                <span>Beds</span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleRoomsBedsChange('beds', filters.roomsAndBeds.beds - 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded-full"
                    disabled={filters.roomsAndBeds.beds <= 0}
                  >
                    −
                  </button>
                  <span className="w-8 text-center">{filters.roomsAndBeds.beds}</span>
                  <button 
                    onClick={() => handleRoomsBedsChange('beds', filters.roomsAndBeds.beds + 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded-full text-blue-500 border-blue-500"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Bathrooms */}
              <div className="flex items-center justify-between">
                <span>Bathrooms</span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleRoomsBedsChange('bathrooms', filters.roomsAndBeds.bathrooms - 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded-full"
                    disabled={filters.roomsAndBeds.bathrooms <= 0}
                  >
                    −
                  </button>
                  <span className="w-8 text-center">{filters.roomsAndBeds.bathrooms}</span>
                  <button 
                    onClick={() => handleRoomsBedsChange('bathrooms', filters.roomsAndBeds.bathrooms + 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded-full text-blue-500 border-blue-500"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium">Facilities</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {FACILITIES.map((facility) => (
                <div key={facility} className="flex items-center justify-between">
                  <span>{facility}</span>
                  <input
                    type="checkbox"
                    checked={filters.facilities.includes(facility)}
                    onChange={() => toggleFacility(facility)}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Property Rating */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium">Google Rating</h3>
            
            <div className="space-y-2">
              {STAR_RATINGS.map((rating) => (
                <div key={`google-${rating}`} className="flex items-center justify-between">
                  <span>{rating} star{rating !== 1 ? 's' : ''}</span>
                  <input
                    type="checkbox"
                    checked={filters.googleStars.includes(rating)}
                    onChange={() => toggleStarRating(rating, 'google')}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Yelp Rating */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium">Yelp Rating</h3>
            
            <div className="space-y-2">
              {STAR_RATINGS.map((rating) => (
                <div key={`yelp-${rating}`} className="flex items-center justify-between">
                  <span>{rating} star{rating !== 1 ? 's' : ''}</span>
                  <input
                    type="checkbox"
                    checked={filters.yelpStars.includes(rating)}
                    onChange={() => toggleStarRating(rating, 'yelp')}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Villages/Locations */}
          {availableVillages.length > 0 && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-medium">Location</h3>
              
              <div className="space-y-2">
                {avail