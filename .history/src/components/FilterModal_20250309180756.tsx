'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { createClient } from '@/utils/supabase/client';

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
  treatmentNames: string[];
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

// Distance options in miles
const DISTANCE_OPTIONS = [1, 2, 5, 10, 15, 20];

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
    efficacies: initialFilters?.efficacies || [],
    treatmentNames: initialFilters?.treatmentNames || []
  });

  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    treatmentCategories: false,
    efficacies: false,
    treatmentNames: false
  });

  // State for available options
  const [availableOptions, setAvailableOptions] = useState({
    treatmentCategories: [] as string[],
    efficacies: [] as string[],
    treatmentNames: [] as string[]
  });

  // Fetch treatment options from Supabase
  useEffect(() => {
    if (isOpen) {
      const fetchTreatmentOptions = async () => {
        try {
          console.log('Fetching treatment options...');
          const supabase = createClient();
          
          // Check available tables
          const { data: tableData, error: tableError } = await supabase
            .from('medspa_treatment_price')
            .select('*')
            .limit(1);
          
          console.log('Table check:', { tableData, tableError });
          
          if (tableError) {
            console.error('Error checking table:', tableError);
            
            // Fallback: Add some example data for testing
            setAvailableOptions({
              treatmentCategories: ['Botox', 'Filler', 'Laser', 'Chemical Peel', 'Microdermabrasion'],
              efficacies: ['Anti-aging', 'Skin Rejuvenation', 'Acne Treatment', 'Hair Removal', 'Fat Reduction'],
              treatmentNames: ['Botox Cosmetic', 'Juvederm', 'Restylane', 'IPL Photofacial', 'Fraxel Laser']
            });
            return;
          }
          
          // Fetch treatment categories
          const { data: categoryData, error: categoryError } = await supabase
            .from('medspa_treatment_price')
            .select('treatment_category')
            .not('treatment_category', 'is', null);
          
          // Fetch efficacies
          const { data: efficacyData, error: efficacyError } = await supabase
            .from('medspa_treatment_price')
            .select('efficacy')
            .not('efficacy', 'is', null);
          
          
          if (categoryError || efficacyError || nameError) {
            console.error('Error fetching treatment options:', { categoryError, efficacyError, nameError });
            
            // Fallback: Add some example data for testing
            setAvailableOptions({
              treatmentCategories: ['Botox', 'Filler', 'Laser', 'Chemical Peel', 'Microdermabrasion'],
              efficacies: ['Anti-aging', 'Skin Rejuvenation', 'Acne Treatment', 'Hair Removal', 'Fat Reduction'],
              treatmentNames: ['Botox Cosmetic', 'Juvederm', 'Restylane', 'IPL Photofacial', 'Fraxel Laser']
            });
            return;
          }
          
          // Extract unique values
          const uniqueCategories = [...new Set(categoryData?.map(item => item.treatment_category))];
          const uniqueEfficacies = [...new Set(efficacyData?.map(item => item.efficacy))];
 
          console.log('Fetched treatment options:', {
            categories: uniqueCategories,
            efficacies: uniqueEfficacies,
            names: uniqueNames
          });
          
          // If no data is returned, use fallback data
          if (uniqueCategories.length === 0 && uniqueEfficacies.length === 0 && uniqueNames.length === 0) {
            console.log('No data returned from Supabase, using fallback data');
            setAvailableOptions({
              treatmentCategories: ['Botox', 'Filler', 'Laser', 'Chemical Peel', 'Microdermabrasion'],
              efficacies: ['Anti-aging', 'Skin Rejuvenation', 'Acne Treatment', 'Hair Removal', 'Fat Reduction'],
              treatmentNames: ['Botox Cosmetic', 'Juvederm', 'Restylane', 'IPL Photofacial', 'Fraxel Laser']
            });
            return;
          }
          
          setAvailableOptions({
            treatmentCategories: uniqueCategories.length > 0 ? uniqueCategories as string[] : ['Botox', 'Filler', 'Laser', 'Chemical Peel', 'Microdermabrasion'],
            efficacies: uniqueEfficacies.length > 0 ? uniqueEfficacies as string[] : ['Anti-aging', 'Skin Rejuvenation', 'Acne Treatment', 'Hair Removal', 'Fat Reduction'],
            treatmentNames: uniqueNames.length > 0 ? uniqueNames as string[] : ['Botox Cosmetic', 'Juvederm', 'Restylane', 'IPL Photofacial', 'Fraxel Laser']
          });
        } catch (error) {
          console.error('Error in fetchTreatmentOptions:', error);
          
          // Fallback: Add some example data for testing
          setAvailableOptions({
            treatmentCategories: ['Botox', 'Filler', 'Laser', 'Chemical Peel', 'Microdermabrasion'],
            efficacies: ['Anti-aging', 'Skin Rejuvenation', 'Acne Treatment', 'Hair Removal', 'Fat Reduction'],
            treatmentNames: ['Botox Cosmetic', 'Juvederm', 'Restylane', 'IPL Photofacial', 'Fraxel Laser']
          });
        }
      };
      
      fetchTreatmentOptions();
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
        efficacies: initialFilters?.efficacies || [],
        treatmentNames: initialFilters?.treatmentNames || []
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

  // Handle distance selection
  const handleDistanceChange = (distance: number) => {
    setFilters({ ...filters, distance: filters.distance === distance ? null : distance });
  };

  // Handle treatment option selection
  const toggleTreatmentOption = (option: string, type: 'treatmentCategories' | 'efficacies' | 'treatmentNames') => {
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
      efficacies: [],
      treatmentNames: []
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
            
            {/* Price Slider */}
            <div className="py-6 px-2">
              <Slider
                defaultValue={filters.priceRange}
                min={0}
                max={1000}
                step={10}
                value={filters.priceRange}
                onValueChange={handlePriceSliderChange}
                className="mt-6"
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

          {/* Distance */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium text-amber-900">Distance</h3>
            <div className="flex flex-wrap gap-2">
              {DISTANCE_OPTIONS.map((distance) => (
                <button
                  key={`distance-${distance}`}
                  onClick={() => handleDistanceChange(distance)}
                  className={`px-4 py-2 rounded-full border ${
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
                  className={`px-4 py-2 rounded-full border ${
                    filters.googleStars.includes(rating)
                      ? 'bg-amber-900 text-white border-amber-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-900'
                  }`}
                >
                  {rating}★
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
                  className={`px-4 py-2 rounded-full border ${
                    filters.yelpStars.includes(rating)
                      ? 'bg-amber-900 text-white border-amber-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-900'
                  }`}
                >
                  {rating}★
                </button>
              ))}
            </div>
          </div>

          {/* Treatment Categories */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-amber-900">Treatment Categories</h3>
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
                        className="w-5 h-5 rounded border-2 border-black text-amber-900 bg-white focus:ring-amber-900"
                        aria-label={`Select ${category}`}
                      />
                    </div>
                  ))
              ) : (
                <div className="text-gray-500">Loading treatment categories...</div>
              )}
              
              {!expandedSections.treatmentCategories && availableOptions.treatmentCategories.length > 5 && (
                <button 
                  onClick={() => toggleExpandedSection('treatmentCategories')}
                  className="text-amber-900 text-sm font-medium mt-2"
                >
                  ...more
                </button>
              )}
            </div>
          </div>

          {/* Efficacies */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-amber-900">Efficacies</h3>
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
                        className="w-5 h-5 rounded border-2 border-black text-amber-900 bg-white focus:ring-amber-900"
                        aria-label={`Select ${efficacy}`}
                      />
                    </div>
                  ))
              ) : (
                <div className="text-gray-500">Loading efficacies...</div>
              )}
              
              {!expandedSections.efficacies && availableOptions.efficacies.length > 5 && (
                <button 
                  onClick={() => toggleExpandedSection('efficacies')}
                  className="text-amber-900 text-sm font-medium mt-2"
                >
                  ...more
                </button>
              )}
            </div>
          </div>

          {/* Treatment Names */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-amber-900">Treatment Names</h3>
              <button 
                onClick={() => toggleExpandedSection('treatmentNames')}
                className="text-amber-900"
              >
                {expandedSections.treatmentNames ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
            
            <div className="space-y-2">
              {availableOptions.treatmentNames.length > 0 ? (
                availableOptions.treatmentNames
                  .slice(0, expandedSections.treatmentNames ? undefined : 5)
                  .map((name) => (
                    <div key={name} className="flex items-center justify-between">
                      <label htmlFor={`name-${name}`} className="flex-1 cursor-pointer">
                        {name}
                      </label>
                      <input
                        id={`name-${name}`}
                        type="checkbox"
                        checked={filters.treatmentNames.includes(name)}
                        onChange={() => toggleTreatmentOption(name, 'treatmentNames')}
                        className="w-5 h-5 rounded border-2 border-black text-amber-900 bg-white focus:ring-amber-900"
                        aria-label={`Select ${name}`}
                      />
                    </div>
                  ))
              ) : (
                <div className="text-gray-500">Loading treatment names...</div>
              )}
              
              {!expandedSections.treatmentNames && availableOptions.treatmentNames.length > 5 && (
                <button 
                  onClick={() => toggleExpandedSection('treatmentNames')}
                  className="text-amber-900 text-sm font-medium mt-2"
                >
                  ...more
                </button>
              )}
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
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;