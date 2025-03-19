'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const handleCategoryClick = (name: string) => {
    router.push(`/search?q=${encodeURIComponent(name.toLowerCase())}`);
  };

  return (
    <div className="py-4">
      <h2 className="cormorant text-xl font-semibold mb-4 text-gray-900 pl-5">Just choose treatment,<br />We match the best medspa</h2>
      <div className="overflow-x-auto pb-4 hide-scrollbar">
        <div className="grid grid-rows-2 grid-cols-8 gap-x-1 gap-y-2 pl-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className="flex flex-col items-center w-24"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-조ㅑ rounded-full hover:bg-gray-200 transition-colors">
                <span className="text-lg">{category.icon}</span>
              </div>
              <span className="text-[12px] text-gray-800 text-center leading-tight mt-2">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
