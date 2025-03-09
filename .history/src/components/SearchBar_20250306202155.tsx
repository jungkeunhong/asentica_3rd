'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  initialValue?: string;
  className?: string;
  onSearch?: (value: string) => void;
}

// Popular treatments and procedures for search suggestions
const POPULAR_TREATMENTS = [
  "Botox", "Fillers", "Laser Hair Removal", "Facial", "Microneedling", 
  "Chemical Peel", "Hydrafacial", "Dermaplaning", "Lip Fillers", "Coolsculpting",
  "Kybella", "PRP", "Juvederm", "Restylane", "IPL", "RF Microneedling",
  "Morpheus8", "Fraxel", "Thermage", "Clear + Brilliant"
];

// Add popular medspa names for suggestions
const POPULAR_MEDSPAS = [
  "Aesthetic Center", "Beauty Med", "Skin Revival", "Glow Clinic",
  "Rejuvenate Spa", "Elite Aesthetics", "Pure Beauty", "Radiance MedSpa"
];

// Combine all suggestions
const ALL_SUGGESTIONS = [...POPULAR_TREATMENTS, ...POPULAR_MEDSPAS];

const SearchBar = ({ initialValue = '', className = '', onSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedTerm, setDebouncedTerm] = useState(initialValue);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
      } catch (e) {
        console.error('Failed to parse recent searches:', e);
      }
    }
  }, []);

  // Save search term to recent searches
  const saveToRecentSearches = (term: string) => {
    if (!term.trim()) return;
    
    const updatedSearches = [
      term,
      ...recentSearches.filter(s => s.toLowerCase() !== term.toLowerCase())
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // Debounce search term to avoid too many searches while typing
  // Remove or modify the debounce effect
  useEffect(() => {
    // We'll keep the debounce for setting the term, but not for triggering search
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);
  
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Modify the effect that triggers search
  useEffect(() => {
    // Only trigger search if initialValue changes (from URL)
    // This prevents auto-search while typing
    if (initialValue !== '' && initialValue !== debouncedTerm) {
      setDebouncedTerm(initialValue);
    }
  }, [initialValue, debouncedTerm]);
  
  // The handleSubmit function will now be the only way to trigger a search
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm) {
      saveToRecentSearches(trimmedTerm);
      if (onSearch) {
        onSearch(trimmedTerm);
      } else {
        // Use window.location for a full page navigation
        window.location.href = `/search?q=${encodeURIComponent(trimmedTerm)}`;
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  // Rotate through suggestions
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  
  // Update placeholder rotation to include all suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % ALL_SUGGESTIONS.length);
    }, 3000); // Change every 3 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <input
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder={`Search ${ALL_SUGGESTIONS[placeholderIndex]}...`}
          className="w-full h-10 pl-4 pr-12 bg-white rounded-3xl border border-gray-400 focus:outline-none focus:border-primary-500 text-base"
          style={{ fontSize: '16px', color: 'black' }}
          aria-label="Search treatments or medspas"
          autoComplete="off"
        />
        <div className="absolute right-0 flex items-center pr-3 space-x-2">
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-1 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
          {!searchTerm && (
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
    </form>
  );
};

export default SearchBar;