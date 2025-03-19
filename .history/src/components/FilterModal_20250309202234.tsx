'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

// Define the filter state interface
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
const DEFAULT_MAX_PRICE = 10000;

// Star rating options
const STAR_RATINGS = [4.5, 3.5, 2.5, 1.5];

// Distance options in miles
const DISTANCE_OPTIONS = [2, 5, 10, 15, 20, 30];

// Predefined treatment categories and efficacies
const TREATMENT_CATEGORIES = [
  'Botox',
  'Filler',
  'Facial',
  'Skin Booster',
  'Hydrafacial',
  'Microneedling',
  'Laser Treatment',
  'IPL',
  'Body Contouring',
  'Skin Tightening',
  'Lip Treatment',
  'Hair Removal',
  'Permanent Makeup',
  'LED Therapy',
  'PRP',
  'Peel',
  'Lift',
  'HIFU',
  'BBL',
  'Vaginal Rejuvenation',
  'RF Treatment',
  'Vitamin Injection',
  'Therapy',
  'Hair Restoration',
  'Massage',
  'Weight management',
  'Pain Management',
  'Package',
  'Vein Treatments',
  'Dissolver',
  'Scalp Treatment',
  'Non-Surgical Rhinoplasty',
  'Biostimulator',
  'Sweat Reduction',
  'Membership',
  'Other'
];

const EFFICACIES = [
  'Skin Rejuvenation & Anti-Aging',
  'Volume Enhancement',
  'Wrinkle Reduction',
  'Skin Tightening & Lifting',
  'Facials & Hydration',
  'Aesthetic & Cosmetic Enhancements',
  'Hair & Scalp Treatments',
  'Medical & Wellness Treatments'
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
    facilities: initialFilters?.facilities || [],
    distance: initialFilters?.distance || null,
    treatmentCategories: initialFilters?.treatmentCategories || [],
    efficacies: initialFilters?.efficacies || []
  });

  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    treatmentCategories: false,
    efficacies: false,
    villages: false
  });

  // Available options are now constants, no need for state
  const availableOptions = {
    treatmentCategories: TREATMENT_CATEGORIES,
    efficacies: EFFICACIES
  };

  // No need to fetch from Supabase anymore, using predefined data
  useEffect(() => {
    if (isOpen) {
      console.log('Using predefined treatment categories and efficacies');
    }
  }, [isOpen]);

  // Reset filters when modal opens with new initialFilters
  React.useEffect(() => {
    if (isOpen) {
      setFilters({
        priceRange: initialFilters?.priceRange || [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE],
        googleStars: initialFilters?.googleStars || [],
        yelpStars: initialFilters?.yelpStars || [],
        villages: initialFilters?.villages || [],
        facilities: initialFilters?.facilities || [],
        distance: initialFilters?.distance || null,
        treatmentCategories: initialFilters?.treatmentCategories || [],
        efficacies: initialFilters?.efficacies || []
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

  // Handle price slider change
  const handlePriceSliderChange = (values: number[]) => {
    setFilters({ 
      ...filters, 
      priceRange: [values[0], values[1]] as [number, number] 
    });
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

  // Handle star rating selection
  const toggleStarRating = (rating: number, type: 'google' | 'yelp') => {
    const currentRatings = type === 'google' ? [...filters.googleStars] : [...filters.yelpStars];
    const index = currentRatings.indexOf(rating);
    
    if (index === -1) {
      // Remove any existing ratings that are lower than the selected one
      const newRatings = currentRatings.filter(r => r > rating);
      newRatings.push(rating);
      if (type === 'google') {
        setFilters({ ...filters, googleStars: newRatings });
      } else {
        setFilters({ ...filters, yelpStars: newRatings });
      }
    } else {
      currentRatings.splice(index, 1);
      if (type === 'google') {
        setFilters({ ...filters, googleStars: currentRatings });
      } else {
        setFilters({ ...filters, yelpStars: currentRatings });
      }
    }
  };

  // Handle distance selection
  const handleDistanceChange = (distance: number) => {
    setFilters({ ...filters, distance: filters.distance === distance ? null : distance });
  };

  // Handle treatment option selection
  const toggleTreatmentOption = (option: string, type: 'treatmentCategories' | 'efficacies') => {
    const currentOptions = [...filters[type]];
    const index = currentOptions.indexOf(option);
    
    if (index === -1) {
      currentOptions.push(option);
    } else {
      currentOptions.splice(index, 1);
    }
    
    setFilters({ ...filters, [type]: currentOptions });
  };

  // Toggle expanded section
  const toggleExpandedSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle reset filters
  const handleReset = () => {
    setFilters({
      priceRange: [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE],
      googleStars: [],
      yelpStars: [],
      villages: [],
      facilities: [],
      distance: null,
      treatmentCategories: [],
      efficacies: []
    });
  };

  // Handle apply filters
  const handleApply = () => {
    console.log('Applying filters from modal:', filters);
    console.log('Treatment categories selected:', filters.treatmentCategories);
    console.log('Efficacies selected:', filters.efficacies);
    onApplyFilters(filters);
    onClose();
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black bg-opacity-50 pt-16">
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl max-h-[90vh] overflow-auto">
        {/* Header - Made sticky */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-white">
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close filter modal"
          >
            <X size={20} />
          </button>
          <h2 className="text-lg font-medium text-amber-900">Filter</h2>
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
            
            {/* Price Slider */}
            <div className="py-6 px-2">
              <Slider
                defaultValue={filters.priceRange}
                min={0}
                max={5000}
                step={10}
                value={filters.priceRange}
                onValueChange={handlePriceSliderChange}
                className="mt-3"
              />
            </div>
            
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
                    aria-label="Minimum"
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
                    aria-label="Maximum"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Distance */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium text-amber-900">Distance</h3>
            <div className="flex flex-wrap gap-2">
              {DISTANCE_OPTIONS.map((distance) => (
                <button
                  key={`distance-${distance}`}
                  onClick={() => handleDistanceChange(distance)}
                  className={`px-4 py-1.5 rounded-full border ${
                    filters.distance === distance
                      ? 'bg-amber-900 text-white border-amber-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-900'
                  }`}
                >
                  {distance} {distance === 1 ? 'mile' : 'miles'}
                </button>
              ))}
            </div>
          </div>

          {/* Google Star Ratings */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium text-amber-900">Google Ratings</h3>
            <div className="flex flex-wrap gap-2">
              {STAR_RATINGS.map((rating) => (
                <button
                  key={`google-${rating}`}
                  onClick={() => toggleStarRating(rating, 'google')}
                  className={`px-4 py-1.5 rounded-full border ${
                    filters.googleStars.includes(rating)
                      ? 'bg-amber-900 text-white border-amber-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-900'
                  }`}
                >
                  {rating} stars
                </button>
              ))}
            </div>
          </div>

          {/* Yelp Star Ratings */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium text-amber-900">Yelp Ratings</h3>
            <div className="flex flex-wrap gap-2">
              {STAR_RATINGS.map((rating) => (
                <button
                  key={`yelp-${rating}`}
                  onClick={() => toggleStarRating(rating, 'yelp')}
                  className={`px-4 py-1.5 rounded-full border ${
                    filters.yelpStars.includes(rating)
                      ? 'bg-amber-900 text-white border-amber-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-900'
                  }`}
                >
                  {rating} stars
                </button>
              ))}
            </div>
          </div>

          {/* Efficacies */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-amber-900">Effects</h3>
              <button 
                onClick={() => toggleExpandedSection('efficacies')}
                className="text-amber-900"
              >
                {expandedSections.efficacies ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
            
            <div className="space-y-2">
              {availableOptions.efficacies.length > 0 ? (
                availableOptions.efficacies
                  .slice(0, expandedSections.efficacies ? undefined : 5)
                  .map((efficacy) => (
                    <div key={efficacy} className="flex items-center justify-between">
                      <label htmlFor={`efficacy-${efficacy}`} className="flex-1 cursor-pointer">
                        {efficacy}
                      </label>
                      <input
                        id={`efficacy-${efficacy}`}
                        type="checkbox"
                        checked={filters.efficacies.includes(efficacy)}
                        onChange={() => toggleTreatmentOption(efficacy, 'efficacies')}
                        className="w-5 h-5 rounded border-2 border-amber-900 text-amber-900 bg-white focus:ring-amber-900"
                      />
                    </div>
                  ))
              ) : (
                <div className="text-gray-500">Loading efficacies...</div>
              )}
              
              {availableOptions.efficacies.length > 5 && (
                <button 
                  onClick={() => toggleExpandedSection('efficacies')}
                  className="text-amber-900 text-sm font-medium mt-2"
                >
                  {expandedSections.efficacies ? 'Show less' : '...more'}
                </button>
              )}
            </div>
          </div>

          {/* Treatment Categories */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-amber-900">Treatment</h3>
              <button 
                onClick={() => toggleExpandedSection('treatmentCategories')}
                className="text-amber-900"
              >
                {expandedSections.treatmentCategories ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
            
            <div className="space-y-2">
              {availableOptions.treatmentCategories.length > 0 ? (
                availableOptions.treatmentCategories
                  .slice(0, expandedSections.treatmentCategories ? undefined : 5)
                  .map((category) => (
                    <div key={category} className="flex items-center justify-between">
                      <label htmlFor={`category-${category}`} className="flex-1 cursor-pointer">
                        {category}
                      </label>
                      <input
                        id={`category-${category}`}
                        type="checkbox"
                        checked={filters.treatmentCategories.includes(category)}
                        onChange={() => toggleTreatmentOption(category, 'treatmentCategories')}
                        className="w-5 h-5 rounded border-2 border-amber-900 text-amber-900 bg-white focus:ring-amber-900"
                      />
                    </div>
                  ))
              ) : (
                <div className="text-gray-500">Loading treatment categories...</div>
              )}
              
              {availableOptions.treatmentCategories.length > 5 && (
                <button 
                  onClick={() => toggleExpandedSection('treatmentCategories')}
                  className="text-amber-900 text-sm font-medium mt-2"
                >
                  {expandedSections.treatmentCategories ? 'Show less' : '...more'}
                </button>
              )}
            </div>
          </div>

          {/* Villages/Locations */}
          {availableVillages.length > 0 && (
            <div className="space-y-4 border-t pt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-amber-900">Location</h3>
                <button 
                  onClick={() => toggleExpandedSection('villages')}
                  className="text-amber-900"
                >
                  {expandedSections.villages ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
              
              <div className="space-y-2">
                {availableVillages
                  .slice(0, expandedSections.villages ? undefined : 5)
                  .map((village) => (
                    <div key={village} className="flex items-center justify-between">
                      <label htmlFor={`village-${village}`} className="flex-1 cursor-pointer">
                        {village}
                      </label>
                      <input
                        id={`village-${village}`}
                        type="checkbox"
                        checked={filters.villages.includes(village)}
                        onChange={() => toggleVillage(village)}
                        className="w-5 h-5 rounded border-2 border-amber-900 text-amber-900 bg-white focus:ring-amber-900"
                        aria-label={`Select ${village}`}
                      />
                    </div>
                  ))}
                
                {availableVillages.length > 5 && (
                  <button 
                    onClick={() => toggleExpandedSection('villages')}
                    className="text-amber-900 text-sm font-medium mt-2"
                  >
                    {expandedSections.villages ? 'Show less' : '...more'}
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t p-4">
            <Button 
              onClick={handleApply}
              className="w-full bg-amber-900 hover:bg-amber-800 text-white py-2 rounded-lg"
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