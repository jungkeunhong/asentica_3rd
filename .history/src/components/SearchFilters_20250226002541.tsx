'use client';

import React from 'react';

const filters = ['Price', 'Rating', 'Location', 'Treatment Type', 'Availability'];

export default function SearchFilters() {
  return (
    <div className="py-1 px-4">
      <div className="flex space-x-4 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter}
            className="px-4 py-2 border rounded-full text-black hover:bg-gray-50 whitespace-nowrap"
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
