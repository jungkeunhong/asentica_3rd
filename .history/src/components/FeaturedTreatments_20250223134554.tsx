import React from 'react';

const treatments = [
  {
    id: 1,
    title: 'Jawline Contouring Injections',
    image: 'https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EC%9D%98%EC%82%AC%EC%97%90%EA%B2%8C-%EC%B9%98%EC%95%84-%EA%B2%80%EC%82%AC%EB%A5%BC-%EB%B0%9B%EB%8A%94-%EC%97%AC%EC%84%B1-5mUpfUhwkvg',
    description: 'Achieve a sharp, defined jawline with our contouring solutions'
  },
  {
    id: 2,
    title: 'Wrinkle-Smoothing Botox',
    image: 'https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%ED%8E%9C%EA%B3%BC-%ED%9D%B0-%EC%86%9C%EC%82%AC%ED%83%95%EC%9D%84-%EB%93%A4%EA%B3%A0-%EC%97%AC%EC%9E%90-l9VjM-Pp7-M',
    description: 'Refresh your appearance with natural-looking results'
  },
  {
    id: 3,
    title: 'Skin Resurfacing Peel',
    image: 'https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EC%9D%98%EC%82%AC%EB%A1%9C%EB%B6%80%ED%84%B0-%EB%B3%B4%ED%8B%B8%EB%9D%BC%EC%A7%80-%EC%B9%98%EB%A3%8C%EB%A5%BC-%EB%B0%9B%EB%8A%94-%EC%97%AC%EC%84%B1-KBzs075982A
',
    description: 'Reveal smoother, more radiant skin'
  },
  {
    id: 4,
    title: 'Skin Revitalization Therapy',
    image: 'https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EC%A0%84%EC%9E%90-%EB%A7%88%EC%82%AC%EC%A7%80-%EC%96%BC%EA%B5%B4%EC%9D%84-%EA%B0%80%EC%A7%84-%EC%A0%8A%EC%9D%80-%EC%97%AC%EC%9E%90-fSJ1HrH_Vfk',
    description: 'Restore youthful elasticity and glow'
  }
];

const FeaturedTreatments = () => {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Premium Treatments</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Advanced Aesthetic Solutions
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Experience cutting-edge cosmetic enhancements
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {treatments.map((treatment) => (
              <div key={treatment.id} className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <div 
                  className="relative h-48 bg-gray-200 bg-cover bg-center"
                  style={{ backgroundImage: `url(${treatment.image})` }}
                >
                  {/* Image via Unsplash API */}
                </div>
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