'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const SearchBar = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchText)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto px-4">
      <div className={`flex items-center bg-white rounded-full border ${isFocused ? 'border-gray-400' : 'border-gray-300'} overflow-hidden`}>
        <div className="pl-4 pr-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input
          type="search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Treatments, Doctors, Clinics"
          className="w-full py-3 focus:outline-none text-sm text-black"
          inputMode="search"
          enterKeyHint="search"
        />
        {searchText && (
          <button 
            type="button"
            onClick={() => setSearchText('')}
            className="pr-4 pl-2 hover:text-gray-700 text-gray-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;