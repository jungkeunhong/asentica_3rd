'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define the filter state interface
interface FilterState {
  priceRange: [number, number];
  googleStars: number[];
  yelpStars: number[];
  villages: string[];
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

const FilterModal: React.FC<FilterModalProps> = ({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  availableVillages, 
  initialFilters 
}) => {
  // Initialize filter state with defaults or initial values
  const [filters, setFilters] = React.useState<FilterState>({
    priceRange: initialFilters?.priceRange || [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE],
    googleStars: initialFilters?.googleStars || [],
    yelpStars: initialFilters?.yelpStars || [],
    villages: initialFilters?.villages || [],
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

  // Handle reset filters
  const handleReset = () => {
    setFilters({
      priceRange: [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE],
      googleStars: [],
      yelpStars: [],
      villages: [],
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

          {/* Villages/Locations */}
          {availableVillages.length > 0 && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-medium">Location</h3>
              
              <div className="space-y-2">
                {availableVillages.map((village) => (
                  <div key={village} className="flex items-center justify-between">
                    <span>{village}</span>
                    <input
                      type="checkbox"
                      checked={filters.villages.includes(village)}
                      onChange={() => toggleVillage(village)}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t p-4">
            <Button 
              onClick={handleApply}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;