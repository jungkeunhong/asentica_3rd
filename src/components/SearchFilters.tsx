'use client';

import React from 'react';

const SearchFilters = () => {
  return (
    <div className="px-4 py-2 flex gap-2 overflow-x-auto">
      <button className="px-4 py-2 bg-gray-100 rounded-full text-sm whitespace-nowrap">
        Price
      </button>
      <button className="px-4 py-2 bg-gray-100 rounded-full text-sm whitespace-nowrap">
        Rating
      </button>
      <button className="px-4 py-2 bg-gray-100 rounded-full text-sm whitespace-nowrap">
        Location
      </button>
      <button className="px-4 py-2 bg-gray-100 rounded-full text-sm whitespace-nowrap">
        Treatment Type
      </button>
      <button className="px-4 py-2 bg-gray-100 rounded-full text-sm whitespace-nowrap">
        Availability
      </button>
    </div>
  );
};

export default SearchFilters;
