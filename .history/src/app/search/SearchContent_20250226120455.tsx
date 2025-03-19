'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import SearchFilters from '@/components/SearchFilters';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface Medspa {
  id: string;
  medspa_name: string;
  location: string;
  village: string;
  number: string;
  website: string;
  verified: string;
  best_treatment: string;
  google_star: number;
  google_review: number;
  yelp_star: number;
  yelp_review: number;
  free_consultation: string;
  good_review_short: string;
  good_review_deepdive1: string;
  good_review_deepdive2: string;
  good_review_deepdive3: string;
  bad_review_short: string;
  bad_review_deepdive: string;
  bad_review_deepdive1: string;
  bad_review_deepdive2: string;
  bad_review_deepdive3: string;
  recommended_practitioner1_name: string;
  recommended_practitioner1_reason: string;
  recommended_practitioner2_name: string;
  recommended_practitioner2_reason: string;
  recommended_practitioner3_name: string;
  recommended_practitioner3_reason: string;
  treatment1: string;
  price1: string;
  treatment2: string;
  price2: string;
  treatment3: string;
  price3: string;
  treatment4: string;
  price4: string;
  treatment5: string;
  price5: string;
  treatment6: string;
  price6: string;
  image_url1: string;
  image_url2: string; 
  image_url3: string;
}

interface SearchContentProps {
  initialMedspas: Medspa[];
  searchQuery: string;
  error?: Error;
}

export default function SearchContent({ initialMedspas, searchQuery, error }: SearchContentProps) {
  if (error) {
    throw error;
  }

  const [medspas] = useState<Medspa[]>(initialMedspas);
  
  // 이미지 슬라이더를 위한 상태 관리
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{[key: string]: number}>({});
  
  // 이미지 자동 슬라이드를 위한 타이머 설정
  useEffect(() => {
    const timer = setInterval(() => {
      const newIndexes = { ...currentImageIndexes };
      
      medspas.forEach(medspa => {
        if (!medspa.id) return;
        
        const currentIndex = currentImageIndexes[medspa.id] || 0;
        const imageCount = [medspa.image_url1, medspa.image_url2, medspa.image_url3].filter(Boolean).length;
        
        if (imageCount > 1) {
          newIndexes[medspa.id] = (currentIndex + 1) % imageCount;
        }
      });
      
      setCurrentImageIndexes(newIndexes);
    }, 5000); // 5초마다 이미지 변경
    
    return () => clearInterval(timer);
  }, [medspas, currentImageIndexes]);
  
  console.log('Initial Medspas:', initialMedspas); // 디버깅용 로그

  // Helper function to find treatment price based on search query
  const findTreatmentPrice = (medspa: Medspa, query: string) => {
    const treatments = [
      { treatment: medspa.treatment1, price: medspa.price1 },
      { treatment: medspa.treatment2, price: medspa.price2 },
      { treatment: medspa.treatment3, price: medspa.price3 },
      { treatment: medspa.treatment4, price: medspa.price4 },
      { treatment: medspa.treatment5, price: medspa.price5 },
      { treatment: medspa.treatment6, price: medspa.price6 },
    ];

    const matchingTreatment = treatments.find(t => 
      t.treatment?.toLowerCase().includes(query.toLowerCase())
    );

    console.log('Matching treatment:', matchingTreatment); // 디버깅용 로그
    return matchingTreatment?.price || '';
  };

  const router = useRouter();

  const handleMedspaClick = (medspaId: string) => {
    router.push(`/medspa/${medspaId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-40 bg-white border-b">
        <div className="container mx-auto px-4 pt-4 pb-1 flex items-center justify-between">
          {/* Back Button (왼쪽) */}
          <Link href="/" className="flex items-center text-black">
            <ChevronLeftIcon className="h-6 w-6" />
          </Link>

          {/* Search Bar (가운데) */}
          <div className="w-[480px] flex-1 mx-4">
            <SearchBar 
              initialValue={searchQuery} 
              onSearch={(value) => console.log(value)}
              className="mt-0"
            />
          </div>

          {/* Map 버튼 임시 제거 */}
          <div className="w-6" /> {/* 레이아웃 균형을 위한 빈 공간 */}
        </div>
        <div className="container mx-auto pb-2">
          <SearchFilters />
        </div>
      </div>

      {/* List View */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-col gap-4">
          {medspas.map((medspa) => {
            console.log('Processing medspa:', medspa); // 디버깅용 로그
            const imageUrls = [medspa.image_url1, medspa.image_url2, medspa.image_url3].filter(Boolean) as string[];
            const currentIndex = currentImageIndexes[medspa.id] || 0;
            
            return (
              <div 
                key={medspa.id}
                onClick={() => handleMedspaClick(medspa.id)}
                className="flex flex-col gap-4 bg-white border-b p-4 cursor-pointer hover:border-b"
              >
                <div className="flex gap-4">
                  <div className="flex flex-col w-32 gap-2">
                    {/* 이미지 슬라이더 구현 */}
                    <div className="relative w-32 h-32 overflow-hidden rounded-md">
                      {imageUrls.length > 0 ? (
                        <AnimatePresence>
                          <motion.div 
                            key={currentIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute w-full h-full"
                          >
                            <Image 
                              src={imageUrls[currentIndex]} 
                              alt={`${medspa.medspa_name} image ${currentIndex + 1}`}
                              width={128}
                              height={128}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center'
                              }}
                              priority={currentIndex === 0}
                            />
                          </motion.div>
                        </AnimatePresence>
                      ) : (
                        <div className="text-gray-400">No Image</div>
                      )}
                    </div>
                  </div>

                  {/* Right side - Content */}
                  <div className="flex-1 flex flex-col">
                    {/* Medspa name and village */}
                    <h3 className="cormorant text-xl font-semibold text-black">
                      {medspa.medspa_name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {medspa.village}
                    </p>
 
                    {/* Ratings */}
                    <div className="flex flex-col gap-2 mt-2">
                      {/* Google rating */}
                      <div className="flex items-center gap-1">
                        <Image src="/images/google-logo.png" alt="Google" width={24} height={24} />
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span className="text-xs text-black">{medspa.google_star || ''}</span>
                        <span className="text-xs text-gray-500">({medspa.google_review || 0})</span>
                      </div>

                      {/* Yelp rating - 데이터가 있을 때만 표시 */}
                      {medspa.yelp_star && medspa.yelp_review && (
                        <div className="flex items-center gap-1">
                          <Image src="/images/yelp-logo.png" alt="Yelp" width={24} height={24} />
                          <Star className="w-4 h-4 fill-current text-red-500" />
                          <span className="text-xs text-black">{medspa.yelp_star}</span>
                          <span className="text-xs text-gray-500">({medspa.yelp_review})</span>
                        </div>
                      )}
                      {/* Free consultation button */}
                      <div className="flex gap-2">
                        {medspa.free_consultation && medspa.free_consultation.trim() !== '' ? (
                          <button className="cormorant text-3xl bg-black text-white px-4 py-1 rounded-full text-sm">
                            {medspa.free_consultation}
                          </button>
                        ) : (
                          <button className="cormorant text-3xl bg-gray-200 text-gray-500 px-4 py-1 rounded-full text-sm">
                            Free Consultation
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Reviews - 이미지와 왼쪽 정렬 */}
                <div className="mt-2 space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="min-w-[24px] w-6 h-6 flex-shrink-0 flex items-center justify-center">
                      <Image 
                        src="/icons/heart.png" 
                        alt="Positive" 
                        width={24} 
                        height={24}
                        className="w-6 h-6 object-contain flex-shrink-0"
                      />
                    </div>
                    <span className="text-sm text-black">{medspa.good_review_short || ""}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="min-w-[24px] w-6 h-6 flex-shrink-0 flex items-center justify-center">
                      <Image 
                        src="/icons/breakheart.png" 
                        alt="Negative" 
                        width={24} 
                        height={24}
                        className="w-6 h-6 object-contain flex-shrink-0"
                      />
                    </div>
                    <span className="text-sm text-black">{medspa.bad_review_short || ""}</span>
                  </div>
                </div>
                {/* Treatment Price */}
                <div className="text-left">
                  <span className="cormorant text-lg font-bold text-black">
                    {findTreatmentPrice(medspa, searchQuery)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}