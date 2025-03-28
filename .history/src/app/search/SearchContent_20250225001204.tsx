'use client';

import { useState } from 'react';
import { Check, Star, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import SearchFilters from '@/components/SearchFilters';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { MapPinIcon } from '@heroicons/react/24/solid';

interface Medspa {
  id: string;
  medspa_name: string;
  location: string;
  village: string;
  number: number;
  website: string;
  verified: string; // 인증 여부 (true/false)
  best_treatment: string;
  google_star: number;
  google_review: number;
  yelp_star: number;
  yelp_review: number;
  free_consultation: string; // 무료 상담 여부
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
}

interface SearchContentProps {
  initialMedspas: Medspa[];
  searchQuery: string;
}

export default function SearchContent({ initialMedspas, searchQuery }: SearchContentProps) {
  const [medspas] = useState<Medspa[]>(initialMedspas);

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

    return matchingTreatment?.price || '';
  };

  const router = useRouter();

  const handleMedspaClick = (medspaId: string) => {
    router.push(`/medspa/${medspaId}`);
  };

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
              initialValue={searchQuery} 
              onSearch={(value) => console.log(value)}
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
        <div className="flex flex-col gap-6">
          {medspas.map((medspa) => (
            <div 
              key={medspa.id}
              onClick={() => handleMedspaClick(medspa.id)}
              className="flex gap-4 bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-50"
            >
              {/* Left side - Image with verification badge */}
              <div className="relative w-32 h-32">
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Image</span>
                </div>
                {medspa.verified === 'yes' && (
                  <div className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Right side - Content */}
              <div className="flex-1">
                {/* Medspa name and village */}
                <h3 className="text-xl font-semibold">
                  {medspa.medspa_name} | {medspa.village}
                </h3>

                {/* Ratings */}
                <div className="flex items-center gap-4 mt-2">
                  {/* Google rating */}
                  <div className="flex items-center gap-1">
                    <Image src="/images/google-logo.png" alt="Google" width={36} height={36} />
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{medspa.google_star}</span>
                    <span className="text-gray-500">({medspa.google_review})</span>
                  </div>

                  {/* Yelp rating */}
                  <div className="flex items-center gap-1">
                    <Image src="/images/yelp-logo.png" alt="Yelp" width={36} height={36} />
                    <Star className="w-4 h-4 text-red-500" />
                    <span>{medspa.yelp_star}</span>
                    <span className="text-gray-500">({medspa.yelp_review})</span>
                  </div>
                </div>

                {/* Treatment Price */}
                <div className="text-right mt-2">
                  <span className="text-2xl font-bold">
                    {findTreatmentPrice(medspa, searchQuery)}
                  </span>
                </div>

                {/* Reviews */}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{medspa.good_review_short}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Minus className="w-4 h-4 text-red-500" />
                    <span className="text-sm">{medspa.bad_review_short}</span>
                  </div>
                </div>

                {/* Free Consultation Button */}
                {medspa.free_consultation === 'yes' && (
                  <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">
                    Free Consultation Available
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}