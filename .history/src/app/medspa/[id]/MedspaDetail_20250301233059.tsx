'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, Phone } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Medspa } from '@/types';
import { motion, PanInfo } from 'framer-motion';
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
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedMedspa, setSelectedMedspa] = useState<Medspa | null>(medspa);
  
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
    { review: medspa.good_review_deepdive1, explanation: medspa.good_review_deepdive1_explanation },
    { review: medspa.good_review_deepdive2, explanation: medspa.good_review_deepdive2_explanation },
    { review: medspa.good_review_deepdive3, explanation: medspa.good_review_deepdive3_explanation },
  ].filter(r => r.review);
  
  const badReviews = [
    { review: medspa.bad_review_deepdive1, explanation: medspa.bad_review_deepdive1_explanation },
    { review: medspa.bad_review_deepdive2, explanation: medspa.bad_review_deepdive2_explanation },
    { review: medspa.bad_review_deepdive3, explanation: medspa.bad_review_deepdive3_explanation },
  ].filter(r => r.review);

  // Recommended practitioners
  const recommendedPractitioners = [
    { name: medspa.recommended_practitioner1_name, reason: medspa.recommended_practitioner1_reason },
    { name: medspa.recommended_practitioner2_name, reason: medspa.recommended_practitioner2_reason },
    { name: medspa.recommended_practitioner3_name, reason: medspa.recommended_practitioner3_reason },
  ].filter(p => p.name && p.reason);

  // Handle drag end for image slider
  const handleDragEnd = (info: PanInfo) => {
    const threshold = 100; // Drag threshold
    const draggedDistance = info.offset.x;
    
    // Change image based on drag direction and distance
    if (Math.abs(draggedDistance) > threshold) {
      if (draggedDistance < 0 && currentImageIndex < images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      } else if (draggedDistance > 0 && currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      }
    }
  };
  
  // Change image index directly (when clicking on dots)
  const changeImageIndex = (newIndex: number) => {
    setCurrentImageIndex(newIndex);
  };

  // Function to handle phone calls
  const handleCall = (phoneNumber: string | undefined, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (phoneNumber) {
      // Format phone number if needed
      const formattedNumber = phoneNumber.replace(/\D/g, '');
      window.location.href = `tel:${formattedNumber}`;
    } else {
      console.log('No phone number available');
    }
  };

  // Navigation arrow components
  const PrevArrow = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="#000000" d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/>
    </svg>
  );

  const NextArrow = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="#000000" d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/>
    </svg>
  );

  // FilledStar 컴포넌트 정의
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
      <div className="px-4 py-3 flex items-center">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="#000000" d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/>
          </svg>
          <span>Back</span>
        </button>
      </div>

      {/* Image Slider */}
      <div className="relative h-[400px] w-full overflow-hidden">
        {images.length > 0 ? (
          <motion.div
            className="relative w-full h-full"
            drag="x"
            dragConstraints={{ left: -400 * (images.length - 1), right: 0 }}
            dragElastic={0.2}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
            style={{ touchAction: "none" }}
            onDragEnd={(_, info) => handleDragEnd(info)}
            animate={{ x: -currentImageIndex * 400 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {images.map((url, index) => (
              <div key={index} className="absolute w-full h-full" style={{ left: `${index * 100}%` }}>
                <Image
                  src={url}
                  alt={`${medspa.medspa_name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
            
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
                  <PrevArrow />
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
                  <NextArrow />
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

        {/* Ratings and Contact Links */}
        <div className="px-4 mt-4 flex items-center justify-between">
          {/* Ratings wrapper */}
          <div className="flex flex-wrap gap-4 items-center">
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
          
          {/* Website Link - 오른쪽 정렬 */}
          {medspa.website && (
            <div className="flex-shrink-0 mr-1">
              <Link 
                href={medspa.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-black hover:text-blue-800"
              >
                <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="24" height="24"><g clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="#666"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
              </Link>
            </div>
          )}
        </div>

      {/* Best Treatments Section */}
      {(medspa.best_treatment1 || medspa.best_treatment2 || medspa.best_treatment3) && (
        <div className="px-4 mt-2 mb-2">
          <div className="flex flex-wrap gap-2">
            {[medspa.best_treatment1, medspa.best_treatment2, medspa.best_treatment3]
              .filter(Boolean)
              .map((treatment, index) => (
                <div 
                  key={`treatment-${index}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-white-50 to-white-100 border border-amber-800 shadow-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-900 mr-2"></div>
                  <span className="text-sm font-medium text-amber-900">{treatment}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Highlights Section */}
      <div className="px-4 mt-8">
        <h2 className="text-2xl font-base mb-4 font-sans">Highlights</h2>
        
        {/* Good Reviews */}
        {goodReviews.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-2 mr-1">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="20px" 
              viewBox="0 -960 960 960" 
              width="20px" 
              fill="#6b7280" 
              stroke="#6b7280" 
            >
              <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z"/>
            </svg>
            <h3 className="text-lg font-medium text-black font-sans">Pros</h3>
          </div>
          
          <div className="flex overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth">
            <div className="flex gap-4 px-1">
              {goodReviews.map((review, index) => (
                <div 
                  key={`good-${index}`} 
                  className="relative overflow-hidden group rounded-2xl transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-[#f8fff8] to-[#eaf6ea] shadow-[0_10px_30px_rgba(0,0,0,0.05)] min-w-[280px] w-[280px] flex-shrink-0 snap-start"
                >
                  {/* Large Number Background with Blur Effect */}
                  <div 
                    className="absolute -left-4 top-0 text-[180px] font-bold leading-none opacity-40 select-none text-[#e9f6e9] blur-[1px]"
                  >
                    {index + 1}
                  </div>
                  
                  {/* Content Container */}
                  <div className="relative z-10 p-6">
                    {/* Title */}
                    <h4 
                      className="text-xl font-semibold mb-3 text-[#3c6d3c]"
                    >
                      {review.review}
                    </h4>
                    
                    {/* Description */}
                    <div className="text-sm">
                      {review.explanation || ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
        )}

        
        {/* Bad Reviews */}
        {badReviews.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <<div className="min-w-[20px] w-5 h-5 flex-shrink-0 flex items-center justify-center">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            height="20px" 
                            viewBox="0 -960 960 960" 
                            width="20px" 
                            fill="#6b7280"
                            stroke="#6b7280"
                          >
                            <path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z"/>
                          </svg>
                        </div>
            <h3 className="text-lg font-medium text-black font-sans">Cons</h3>
          </div>
          
          <div className="flex overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth">
            <div className="flex gap-4 px-1">
              {badReviews.map((review, index) => (
                <div 
                  key={`bad-${index}`} 
                  className="relative overflow-hidden group rounded-2xl transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-[#fff8f8] to-[#f6eaea] shadow-[0_10px_30px_rgba(0,0,0,0.05)] min-w-[280px] w-[280px] flex-shrink-0 snap-start"
                >
                  {/* Large Number Background with Blur Effect */}
                  <div 
                    className="absolute -left-4 top-0 text-[180px] font-bold leading-none opacity-40 select-none text-[#f6eaea] blur-[1px]"
                  >
                    {index + 1}
                  </div>
                  
                  {/* Content Container */}
                  <div className="relative z-10 p-6">
                    {/* Title */}
                    <h4 
                      className="text-xl font-semibold mb-3 text-[#6d3c3c]"
                    >
                      {review.review}
                    </h4>
                    
                    {/* Description */}
                    <div className="text-sm">
                      {review.explanation || ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* Recommended Practitioners - Modern Skeuomorphic Style */}
        {recommendedPractitioners.length > 0 && (
          <div className="mt-12 mb-8">
            <h3 className="text-2xl font-base text-gray-800 mb-6 font-sans">Best Practitioner</h3>
            
            <div className="flex overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide scroll-smooth">
              <div className="flex gap-4 px-4">
                {recommendedPractitioners.map((practitioner, index) => (
                  <div 
                    key={`practitioner-${index}`}
                    className="relative overflow-hidden group rounded-2xl transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-[#f8f6f4] to-[#f0ebe6] shadow-[0_10px_30px_rgba(0,0,0,0.05)] min-w-[280px] w-[280px] flex-shrink-0 snap-start"
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
          </div>
        )}


      </div>

      {/* Treatments and Prices */}
      {treatments.length > 0 && (
        <div className="px-4 mt-8">
          <h2 className="text-2xl font-base mb-4 font-sans">Prices</h2>
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

      {/* Call and Consultation CTA Buttons */}
      <div className="flex flex-row px-4 mt-8 gap-3">
        <button 
          onClick={(e) => handleCall(medspa.number, e)}
          className="btn bg-amber-900 hover:bg-amber-950 text-white border-none hover:shadow-lg transform flex items-center justify-center gap-2 w-12"
          title="call"
          aria-label="call"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        </button>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Clicked Get Consultation for:', medspa.medspa_name);
            setSelectedMedspa(medspa);
            setIsConsultationModalOpen(true);
          }}
          className="btn bg-white hover:bg-amber-800 border border-amber-900 text-amber-900 hover:text-white hover:border-amber-800 hover:shadow-lg transform flex items-center justify-center gap-2 flex-1"
        >
          <span>Get Consultation</span>
        </button>
      </div>

      {/* Map */}
      {medspa.lat && medspa.lng && (
        <div className="px-4 mt-8">
          <h2 className="text-xl font-base mb-4 font-sans">Location</h2>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="#000000" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>{medspa.location}</span>
          </div>
        </div>
      )}
      <ConsultationModal 
        isOpen={isConsultationModalOpen} 
        onClose={() => setIsConsultationModalOpen(false)} 
        medspa={selectedMedspa}
      />
    </div>
  );
}