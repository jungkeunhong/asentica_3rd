'use client';

import { useState, useEffect, useRef } from 'react';
import { searchTreatments } from '@/utils/supabase/client'; // 🔹 Supabase 검색 함수 추가
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
  const [suggestions, setSuggestions] = useState<string[]>([]);
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
      ...recentSearches.filter((s) => s.toLowerCase() !== term.toLowerCase()),
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // 🔹 Fetch search suggestions from Supabase using FTS
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      const results = await searchTreatments(searchTerm);
      setSuggestions(results.map((item) => item.treatment_name)); // Extract names from results
    };

    const debounceTimeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  // 🔹 Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm) {
      saveToRecentSearches(trimmedTerm);
      if (onSearch) {
        onSearch(trimmedTerm);
      } else {
        window.location.href = `/search?q=${encodeURIComponent(trimmedTerm)}`;
      }
    }
  };

  // 🔹 Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 🔹 Clear search input
  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    if (onSearch) {
      onSearch('');
    }
  };

  // 🔹 Handle clicking on a suggestion
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    saveToRecentSearches(suggestion);
    if (onSearch) {
      onSearch(suggestion);
    } else {
      window.location.href = `/search?q=${encodeURIComponent(suggestion)}`;
    }
  };

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
          placeholder="Search treatments or medspas..."
          className="w-full h-10 pl-4 pr-12 bg-white rounded-3xl border border-gray-400 focus:outline-none focus:border-primary-500 text-base"
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
          {!searchTerm && <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
        </div>
      </div>

      {/* 🔹 Show search suggestions */}
      {suggestions.length > 0 && (
        <ul className="absolute left-0 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-md z-50">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default SearchBar;