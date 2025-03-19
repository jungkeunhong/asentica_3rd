'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

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

const SearchBar = ({ initialValue = '', className = '', onSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedTerm, setDebouncedTerm] = useState(initialValue);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Generate suggestions based on input
  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      // We're not showing suggestions, but we'll keep the search term logic
      // for future use if needed
    }
  }, [searchTerm]);

  // Trigger search when debounced term changes
  useEffect(() => {
    if (debouncedTerm !== initialValue) {
      if (onSearch) {
        onSearch(debouncedTerm);
      }
    }
  }, [debouncedTerm, onSearch, initialValue]);

  // Handle click outside to close suggestions
  useEffect(() => {
    // Keeping this empty useEffect for potential future use
    return () => {};
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm) {
      saveToRecentSearches(trimmedTerm);
      if (onSearch) {
        onSearch(trimmedTerm);
      } else {
        // Use window.location for a full page navigation to ensure it works on all devices
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
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % POPULAR_TREATMENTS.length);
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
          placeholder={`${POPULAR_TREATMENTS[placeholderIndex]}`}
          className="w-full h-10 pl-4 pr-12 bg-white rounded-3xl border border-gray-400 focus:outline-none focus:border-primary-500 text-base"
          style={{ fontSize: '16px', color: 'black' }}
          aria-label="Search treatments"
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