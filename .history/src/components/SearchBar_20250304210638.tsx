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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
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
      const term = searchTerm.toLowerCase();
      
      // Filter treatments that match the search term
      const matchingTreatments = POPULAR_TREATMENTS.filter(treatment => 
        treatment.toLowerCase().includes(term)
      );
      
      // Filter recent searches that match
      const matchingRecent = recentSearches.filter(search => 
        search.toLowerCase().includes(term) && 
        search.toLowerCase() !== term
      );
      
      // Combine and remove duplicates
      const combinedSuggestions = Array.from(
        new Set([...matchingTreatments, ...matchingRecent])
      ).slice(0, 6); // Limit to 6 suggestions
      
      setSuggestions(combinedSuggestions);
      setShowSuggestions(false); // Disable suggestions dropdown
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm, recentSearches]);

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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm) {
      saveToRecentSearches(trimmedTerm);
      if (onSearch) {
        onSearch(trimmedTerm);
      } else {
        router.push(`/search?q=${encodeURIComponent(trimmedTerm)}`);
      }
      setShowSuggestions(false);
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
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    saveToRecentSearches(suggestion);
    if (onSearch) {
      onSearch(suggestion);
    } else {
      router.push(`/search?q=${encodeURIComponent(suggestion)}`);
    }
    setShowSuggestions(false);
  };

  // Example search suggestions for placeholder
  const placeholderSuggestions = [
    "Botox", "Fillers", "Laser", "Facial", "Microneedling", "Skincare"
  ];
  
  // Rotate through suggestions
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholderSuggestions.length);
    }, 3000); // Change every 3 seconds
    
    return () => clearInterval(interval);
  }, [placeholderSuggestions.length]);

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <input
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => searchTerm.trim().length > 1 && setSuggestions.length > 0 && setShowSuggestions(true)}
          placeholder={`${placeholderSuggestions[placeholderIndex]}`}
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
      
      {/* Search suggestions dropdown */}
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg"
        >
          <ul className="py-1 overflow-auto max-h-60">
            {suggestions.map((suggestion, index) => (
              <li 
                key={index}
                className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 flex items-center"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <MagnifyingGlassIcon className="w-4 h-4 mr-2 text-gray-400" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

    </form>
  );
};

export default SearchBar;