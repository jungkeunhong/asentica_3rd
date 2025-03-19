'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import SearchFilters from '@/components/SearchFilters';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { StarIcon, MapPinIcon } from '@heroicons/react/24/solid';

interface Medspa {
  id: string;
  medspa_name: string;
  location: string;
  village: string;
  number: string; // 전화번호는 보통 string 처리 (국제번호 포함 가능)
  website: string;
  verified: boolean; // 인증 여부 (true/false)
  best_treatment: string;
  google_star: number;
  google_review: number;
  yelp_star: number;
  yelp_review: number;
  free_consultation: boolean; // 무료 상담 여부
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
  searchQuery?: string;
}

export default function SearchContent({ initialMedspas, searchQuery }: SearchContentProps) {
  const [query, setQuery] = useState(searchQuery || '');
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
      <div className="sticky top-0 z-40 bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Back Button (왼쪽) */}
          <Link href="/" className="flex items-center text-black">
            <ChevronLeftIcon className="h-6 w-6" />
          </Link>

          {/* Search Bar (가운데) */}
          <div className="w-[480px] flex-1 mx-4">
            <SearchBar 
              initialValue={query} 
              onSearch={(value) => setQuery(value)}
            />
          </div>

          {/* Map 버튼 임시 제거 */}
          <div className="w-6" /> {/* 레이아웃 균형을 위한 빈 공간 */}
        </div>
      </div>
      <div className="border-b">
        <div className="container mx-auto">
          <SearchFilters />
        </div>
      </div>

      {/* List View */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-4">
          {filteredMedspas.map((medspa) => (
            <div 
              key={medspa.id}
              onClick={() => handleMedspaClick(medspa.id)}
              className="p-4 flex items-start space-x-4 border-b cursor-pointer hover:bg-gray-50"
            >
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{medspa.medspa_name}</h3>
                <p className="text-sm text-gray-600">{medspa.location}</p>
                <p className="text-sm text-gray-600">Best Treatment: {medspa.best_treatment}</p>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <span className="ml-1 font-medium">{medspa.google_star} ⭐ ({medspa.google_review} reviews)</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-4 w-4" />
                    <span className="ml-1">{medspa.location}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <a href={medspa.website} target="_blank" className="text-blue-600 hover:underline">
                    Visit Website
                  </a>ㅍ
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}