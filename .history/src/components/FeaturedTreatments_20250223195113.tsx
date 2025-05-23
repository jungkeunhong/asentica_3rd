'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const treatments = [
  {
    id: 1,
    title: 'Botox',
    image: 'https://images.unsplash.com/ko/%EC%82%AC%EC%A7%84/%EC%9D%98%EC%82%AC%EC%97%90%EA%B2%8E-%EC%B9%98%EC%95%84-%EA%B2%80%EC%82%AC%EB%A5%BC-%EB%B0%9B%EB%8A%94-%EC%97%AC%EC%84%B1-5mUpfUhwkvg',
    description: 'Natural wrinkle improvement and prevention...more',
    searchKeyword: 'botox'
  },
  {
    id: 2,
    title: 'Filler',
    image: 'https://images.unsplash.com/photo-1598300188904-6287d52746ad?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Natural volume and contour improvement...more',
    searchKeyword: 'filler'
  },
  {
    id: 3,
    title: 'Skin Resurfacing Peel',
    image: 'https://images.unsplash.com/photo-1598300188904-6287d52746ad?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Reveal smoother, more radiant skin',
    searchKeyword: 'skin peel'
  },
];

const FeaturedTreatments = () => {
  const router = useRouter();

  const handleTreatmentClick = (searchKeyword: string) => {
    router.push(`/search?q=${encodeURIComponent(searchKeyword)}`);
  };

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-left">    
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Learn more
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {treatments.map((treatment) => (
              <div 
                key={treatment.id} 
                className="rounded-lg overflow-hidden border border-gray-200 cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={() => handleTreatmentClick(treatment.searchKeyword)}
              >
                <Image
                  src={treatment.image}
                  alt={treatment.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{treatment.title}</h3>
                  <p className="mt-2 text-base text-gray-600">{treatment.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedTreatments;