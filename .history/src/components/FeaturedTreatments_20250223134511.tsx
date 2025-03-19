import React from 'react';

const treatments = [
  {
    id: 1,
    title: 'Jawline Contouring Injections',
    image: 'https://images.unsplash.com/photo-1622306401885-4b07f2e8c6d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Achieve a sharp, defined jawline with our contouring solutions'
  },
  {
    id: 2,
    title: 'Wrinkle-Smoothing Botox',
    image: 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Refresh your appearance with natural-looking results'
  },
  {
    id: 3,
    title: 'Skin Resurfacing Peel',
    image: 'https://images.unsplash.com/photo-1575425187336-d5ec5ffb1c1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Reveal smoother, more radiant skin'
  },
  {
    id: 4,
    title: 'Skin Revitalization Therapy',
    image: 'https://images.unsplash.com/photo-1578489758854-f134a358f08b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
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