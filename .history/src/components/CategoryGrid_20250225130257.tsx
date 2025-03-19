'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const categories = [
  { id: 1, name: 'Botox', image: 'botox.png'  },
  { id: 2, name: 'Filler', image: 'filler.png' },
  { id: 3, name: 'Microneedling', image: 'microneedling.png' },
  { id: 4, name: 'PRP', image: 'prp.png' },
  { id: 5, name: 'Cool Peeling', image: 'cool-peeling.png' },
  { id: 6, name: 'Emface', image: 'emface.png' },
  { id: 7, name: 'Facial', image: 'facial.png' },
  { id: 8, name: 'Hydrafacial', image: 'hydrafacial.png' },
  { id: 9, name: 'Lifting', image: 'lifting.png' },
  { id: 10, name: 'Hair Removal', image: 'hair-removal.png' },
  { id: 11, name: 'Chemical Peel', image: 'chemical-peel.png' },
  { id: 12, name: 'LED Therapy', image: 'led-therapy.png' },
];

const CategoryGrid = () => {
  const router = useRouter();

  const handleCategoryClick = (name: string) => {
    router.push(`/search?q=${encodeURIComponent(name.toLowerCase())}`);
  };

  return (
    <div className="py-4">
      <h2 className="cormorant text-xl font-extrabold mb-4 text-gray-900 pl-5">Just choose treatment,<br />We match the best medspa</h2>
      <div className="overflow-x-auto pb-2 hide-scrollbar">
        <div className="grid grid-rows-3 grid-cols-3 gap-y-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className="flex flex-col items-center w-24"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full hover:shadow-lg transition-colors">
                <Image
                  src={`/icons/${category.image}`}
                  alt={category.name}
                  width={32}
                  height={32}
                />
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
