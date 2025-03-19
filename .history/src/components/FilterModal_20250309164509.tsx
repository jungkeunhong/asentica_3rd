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

  // Reset filters when modal opens with new initialFilters
  React.useEffect(() => {
    if (isOpen) {
      setFilters({
        priceRange: initialFilters?.priceRange || [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE],
        googleStars: initialFilters?.googleStars || [],
        yelpStars: initialFilters?.yelpStars || [],
        villages: initialFilters?.villages || [],
        facilities: initialFilters?.facilities || []
      });
    }
  }, [isOpen, initialFilters]);

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
    console.log(`Village ${village} ${index === -1 ? 'added to' : 'removed from'} filters`);
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
    console.log('Applying filters:', filters);
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
            aria-label="Close filter modal"
          >
            <X size={20} />
          </button>
          <h2 className="text-lg font-medium text-amber-900">Filter by</h2>
          <button 
            onClick={handleReset}
            className="text-amber-900 font-medium"
          >
            Reset
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4 space-y-6">
          {/* Price Range */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-amber-900">Price range</h3>
            <p className="text-sm text-gray-500">Treatment prices including fees and taxes</p>
            
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <label htmlFor="min-price" className="block text-sm text-gray-500 mb-1">Minimum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    id="min-price"
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceChange(0, parseInt(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border rounded-lg bg-white"
                    min={0}
                    aria-label="Minimum price"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label htmlFor="max-price" className="block text-sm text-gray-500 mb-1">Maximum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    id="max-price"
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceChange(1, parseInt(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border rounded-lg bg-white"
                    min={filters.priceRange[0]}
                    aria-label="Maximum price"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Villages/Locations */}
          {availableVillages.length > 0 && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-medium text-amber-900">Location</h3>
              
              <div className="space-y-2">
                {availableVillages.map((village) => (
                  <div key={village} className="flex items-center justify-between">
                    <label htmlFor={`village-${village}`} className="flex-1 cursor-pointer">
                      {village}
                    </label>
                    <input
                      id={`village-${village}`}
                      type="checkbox"
                      checked={filters.villages.includes(village)}
                      onChange={() => toggleVillage(village)}
                      className="w-5 h-5 rounded border-2 border-black text-amber-900 bg-white focus:ring-amber-900"
                      aria-label={`Select ${village}`}
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
              className="w-full bg-amber-900 hover:bg-amber-800 text-white py-2 rounded-lg"
            >
              Apply Filters ({filters.villages.length > 0 ? `${filters.villages.length} locations` : 'All locations'})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;