'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// 카테고리 데이터 - 다양한 크기의 이미지를 위한 size 속성 추가
const categories = [
  { 
    id: 1, 
    name: 'Botox', 
    image: '/images/main_8.png',
    size: 'medium' 
  },
  { 
    id: 2, 
    name: 'Filler', 
    image: '/images/main_6.png',
    size: 'small' 
  },
  { 
    id: 3, 
    name: 'Microneedling', 
    image: '/images/main_2.png',
    size: 'small' 
  },
  { 
    id: 4, 
    name: 'PRP', 
    image: '/images/main_5.png',
    size: 'small' 
  },
  { 
    id: 5, 
    name: 'Facial', 
    image: '/images/main_3.png',
    size: 'small' 
  },
  { 
    id: 6, 
    name: 'Lift', 
    image: '/images/main_4.png',
    size: 'small' 
  },
  { 
    id: 7, 
    name: 'Hair Removal', 
    image: '/images/main_7.png',
    size: 'medium' 
  },
  { 
    id: 8, 
    name: 'LED Therapy', 
    image: '/images/main_1.png',
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
    <div className="py-6">
      <h2 className="cormorant text-3xl font-base mb-4 mt-8 text-gray-900 text-center tracking-tight">Choose your treatment</h2>
      
      <div className="columns-2 gap-2 px-2">
        {categories.map((category) => {
          // 이미지 크기에 따른 클래스 설정
          const heightClass = {
            small: "h-40",
            medium: "h-52",
            large: "h-64",
          }[category.size];
          
          const isFavorite = favorites.includes(category.id);
          
          return (
            <div 
              key={category.id} 
              className={`relative rounded-md overflow-hidden mb-2 inline-block w-full ${heightClass} transition-all duration-300 ease-in-out hover:brightness-90 cursor-pointer`}
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
                  className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center z-10"
                  onClick={(e) => toggleFavorite(category.id, e)}
                  title="Toggle favorite"
                  aria-label="Toggle favorite"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill={isFavorite ? "currentColor" : "none"} 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    className={`w-5 h-5 ${isFavorite ? 'text-red-500' : 'text-white'}`}
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
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-800/50 via-gray-700/30 to-transparent p-3">
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