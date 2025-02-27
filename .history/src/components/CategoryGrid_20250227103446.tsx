'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// 카테고리 데이터 - 다양한 크기의 이미지를 위한 size 속성 추가
const categories = [
  { 
    id: 1, 
    name: 'Botox', 
    image: 'https://plus.unsplash.com/premium_photo-1661769358914-1d33c22bd7ba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Ym90b3h8ZW58MHx8MHx8fDA%3D',
    size: 'medium' 
  },
  { 
    id: 2, 
    name: 'Filler', 
    image: 'https://plus.unsplash.com/premium_photo-1719617673012-4b121052cc8f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGZpbGxlcnxlbnwwfHwwfHx8MA%3D%3D',
    size: 'small' 
  },
  { 
    id: 3, 
    name: 'Microneedling', 
    image: 'https://media.istockphoto.com/id/1731969249/ko/%EC%82%AC%EC%A7%84/%EB%85%B8%ED%99%94-%EB%B0%A9%EC%A7%80-%ED%81%B4%EB%A6%AC%EB%8B%89%EC%97%90%EC%84%9C-%EC%A3%BC%EB%A6%84%EA%B3%BC-%ED%9D%89%ED%84%B0%EB%A5%BC-%EC%A4%84%EC%9D%B4%EA%B8%B0-%EC%9C%84%ED%95%B4-%EC%84%B1%EC%9D%B8-%EB%82%A8%EC%84%B1%EA%B3%BC-%ED%95%A8%EA%BB%98-%EB%A0%88%EC%9D%B4%EC%A0%80-%ED%91%9C%EB%A9%B4-%EC%B2%98%EB%A6%AC-%EC%96%BC%EA%B5%B4-%EC%8A%A4%ED%82%A8-%EC%BC%80%EC%96%B4-%EC%B9%98%EB%A3%8C-%EA%B8%B0%EC%88%A0%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94-%ED%94%BC%EB%B6%80-%EC%9D%98%EC%82%AC.webp?a=1&b=1&s=612x612&w=0&k=20&c=019vxc5s4SAycLCyiZC078IFtJvhqseZyHse_A9stbU=',
    size: 'small' 
  },
  { 
    id: 4, 
    name: 'PRP', 
    image: 'https://charettecosmetics.com/wp-content/uploads/2024/02/AdobeStock_458058116-scaled.jpeg',
    size: 'small' 
  },
  { 
    id: 5, 
    name: 'Facial', 
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAtU1NB5Pxk2skTajkU6OssPSYsd3DK1UuNg&s',
    size: 'small' 
  },
  { 
    id: 6, 
    name: 'Lifting', 
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSRtviVmg0XF1zWzbLdRClpO43y28t1tSliQ&s',
    size: 'small' 
  },
  { 
    id: 7, 
    name: 'Hair Removal', 
    image: 'https://cdn-prod.medicalnewstoday.com/content/images/articles/322/322090/woman-having-laser-hair-removal-on-her-armpit.jpg',
    size: 'medium' 
  },
  { 
    id: 8, 
    name: 'LED Therapy', 
    image: 'https://sa1s3optim.patientpop.com/assets/images/provider/photos/2620529.jpg',
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
      <h2 className="cormorant text-3xl font-extrabold mb-4 text-gray-900 pl-5">Find the best medspa for you</h2>
      
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
              className={`relative rounded-md overflow-hidden mb-2 inline-block w-full ${heightClass `}
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
                  title="Toggle favorite"
                  aria-label="Toggle favorite"
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