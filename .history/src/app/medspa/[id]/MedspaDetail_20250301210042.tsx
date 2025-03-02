'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon} from '@heroicons/react/24/outline';
import { MapPin, Globe } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Medspa } from '@/types';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import ConsultationModal from '@/components/ConsultationModal';

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

  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  // 꽉 찬 별 SVG 컴포넌트
  const FilledStar = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      height="20px" 
      viewBox="0 -960 960 960" 
      width="20px" 
      {...props}
    >
      <path d="m243-144 237-141 237 141-63-266 210-179-276-23-108-252-108 251-276 24 210 179-63 266Z" />
    </svg>
  );

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
        <div className="flex items-center text-sm text-gray-600 mt-0.5">
          <span className="mr-2">{medspa.village}</span>
          <span>•</span>
          <span className="ml-2">{medspa.location}</span>
        </div>
      </div>

      {/* Ratings */}
      <div className="px-4 mt-4 flex flex-wrap gap-4">
        {/* Google rating */}
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="#000000" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#000000" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#000000" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#000000" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <FilledStar className="w-4 h-4 fill-current text-black" />
          <span className="text-xm text-black">{medspa.google_star || ''}</span>
          <span className="text-xm text-gray-500">({medspa.google_review || 0})</span>
        </div>

        {/* Yelp rating - 데이터가 있을 때만 표시 */}
        {medspa.yelp_star && medspa.yelp_review && (
          <div className="flex items-center gap-1">                              
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 228.097 228.097">
                <g>
                  <path fill="#000000" d="M173.22,68.06c8.204,6.784,30.709,25.392,27.042,38.455c-1.696,5.867-8.434,7.746-13.43,9.579 c-11.505,4.171-23.33,7.471-35.339,9.9c-9.717,1.971-30.48,6.279-26.63-10.909c1.512-6.646,6.875-12.284,11.184-17.28 c8.846-10.404,17.876-21.405,28.555-29.93c0.871-0.688,1.925-0.871,2.842-0.733C169.232,66.41,171.386,66.502,173.22,68.06z"/>
                  <path fill="#000000" d="M161.119,205.197c-7.196-5.821-12.284-14.942-16.684-22.917c-4.309-7.7-11.092-17.876-12.238-26.813 c-2.337-18.38,24.292-7.333,31.947-4.675c10.175,3.575,37.447,7.517,34.422,23.421c-2.521,12.971-18.151,28.784-31.213,30.801 c-0.137,0.046-0.321,0-0.504,0c-0.046,0.046-0.092,0.092-0.137,0.137c-0.367,0.183-0.779,0.413-1.192,0.596 C163.961,206.573,162.449,206.252,161.119,205.197z"/>
                  <path fill="#000000" d="M101.58,157.896c14.484-6.004,15.813,10.175,15.721,19.984c-0.137,11.688-0.504,23.421-1.375,35.063 c-0.321,4.721-0.137,10.405-4.629,13.384c-5.546,3.667-16.225,0.779-21.955-1.008c-0.183-0.092-0.367-0.183-0.55-0.229 c-12.054-2.108-26.767-7.654-28.188-18.792c-0.138-1.283,0.367-2.429,1.146-3.3c0.367-0.688,0.733-1.329,1.146-1.925 c1.788-2.475,3.85-4.675,5.913-6.921c3.483-5.179,7.242-10.175,11.229-14.988C85.813,172.197,92.917,161.471,101.58,157.896z"/>
                  <path fill="#000000" d="M103.689,107.661c-21.13-17.371-41.71-44.276-52.344-69.164 c-8.113-18.93,12.513-30.48,28.417-35.705c21.451-7.059,29.976-0.917,32.13,20.534c1.788,18.471,2.613,37.08,2.475,55.643 c-0.046,7.838,2.154,20.488-2.429,27.547c0.733,2.888-3.621,4.95-6.096,2.979c-0.367-0.275-0.733-0.642-1.146-0.963 C104.33,108.303,104.009,108.028,103.689,107.661z"/>
                  <path fill="#000000" d="M101.397,134.566c1.696,7.517-3.621,10.542-9.854,13.384c-11.092,4.996-22.734,8.984-34.422,12.284 c-6.784,1.879-17.188,6.371-23.742,1.375c-4.95-3.758-5.271-11.596-5.729-17.28c-1.008-12.696,0.917-42.993,18.517-44.276 c8.617-0.596,19.388,7.104,26.447,11.138c9.396,5.409,19.48,11.596,26.492,20.076C100.159,131.862,101.03,132.916,101.397,134.566z"/>
                </g>
              </svg>

            <FilledStar className="w-4 h-4 fill-current text-black" />
            <span className="text-xm text-black">{medspa.yelp_star}</span>
            <span className="text-xm text-gray-500">({medspa.yelp_review})</span>
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

      {/* Highlights Section */}
      <div className="px-4 mt-8">
        <h2 className="text-2xl font-semibold mb-4 font-sans">Highlights</h2>
        
        {/* Good Reviews */}
        {goodReviews.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <div className="min-w-[24px] w-6 h-6 flex-shrink-0 flex items-center justify-center mr-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                height="24px" 
                viewBox="0 -960 960 960" 
                width="24px" 
                fill="#6b7280" 
                stroke="#6b7280" 
                stroke-width="0.5" 
              >
                <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z"/>
              </svg>
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
            <div className="min-w-[24px] w-6 h-6 flex-shrink-0 flex items-center justify-center mr-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                height="24px" 
                viewBox="0 -960 960 960" 
                width="24px" 
                fill="#6b7280"
                stroke="#6b7280"
                strokeWidth="0.5"
              >
                <path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z"/>
              </svg>
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
            <h3 className="text-2xl font-bold text-gray-800 mb-6 font-sans">Best Practitioner</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedPractitioners.map((practitioner, index) => (
                <div 
                  key={`practitioner-${index}`}
                  className="relative overflow-hidden group rounded-2xl transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-[#f8f6f4] to-[#f0ebe6] shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
                >
                  {/* Large Number Background with Blur Effect */}
                  <div 
                    className="absolute -left-4 top-0 text-[180px] font-bold leading-none opacity-40 select-none text-[#e9e1d8] blur-[1px]"
                  >
                    {index + 1}
                  </div>
                  
                  {/* Content Container */}
                  <div className="relative z-10 p-6">
                    {/* Title */}
                    <h4 
                      className="text-xl font-semibold mb-3 text-[#5a4738]"
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

      {/* Get Consultation Button */}
      <div className="px-4 mt-8">
        <button 
          className="w-full py-3 px-4 bg-amber-800 hover:bg-amber-900 text-white rounded-lg font-medium transition duration-300 shadow-md hover:shadow-lg"
          onClick={() => {
            console.log('Clicked Get Consultation in MedspaDetail');
            setIsConsultationModalOpen(true);
          }}
        >
          Get Consultation
        </button>
      </div>

      {/* Map */}
      {medspa.lat && medspa.lng && (
        <div className="px-4 mt-8">
          <h2 className="text-xl font-semibold mb-4 font-sans">Location</h2>
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
      <ConsultationModal 
        isOpen={isConsultationModalOpen} 
        onClose={() => setIsConsultationModalOpen(false)} 
        medspa={medspa}
      />
    </div>
  );
}