'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  initialValue?: string;
  className?: string;
  onSearch?: (value: string) => void;
}

const SearchBar = ({ initialValue = '', className = '', onSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm) {
      if (onSearch) {
        onSearch(trimmedTerm);
      } else {
        router.push(`/search?q=${encodeURIComponent(trimmedTerm)}`);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Treatments, clinics, or doctors"
          className="w-full h-10 pl-4 pr-12 bg-white rounded-3xl border border-gray-400 focus:outline-none focus:border-primary-500 text-base"
          style={{ fontSize: '16px', color: 'black' }}
        />
        <div className="absolute right-0 flex items-center pr-3 space-x-2">
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-1 text-gray-400 hover:text-gray-600"
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