'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon} from '@heroicons/react/24/outline';
import { Star, MapPin, Globe } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Medspa } from '@/types';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
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

  // Handle drag end for image slider
  const handleDragEnd = (info: PanInfo) => {
    // If there's only one image or none, don't do anything
    if (images.length <= 1) return;
    
    // Swiped left (next image)
    if (info.offset.x < -50) {
      const newIndex = (currentImageIndex + 1) % images.length;
      setDirection(1);
      setCurrentImageIndex(newIndex);
    }
    // Swiped right (previous image)
    else if (info.offset.x > 50) {
      const newIndex = (currentImageIndex - 1 + images.length) % images.length;
      setDirection(-1);
      setCurrentImageIndex(newIndex);
    }
  };
  
  // Change image index directly (when clicking on dots)
  const changeImageIndex = (newIndex: number) => {
    const newDirection = newIndex > currentImageIndex ? 1 : -1;
    setDirection(newDirection);
    setCurrentImageIndex(newIndex);
  };

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
          <motion.div
            className="relative w-full h-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => handleDragEnd(info)}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentImageIndex}
                custom={direction}
                initial={{ 
                  opacity: 0,
                  x: direction > 0 ? 300 : -300 
                }}
                animate={{ 
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.5 }
                }}
                exit={{ 
                  opacity: 0,
                  x: direction > 0 ? -300 : 300,
                  transition: { duration: 0.5 }
                }}
                className="absolute w-full h-full"
              >
                <Image
                  src={images[currentImageIndex]}
                  alt={`${medspa.medspa_name} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Image indicators (dots) */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      changeImageIndex(idx);
                    }}
                    className={`w-3 h-3 rounded-full ${
                      idx === currentImageIndex 
                        ? 'bg-white' 
                        : 'bg-white/50'
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
            
            {/* Navigation arrows for larger screens */}
            {images.length > 1 && (
              <>
                <button 
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 z-10 hidden sm:block"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newIndex = (currentImageIndex - 1 + images.length) % images.length;
                    changeImageIndex(newIndex);
                  }}
                  aria-label="Previous image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 z-10 hidden sm:block"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newIndex = (currentImageIndex + 1) % images.length;
                    changeImageIndex(newIndex);
                  }}
                  aria-label="Next image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </motion.div>
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

        {/* Recommended Practitioners - Modern Skeuomorphic Style */}
        {recommendedPractitioners.length > 0 && (
          <div className="mt-12 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">People&apos;s Choice</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedPractitioners.map((practitioner, index) => (
                <div 
                  key={`practitioner-${index}`}
                  className="relative overflow-hidden group rounded-2xl transition-all duration-300 hover:shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #f8f6f4 0%, #f0ebe6 100%)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)"
                  }}
                >
                  {/* Large Number Background with Blur Effect */}
                  <div 
                    className="absolute -left-4 top-0 text-[180px] font-bold leading-none opacity-40 select-none"
                    style={{
                      color: "#e9e1d8",
                      textShadow: "1px 1px 2px rgba(255, 255, 255, 0.8)",
                      filter: "blur(1px)"
                    }}
                  >
                    {index + 1}
                  </div>
                  
                  {/* Content Container */}
                  <div className="relative z-10 p-6">
                    {/* Title */}
                    <h4 
                      className="text-xl font-semibold mb-3"
                      style={{
                        color: "#5a4738",
                      }}
                    >
                      {practitioner.name}
                    </h4>
                    
                    {/* Description */}
                    <div className="text-sm">
                      {practitioner.reason}
                    </div>
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
