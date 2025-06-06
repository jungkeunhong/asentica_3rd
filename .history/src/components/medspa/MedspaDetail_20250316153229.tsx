'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, Phone, ChevronRightIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Medspa } from '@/types';
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
  const [selectedMedspa, setSelectedMedspa] = useState<Medspa | null>(null);

  // Create an array of available images
  const imageArray = [medspa.image_url1, medspa.image_url2, medspa.image_url3].filter(Boolean) as string[];

  // Add Intersection Observer to update current image index when scrolling
  useEffect(() => {
    const container = document.querySelector('.snap-x');
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Array.from(container.children).indexOf(entry.target);
            setCurrentImageIndex(index);
          }
        });
      },
      {
        root: container,
        threshold: 0.5
      }
    );

    Array.from(container.children).forEach(child => {
      observer.observe(child);
    });

    return () => observer.disconnect();
  }, []);

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

  // Handle phone call
  const handleCall = (phoneNumber: string | undefined, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to medspa detail
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      alert('Phone number not available');
    }
  };

  // Add map selection function
  const handleOpenMap = (address: string, businessName: string) => {
    if (!address) return;
    
    // Create URLs for both map services with business name and address
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${businessName} ${address}`)}`;
    const appleMapsUrl = `https://maps.apple.com/?q=${encodeURIComponent(`${businessName} ${address}`)}`;
    
    // Create a native-looking map selection modal
    const mapSelectionModal = document.createElement('div');
    mapSelectionModal.className = 'fixed inset-0 bg-black/40 z-50 flex items-end justify-center pb-8';
    mapSelectionModal.innerHTML = `
      <div class="bg-white rounded-xl w-full max-w-sm mx-4 overflow-hidden">
        <div class="p-4 text-center border-b border-gray-200">
          <h3 class="text-lg font-medium">Open Location</h3>
        </div>
        <button id="apple-maps-btn" class="w-full p-4 text-center text-blue-500 border-b border-gray-200 font-medium">
          Open in Maps
        </button>
        <button id="google-maps-btn" class="w-full p-4 text-center text-blue-500 border-b border-gray-200 font-medium">
          Open in Google Maps
        </button>
        <button id="cancel-map-btn" class="w-full p-4 text-center font-medium">
          Cancel
        </button>
      </div>
    `;
    
    document.body.appendChild(mapSelectionModal);
    
    // Add event listeners
    document.getElementById('apple-maps-btn')?.addEventListener('click', () => {
      window.open(appleMapsUrl, '_blank');
      document.body.removeChild(mapSelectionModal);
    });
    
    document.getElementById('google-maps-btn')?.addEventListener('click', () => {
      window.open(googleMapsUrl, '_blank');
      document.body.removeChild(mapSelectionModal);
    });
    
    document.getElementById('cancel-map-btn')?.addEventListener('click', () => {
      document.body.removeChild(mapSelectionModal);
    });
    
    // Close when clicking outside the modal
    mapSelectionModal.addEventListener('click', (e) => {
      if (e.target === mapSelectionModal) {
        document.body.removeChild(mapSelectionModal);
      }
    });
  };

  // FilledStar component definition
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
          aria-label="Go back"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Image Slider */}
      <div className="relative h-[400px] w-full">
        <div className="w-full h-full overflow-x-hidden">
          <div 
            className="flex w-full h-full snap-x snap-mandatory overflow-x-auto scrollbar-hide"
            style={{ scrollBehavior: 'smooth' }}
          >
            {imageArray.map((url, index) => (
              <div 
                key={index}
                className="w-full h-full flex-shrink-0 flex-grow-0 snap-center"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={url}
                    alt={`${medspa.medspa_name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="100vw"
                    quality={90}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 인디케이터 (dots) */}
          {imageArray.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {imageArray.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const container = document.querySelector('.snap-x');
                    if (container) {
                      container.scrollTo({
                        left: idx * container.clientWidth,
                        behavior: 'smooth'
                      });
                    }
                    setCurrentImageIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentImageIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* 네비게이션 화살표 */}
          {imageArray.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <button 
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white z-10"
                  onClick={() => {
                    const container = document.querySelector('.snap-x');
                    if (container) {
                      container.scrollTo({
                        left: (currentImageIndex - 1) * container.clientWidth,
                        behavior: 'smooth'
                      });
                    }
                    setCurrentImageIndex(prev => prev - 1);
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
              )}
              
              {currentImageIndex < imageArray.length - 1 && (
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white z-10"
                  onClick={() => {
                    const container = document.querySelector('.snap-x');
                    if (container) {
                      container.scrollTo({
                        left: (currentImageIndex + 1) * container.clientWidth,
                        behavior: 'smooth'
                      });
                    }
                    setCurrentImageIndex(prev => prev + 1);
                  }}
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-6">
        {/* Medspa Name and Location */}
        <h1 className="text-2xl font-bold text-gray-900">{medspa.medspa_name}</h1>
        
        <div className="flex items-center mt-2 text-gray-600">
          <button 
            onClick={() => handleOpenMap(medspa.address || '', medspa.medspa_name)}
            className="flex items-center text-gray-600 hover:text-amber-900"
          >
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{medspa.address || medspa.village}</span>
          </button>
        </div>

        {/* Ratings */}
        <div className="flex flex-wrap gap-4 mt-4">
          {medspa.google_star && (
            <div className="flex items-center">
              <div className="flex items-center mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#000000" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#000000" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#000000" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#000000" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <FilledStar className="fill-yellow-400" />
                <span className="ml-1 text-sm font-medium">{medspa.google_star}</span>
              </div>
              <a 
                href={medspa.google_map_link || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-amber-900"
              >
                ({medspa.google_review || 0})
              </a>
            </div>
          )}
          
          {medspa.yelp_star && (
            <div className="flex items-center">
              <div className="flex items-center mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 228.097 228.097">
                  <g>
                    <path fill="#000000" d="M173.22,68.06c8.204,6.784,30.709,25.392,27.042,38.455c-1.696,5.867-8.434,7.746-13.43,9.579 c-11.505,4.171-23.33,7.471-35.339,9.9c-9.717,1.971-30.48,6.279-26.63-10.909c1.512-6.646,6.875-12.284,11.184-17.28 c8.846-10.404,17.876-21.405,28.555-29.93c0.871-0.688,1.925-0.871,2.842-0.733C169.232,66.41,171.386,66.502,173.22,68.06z"/>
                    <path fill="#000000" d="M161.119,205.197c-7.196-5.821-12.284-14.942-16.684-22.917c-4.309-7.7-11.092-17.876-12.238-26.813 c-2.337-18.38,24.292-7.333,31.947-4.675c10.175,3.575,37.447,7.517,34.422,23.421c-2.521,12.971-18.151,28.784-31.213,30.801 c-0.137,0.046-0.321,0-0.504,0c-0.046,0.046-0.092,0.092-0.137,0.137c-0.367,0.183-0.779,0.413-1.192,0.596 C163.961,206.573,162.449,206.252,161.119,205.197z"/>
                    <path fill="#000000" d="M101.58,157.896c14.484-6.004,15.813,10.175,15.721,19.984c-0.137,11.688-0.504,23.421-1.375,35.063 c-0.321,4.721-0.137,10.405-4.629,13.384c-5.546,3.667-16.225,0.779-21.955-1.008c-0.183-0.092-0.367-0.183-0.55-0.229 c-12.054-2.108-26.767-7.654-28.188-18.792c-0.138-1.283,0.367-2.429,1.146-3.3c0.367-0.688,0.733-1.329,1.146-1.925 c1.788-2.475,3.85-4.675,5.913-6.921c3.483-5.179,7.242-10.175,11.229-14.988C85.813,172.197,92.917,161.471,101.58,157.896z"/>
                    <path fill="#000000" d="M103.689,107.661c-21.13-17.371-41.71-44.276-52.344-69.164 c-8.113-18.93,12.513-30.48,28.417-35.705c21.451-7.059,29.976-0.917,32.13,20.534c1.788,18.471,2.613,37.08,2.475,55.643 c-0.046,7.838,2.154,20.488-2.429,27.547c0.733,2.888-3.621,4.95-6.096,2.979c-0.367-0.275-0.733-0.642-1.146-0.963 C104.33,108.303,104.009,108.028,103.689,107.661z"/>
                    <path fill="#000000" d="M101.397,134.566c1.696,7.517-3.621,10.542-9.854,13.384c-11.092,4.996-22.734,8.984-34.422,12.284 c-6.784,1.879-17.188,6.371-23.742,1.375c-4.95-3.758-5.271-11.596-5.729-17.28c-1.008-12.696,0.917-42.993,18.517-44.276 c8.617-0.596,19.388,7.104,26.447,11.138c9.396,5.409,19.48,11.596,26.492,20.076C100.159,131.862,101.03,132.916,101.397,134.566z"/>
                  </g>
                </svg>
                <FilledStar className="fill-yellow-400" />
                <span className="ml-1 text-sm font-medium">{medspa.yelp_star}</span>
              </div>
              <a 
                href={medspa.yelp_url || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-amber-900"
              >
                ({medspa.yelp_review || 0})
              </a>
            </div>
          )}
        </div>

        {/* Call and Consultation Buttons */}
        <div className="flex gap-3 mt-6">
          {medspa.number && (
            <button
              onClick={(e) => handleCall(medspa.number, e)}
              className="flex-1 bg-amber-900 text-white py-3 px-4 rounded-md flex items-center justify-center font-medium hover:bg-amber-800 transition-colors"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call
            </button>
          )}
          
          <button
            onClick={() => {
              setSelectedMedspa(medspa);
              setIsConsultationModalOpen(true);
              console.log('Clicked Get Consultation in MedspaDetail');
            }}
            className="flex-1 border border-amber-900 text-amber-900 py-3 px-4 rounded-md font-medium hover:bg-amber-50 transition-colors"
          >
            Get Consultation
          </button>
        </div>

        {/* Treatments and Prices */}
        {treatments.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Treatments & Prices</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              {treatments.map((treatment, index) => (
                <div 
                  key={index} 
                  className={`flex justify-between py-2 ${
                    index !== treatments.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <span className="text-gray-700">{treatment.name}</span>
                  <span className="font-medium">{treatment.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Good Reviews */}
        {goodReviews.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">What People Like</h2>
            <div className="space-y-4">
              {goodReviews.map((review, index) => (
                <div key={index} className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <img 
                        src="/icons/thumb_up_gray.png"
                        alt="Thumb up"
                        width={20}
                        height={20}
                        className="text-gray-500"
                      />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium"><ReviewText text={review.review || ''} /></p>
                      {review.explanation && (
                        <p className="text-gray-600 text-sm mt-1">{review.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bad Reviews */}
        {badReviews.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">What People Dislike</h2>
            <div className="space-y-4">
              {badReviews.map((review, index) => (
                <div key={index} className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <img 
                        src="/icons/thumb_down_gray.png"
                        alt="Thumb down"
                        width={20}
                        height={20}
                        className="text-gray-500"
                      />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium"><ReviewText text={review.review || ''} /></p>
                      {review.explanation && (
                        <p className="text-gray-600 text-sm mt-1">{review.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Practitioners */}
        {recommendedPractitioners.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Recommended Practitioners</h2>
            <div className="space-y-4">
              {recommendedPractitioners.map((practitioner, index) => (
                <div key={index} className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-900 font-medium">{practitioner.name}</p>
                  <p className="text-gray-700 text-sm mt-1">{practitioner.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map */}
        {medspa.lat && medspa.lng && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Location</h2>
            <div className="h-[300px] rounded-lg overflow-hidden">
              <DynamicMap 
                medspas={[medspa]}
                onMedspaSelect={() => {}}
              />
            </div>
            <button 
              onClick={() => handleOpenMap(medspa.address || '', medspa.medspa_name)}
              className="w-full mt-2 py-2 border border-gray-300 rounded-md text-gray-700 flex items-center justify-center hover:bg-gray-50"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Get Directions
            </button>
          </div>
        )}
      </div>

      {/* Consultation Modal */}
      {isConsultationModalOpen && selectedMedspa && (
        <ConsultationModal
          isOpen={isConsultationModalOpen}
          onClose={() => setIsConsultationModalOpen(false)}
          medspa={selectedMedspa}
        />
      )}
    </div>
  );
}

// Helper component to format review text with quotes
function ReviewText({ text }: { text: string }) {
  return (
    <>
      &quot;{text}&quot;
    </>
  );
}
