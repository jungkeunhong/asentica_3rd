'use client';

import React from 'react';

const filters = ['Price', 'Rating', 'Reviewed', 'Distance', 'Free consultation'];

export default function SearchFilters() {
  return (
    <div className="py-2 px-4">
      <div className="flex space-x-4 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter}
            className="px-1.5 py-1 border border-gray-400 rounded-full text-black hover:bg-gray-300 whitespace-nowrap"
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
