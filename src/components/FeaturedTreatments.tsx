import React from 'react';
import Image from 'next/image';

const treatments = [
  {
    id: 1,
    title: '턱라인 주사',
    image: '/images/treatments/jaw.jpg',
    description: '턱라인이 말끔하게 생겼으면 좋겠어요...'
  },
  {
    id: 2,
    title: '주름관리 물광 보톡스',
    image: '/images/treatments/botox.jpg',
    description: '주름을 펴고, 탱탱하게!'
  },
  {
    id: 3,
    title: '피부결 관리 필링',
    image: '/images/treatments/peeling.jpg',
    description: '매끄럽고 깨끗한 피부결을...'
  },
  {
    id: 4,
    title: '피부보톡스 주사',
    image: '/images/treatments/skin-botox.jpg',
    description: '피부탄력을 위한 맞춤 솔루션'
  }
];

const FeaturedTreatments = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">어니네 필링</h2>
      <div className="grid grid-cols-2 gap-4">
        {treatments.map((treatment) => (
          <div key={treatment.id} className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <div className="relative h-32 bg-gray-200">
              {/* Placeholder for image - in production, replace with actual images */}
              <div className="absolute inset-0 bg-gray-200" />
            </div>
            <div className="p-3">
              <h3 className="font-medium text-sm">{treatment.title}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{treatment.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedTreatments;
