'use client';

import React from 'react';
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

  const handleCategoryClick = (name: string) => {
    router.push(`/search?q=${encodeURIComponent(name.toLowerCase())}`);
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
          
          
          return (
            <div 
              key={category.id} 
              className="relative mb-4 inline-block w-full cursor-pointer"
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className={`relative ${heightClass} mb-2`}>
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover object-top rounded-md"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={category.id <= 4}
                />
              </div>
              <p className="text-gray-900 font-medium text-sm text-center">
                {category.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryGrid;