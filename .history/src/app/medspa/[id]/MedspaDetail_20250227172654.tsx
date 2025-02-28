'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon} from '@heroicons/react/24/outline';
import { Star, MapPin, Globe } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Medspa } from '@/types';

// Dynamically import the map component (client-side only)
const DynamicMap = dynamic(() => import('@/components/DynamicMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] rounded-lg bg-gray-200 flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  )
});

interface MedspaDetailProps {
  medspa: Medspa;
}

export default function MedspaDetail({ medspa }: MedspaDetailProps) {
  const [currentImageIndex] = useState(0);
  const images = [medspa.image_url1, medspa.image_url2, medspa.image_url3].filter(Boolean) as string[];
  
  // Treatments and prices
  const treatments = [
    { name: medspa.treatment1, price: medspa.price1 },
    { name: medspa.treatment2, price: medspa.price2 },
    { name: medspa.treatment3, price: medspa.price3 },
    { name: medspa.treatment4, price: medspa.price4 },
    { name: medspa.treatment5, price: medspa.price5 },
    { name: medspa.treatment6, price: medspa.price6 },
  ].filter(t => t.name && t.price);

  // Good and bad reviews
  const goodReviews = [
    medspa.good_review_deepdive1,
    medspa.good_review_deepdive2,
    medspa.good_review_deepdive3,
  ].filter(Boolean);
  
  const badReviews = [
    medspa.bad_review_deepdive1,
    medspa.bad_review_deepdive2,
    medspa.bad_review_deepdive3,
  ].filter(Boolean);

  // Recommended practitioners
  const recommendedPractitioners = [
    { name: medspa.recommended_practitioner1_name, reason: medspa.recommended_practitioner1_reason },
    { name: medspa.recommended_practitioner2_name, reason: medspa.recommended_practitioner2_reason },
    { name: medspa.recommended_practitioner3_name, reason: medspa.recommended_practitioner3_reason },
  ].filter(p => p.name && p.reason);

  return (
    <div className="max-w-4xl mx-auto pb-20 bg-white">
      {/* Back button */}
      <div className="p-4">
        <Link href="/search" className="flex items-center text-gray-600 hover:text-gray-900">
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
        </Link>
      </div>

      {/* Image Slider */}
      <div className="relative h-[400px] w-full overflow-hidden">
        {images.length > 0 ? (
          <>
            <Image
              src={images[currentImageIndex]}
              alt={`${medspa.medspa_name} - Image ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
            {images.length > 1 && (
              <>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {images.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-2 w-2 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
      </div>

      {/* MedSpa Name and Location */}
      <div className="px-4 pt-6">
        <h1 className="cormorant text-3xl font-semibold">{medspa.medspa_name}</h1>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <span className="mr-2">{medspa.village}</span>
          <span>•</span>
          <span className="ml-2">{medspa.location}</span>
        </div>
      </div>

      {/* Ratings */}
      <div className="px-4 mt-4 flex flex-wrap gap-4">
        {medspa.google_star && (
          <div className="flex items-center">
            <div className="flex items-center gap-1">
              <Image src="/images/google-logo.png" alt="Google" width={24} height={24} />
              <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
              <span className="font-medium">{medspa.google_star.toFixed(1)}</span>
            </div>
            <span className="text-sm text-gray-500 ml-1">
              ({medspa.google_review || 0})
            </span>
          </div>
        )}
        
        {medspa.yelp_star && (
          <div className="flex items-center">
            <div className="flex items-center gap-1">
              <Image src="/images/yelp-logo.png" alt="Yelp" width={24} height={24} />
              <Star className="h-4 w-4 fill-current text-red-500 mr-1" />
              <span className="font-medium">{medspa.yelp_star.toFixed(1)}</span>
            </div>
            <span className="text-sm text-gray-500 ml-1">
              ({medspa.yelp_review || 0})
            </span>
          </div>
        )}
      </div>

      {/* Highlights Section */}
      <div className="px-4 mt-8">
        <h2 className="text-xl font-semibold mb-4">Highlights</h2>
        
        {/* Good Reviews */}
        {goodReviews.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <div className="min-w-[24px] w-6 h-6 flex-shrink-0 flex items-center justify-center mr-2">
              <Image 
                src="/icons/thumbup.png" 
                alt="Positive" 
                width={24} 
                height={24}
                className="w-6 h-6 object-contain flex-shrink-0"
              />
            </div>
            <h3 className="text-lg font-medium text-green-700">Pros</h3>
          </div>
          <ul className="space-y-3">
            {goodReviews.map((review, index) => (
              <li key={`good-${index}`} className="flex">
                <span className="font-medium mr-2">{index + 1}.</span>
                <p className="text-sm text-gray-700">{review}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

        
        {/* Bad Reviews */}
        {badReviews.length > 0 && (
        <div>
          <div className="flex items-center mb-2">
            <div className="min-w-[24px] w-6 h-6 flex-shrink-0 flex items-center justify-center mr-2">
              <Image 
                src="/icons/thumbdown.png" 
                alt="Negative" 
                width={24} 
                height={24}
                className="w-6 h-6 object-contain flex-shrink-0"
              />
            </div>
            <h3 className="text-lg font-medium text-red-700">Cons</h3>
          </div>
          <ul className="space-y-3">
            {badReviews.map((review, index) => (
              <li key={`bad-${index}`} className="flex">
                <span className="font-medium mr-2">{index + 1}.</span>
                <p className="text-sm text-gray-700">{review}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

        {/* Recommended Practitioners - Bento Grid Style */}
        {/* Recommended Practitioners - Luxury Brown Bento Grid Style */}
        {recommendedPractitioners.length > 0 && (
          <div className="mt-12 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-1.5 h-8 bg-amber-700 rounded-full mr-3"></div>
              <h3 className="text-2xl font-bold text-gray-800">People&apos;s Choice</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedPractitioners.map((practitioner, index) => (
                <div 
                  key={`practitioner-${index}`}
                  className="rounded-xl p-5 relative overflow-hidden group"
                  style={{
                    background: "linear-gradient(135deg, #8B6B4D 0%, #6D4C3D 100%)",
                    boxShadow: "0 4px 20px rgba(107, 70, 49, 0.15)"
                  }}
                >
                  <div 
                    className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity duration-300"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                      backgroundSize: "cover"
                    }}
                  ></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center mb-3">
                      <h4 className="text-xl font-semibold text-amber-50">{practitioner.name}</h4>
                    </div>
                    
                    <p className="text-sm text-amber-100/90">{practitioner.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact Links */}
      <div className="px-4 mt-8 flex space-x-4">
        {medspa.website && (
          <Link 
            href={medspa.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <Globe className="h-5 w-5 mr-2" />
            <span>Website</span>
          </Link>
        )}
        
        {/* Instagram link removed since it's not available in the database */}
      </div>

      {/* Treatments and Prices */}
      {treatments.length > 0 && (
        <div className="px-4 mt-8">
          <h2 className="text-xl font-semibold mb-4">Prices</h2>
          <div className="space-y-3">
            {treatments.map((treatment, index) => (
              <div key={`treatment-${index}`} className="flex items-start py-2 border-b border-gray-200">
                <span className="text-gray-800 w-2/4">{treatment.name}</span>
                <span className="text-sm font-medium w-2/4 text-right">{treatment.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map */}
      {medspa.lat && medspa.lng && (
        <div className="px-4 mt-8">
          <h2 className="text-xl font-semibold mb-4">Location</h2>
          <div className="h-[300px] w-full rounded-lg overflow-hidden">
            <DynamicMap 
              medspas={[{
                ...medspa,
                coordinates: { lat: medspa.lat, lng: medspa.lng }
              }]} 
              onMedspaSelect={() => {}}
            />
          </div>
          <div className="mt-2 flex items-center text-gray-700">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{medspa.location}</span>
          </div>
        </div>
      )}
    </div>
  );
}
