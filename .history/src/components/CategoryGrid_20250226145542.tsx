'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// 카테고리 데이터 - 다양한 크기의 이미지를 위한 size 속성 추가
const categories = [
  { 
    id: 1, 
    name: 'Botox', 
    image: 'https://placehold.co/600x400/png?text=Botox',
    size: 'medium' 
  },
  { 
    id: 2, 
    name: 'Filler', 
    image: 'https://placehold.co/600x800/png?text=Filler',
    size: 'small' 
  },
  { 
    id: 3, 
    name: 'Microneedling', 
    image: 'https://placehold.co/400x400/png?text=Microneedling',
    size: 'small' 
  },
  { 
    id: 4, 
    name: 'PRP', 
    image: 'https://placehold.co/600x400/png?text=PRP',
    size: 'medium' 
  },
  { 
    id: 5, 
    name: 'Cool Peeling', 
    image: 'https://placehold.co/400x600/png?text=Cool+Peeling',
    size: 'medium' 
  },
  { 
    id: 6, 
    name: 'Facial', 
    image: 'https://placehold.co/400x400/png?text=Facial',
    size: 'small' 
  },
  { 
    id: 7, 
    name: 'Lifting', 
    image: 'https://placehold.co/600x600/png?text=Lifting',
    size: 'small' 
  },
  { 
    id: 8, 
    name: 'Hair Removal', 
    image: 'https://placehold.co/400x400/png?text=Hair+Removal',
    size: 'small' 
  },
  { 
    id: 9, 
    name: 'Chemical Peel', 
    image: 'https://placehold.co/600x400/png?text=Chemical+Peel',
    size: 'medium' 
  },
  { 
    id: 10, 
    name: 'LED Therapy', 
    image: 'https://placehold.co/400x400/png?text=LED+Therapy',
    size: 'small' 
  },
];

const CategoryGrid = () => {
  const router = useRouter();
  const [favorites, setFavorites] = useState<number[]>([]);

  const handleCategoryClick = (name: string) => {
    router.push(`/search?q=${encodeURIComponent(name.toLowerCase())}`);
  };

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id) 
        : [...prev, id]
    );
  };

  return (
    <div className="py-2">
      <h2 className="cormorant text-3xl font-extrabold mb-4 text-gray-900 pl-5">Find the best medspa for you</h2>
      
      <div className="grid grid-cols-2 gap-1 px-2">
        {categories.map((category) => {
          // 이미지 크기에 따른 클래스 설정
          const sizeClasses = {
            small: "col-span-1 aspect-square",
            medium: "col-span-1 aspect-[4/3]",
            large: "col-span-2 aspect-[3/2]",
          }[category.size];
          
          const isFavorite = favorites.includes(category.id);
          
          return (
            <div 
              key={category.id} 
              className={`relative rounded-md overflow-hidden ${sizeClasses}`}
              onClick={() => handleCategoryClick(category.name)}
            >
              {/* 이미지 */}
              <div className="w-full h-full relative">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
                
                {/* 좋아요 버튼 */}
                <button 
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md z-10"
                  onClick={(e) => toggleFavorite(category.id, e)}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill={isFavorite ? "currentColor" : "none"} 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    className={`w-5 h-5 ${isFavorite ? 'text-red-500' : 'text-gray-600'}`}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                    />
                  </svg>
                </button>
                
                {/* 시술 이름 */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <span className="text-white font-medium text-sm">{category.name}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryGrid;