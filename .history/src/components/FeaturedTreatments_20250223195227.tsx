'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const treatments = [
  {
    id: 1,
    title: 'Botox',
    image: 'https://plus.unsplash.com/premium_photo-1661769358914-1d33c22bd7ba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Ym90b3h8ZW58MHx8MHx8fDA%3D',
    description: 'Natural wrinkle improvement and prevention...more',
    searchKeyword: 'botox'
  },
  {
    id: 2,
    title: 'Filler',
    image: 'https://plus.unsplash.com/premium_photo-1719617673012-4b121052cc8f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGZpbGxlcnxlbnwwfHwwfHx8MA%3D%3D',
    description: 'Natural volume and contour improvement...more',
    searchKeyword: 'filler'
  },
  {
    id: 3,
    title: 'Microneedling',
    image: 'https://media.istockphoto.com/id/1731969249/ko/%EC%82%AC%EC%A7%84/%EB%85%B8%ED%99%94-%EB%B0%A9%EC%A7%80-%ED%81%B4%EB%A6%AC%EB%8B%89%EC%97%90%EC%84%9C-%EC%A3%BC%EB%A6%84%EA%B3%BC-%ED%9D%89%ED%84%B0%EB%A5%BC-%EC%A4%84%EC%9D%B4%EA%B8%B0-%EC%9C%84%ED%95%B4-%EC%84%B1%EC%9D%B8-%EB%82%A8%EC%84%B1%EA%B3%BC-%ED%95%A8%EA%BB%98-%EB%A0%88%EC%9D%B4%EC%A0%80-%ED%91%9C%EB%A9%B4-%EC%B2%98%EB%A6%AC-%EC%96%BC%EA%B5%B4-%EC%8A%A4%ED%82%A8-%EC%BC%80%EC%96%B4-%EC%B9%98%EB%A3%8C-%EA%B8%B0%EC%88%A0%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94-%ED%94%BC%EB%B6%80-%EC%9D%98%EC%82%AC.webp?a=1&b=1&s=612x612&w=0&k=20&c=019vxc5s4SAycLCyiZC078IFtJvhqseZyHse_A9stbU=',
    description: 'Boost collagen, smooth texture, and reduce scars...more',
    searchKeyword: 'microneedling'
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