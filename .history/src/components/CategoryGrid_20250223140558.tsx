'use client';

import React from 'react';
import Link from 'next/link';

const categories = [
  { id: 1, name: 'Botox', icon: '💉' },
  { id: 2, name: 'Filler', icon: '✨' },
  { id: 3, name: 'Microneedling', icon: '🔬' },
  { id: 4, name: 'PRP', icon: '🩸' },
  { id: 5, name: 'Cool Peeling', icon: '❄️' },
  { id: 6, name: 'Emface', icon: '⚡' },
  { id: 7, name: 'Facial', icon: '🧖‍♀️' },
  { id: 8, name: 'Hydrafacial', icon: '💧' },
  { id: 9, name: 'Lift', icon: '⬆️' },
  { id: 10, name: 'Hair Removal', icon: '✂️' },
  { id: 11, name: 'Chemical Peel', icon: '🧪' },
  { id: 12, name: 'LED Therapy', icon: '💡' },
];

const CategoryGrid = () => {
  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">Select Treatment</h2>
      <div className="relative">
        <div 
          className="flex flex-wrap gap-2 overflow-x-auto pb-2 hide-scrollbar"
          style={{
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            display: 'grid',
            gridTemplateRows: 'repeat(2, 1fr)',
            gridAutoFlow: 'column',
            gridAutoColumns: 'min-content',
            overflowY: 'hidden',
            gap: '.5rem'
          }}
        >
          {categories.map((category) => (
            <Link href={`/category/${category.id}`} key={category.id}>
              <div className="flex flex-col items-center space-y-1 w-24 scroll-snap-align-start px-1">
                <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <span className="text-xl">{category.icon}</span>
                </div>
                <span className="text-xs text-gray-700 text-center leading-tight">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
