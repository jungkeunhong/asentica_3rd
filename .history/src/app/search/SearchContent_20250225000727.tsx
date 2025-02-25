'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon, PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/24/solid';
import { StarIcon, MapPinIcon } from '@heroicons/react/24/solid';

interface Medspa {
  id: string;
  medspa_name: string;
  location: string;
  village: string;
  number: string;
  website: string;
  verified: boolean;
  best_treatment: string;
  google_star: number;
  google_review: number;
  yelp_star: number;
  yelp_review: number;
  free_consultation: boolean;
  good_review_short: string;
  bad_review_short: string;
  treatment1: string;
  price1: number;
  treatment2: string;
  price2: number;
  treatment3: string;
  price3: number;
  treatment4: string;
  price4: number;
  treatment5: string;
  price5: number;
  treatment6: string;
  price6: number;
}

interface SearchContentProps {
  initialMedspas: Medspa[];
  searchQuery: string;
}

export default function SearchContent({ initialMedspas, searchQuery }: SearchContentProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleMedspaClick = (medspaId: string) => {
    router.push(`/medspa/${medspaId}`);
  };

  const filteredMedspas = initialMedspas.filter((medspa) =>
    medspa.medspa_name.toLowerCase().includes(query.toLowerCase()) ||
    medspa.location.toLowerCase().includes(query.toLowerCase()) ||
    medspa.best_treatment.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-4">
          {filteredMedspas.map((medspa) => {
            // 검색된 query가 포함된 treatment 가격 찾기
            const matchedTreatment = [
              { name: medspa.treatment1, price: medspa.price1 },
              { name: medspa.treatment2, price: medspa.price2 },
              { name: medspa.treatment3, price: medspa.price3 },
              { name: medspa.treatment4, price: medspa.price4 },
              { name: medspa.treatment5, price: medspa.price5 },
              { name: medspa.treatment6, price: medspa.price6 }
            ].find((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

            return (
              <div 
                key={medspa.id}
                onClick={() => handleMedspaClick(medspa.id)}
                className="p-4 flex items-start space-x-4 border-b cursor-pointer hover:bg-gray-50"
              >
                {/* 이미지 Placeholder */}
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0" />

                {/* Medspa 정보 */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900">{medspa.medspa_name}</h3>
                    <span className="text-gray-600">| {medspa.village}</span>

                    {/* Verified 체크 아이콘 */}
                    {medspa.verified && (
                      <CheckCircleIcon className="h-5 w-5 text-blue-500" />
                    )}
                  </div>

                  {/* Google & Yelp 별점 */}
                  <div className="flex items-center space-x-4 mt-1">
                    {/* Google */}
                    <div className="flex items-center space-x-1">
                      <Image src="/google-logo.png" alt="Google" width={14} height={14} />
                      <StarIcon className="h-4 w-4 text-yellow-400" />
                      <span className="text-gray-700 text-sm">{medspa.google_star} ⭐ ({medspa.google_review} reviews)</span>
                    </div>

                    {/* Yelp */}
                    <div className="flex items-center space-x-1">
                      <Image src="/yelp-logo.png" alt="Yelp" width={14} height={14} />
                      <StarIcon className="h-4 w-4 text-yellow-400" />
                      <span className="text-gray-700 text-sm">{medspa.yelp_star} ⭐ ({medspa.yelp_review} reviews)</span>
                    </div>
                  </div>

                  {/* 검색한 query에 해당하는 가격 표시 (가장 강조) */}
                  {matchedTreatment && (
                    <div className="text-xl font-bold text-right text-black mt-1">
                      ₩{matchedTreatment.price.toLocaleString()}
                    </div>
                  )}

                  {/* Good & Bad 리뷰 요약 */}
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 text-green-600">
                      <PlusCircleIcon className="h-5 w-5" />
                      <span className="text-sm">{medspa.good_review_short}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-red-600 mt-1">
                      <MinusCircleIcon className="h-5 w-5" />
                      <span className="text-sm">{medspa.bad_review_short}</span>
                    </div>
                  </div>

                  {/* 무료 상담 버튼 */}
                  {medspa.free_consultation && (
                    <div className="mt-3">
                      <button className="bg-blue-600 text-white text-sm py-2 px-4 rounded-full">
                        Free Consultation
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}