'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const filters = [
  { id: 'distance', label: 'Distance' },
  { id: 'rating', label: 'Rating' },
  { id: 'price', label: 'Price' },
  { id: 'consultation', label: 'Free Consultation' },
];

const SearchFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(activeFilter === filterId ? null : filterId);
    // TODO: Implement actual filtering logic
  };

  return (
    <div className="w-full overflow-x-auto hide-scrollbar py-2">
      <div className="flex space-x-2 min-w-max px-4">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            className={`px-4 py-2 rounded-2xl border border-brown-600 text-sm transition-colors
              ${activeFilter === filter.id 
                ? 'bg-brown-600 text-white' 
                : 'bg-transparent text-brown-600'}`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchFilters;
