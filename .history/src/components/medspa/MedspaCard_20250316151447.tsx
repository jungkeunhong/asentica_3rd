'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, MapPin, Navigation, Phone } from 'lucide-react';
import { MedspaRatings } from '@/components/ui/medspa-ratings';
import { Button } from '@/components/ui/button/button';
import { Medspa, PriceData } from '@/types';

// Import ImageSlider directly with a relative path
import { ImageSlider } from '../ui/ImageSlider';

interface MedspaCardProps {
  medspa: Medspa;
  isFavorite: boolean;
  onToggleFavorite: (medspa: Medspa) => void;
  onConsultationRequestAction: (medspa: Medspa) => void;
  onCardClick: (medspaId: string) => void;
  userLocation?: { lat: number; lng: number } | null;
  searchQuery?: string;
  getRandomTreatment?: (medspa: Medspa) => PriceData | null;
  calculateDistance?: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
}

export const MedspaCard = ({
  medspa,
  isFavorite,
  onToggleFavorite,
  onConsultationRequestAction,
  onCardClick,
  userLocation,
  searchQuery = '',
  getRandomTreatment,
  calculateDistance
}: MedspaCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageUrls = [medspa.image_url1, medspa.image_url2, medspa.image_url3].filter(Boolean) as string[];

  // Function to handle phone call
  const handleCall = (phoneNumber: string | undefined, e: React.MouseEvent) => {
    e.stopPropagation();
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  // Function to highlight matching search terms
  const highlightMatches = (text: string, searchTerms: string[]): React.ReactNode => {
    if (!text || !searchTerms.length) return text;
    
    const lowerText = text.toLowerCase();
    const segments: { text: string; isMatch: boolean }[] = [];
    let lastIndex = 0;
    
    // Find all matches and their positions
    const matches: { start: number; end: number }[] = [];
    
    searchTerms.forEach(term => {
      if (term.length < 2) return;
      
      let startIndex = 0;
      while (startIndex < lowerText.length) {
        const index = lowerText.indexOf(term, startIndex);
        if (index === -1) break;
        
        matches.push({ start: index, end: index + term.length });
        startIndex = index + 1;
      }
    });
    
    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);
    
    // Merge overlapping matches
    const mergedMatches: { start: number; end: number }[] = [];
    matches.forEach(match => {
      const lastMatch = mergedMatches[mergedMatches.length - 1];
      
      if (lastMatch && match.start <= lastMatch.end) {
        // Matches overlap, merge them
        lastMatch.end = Math.max(lastMatch.end, match.end);
      } else {
        // No overlap, add as new match
        mergedMatches.push({ ...match });
      }
    });
    
    // Create segments based on matches
    mergedMatches.forEach(match => {
      // Add non-matching segment before current match
      if (match.start > lastIndex) {
        segments.push({
          text: text.substring(lastIndex, match.start),
          isMatch: false
        });
      }
      
      // Add matching segment
      segments.push({
        text: text.substring(match.start, match.end),
        isMatch: true
      });
      
      lastIndex = match.end;
    });
    
    // Add remaining text after last match
    if (lastIndex < text.length) {
      segments.push({
        text: text.substring(lastIndex),
        isMatch: false
      });
    }
    
    // If no matches were found, return the original text
    if (segments.length === 0) {
      return text;
    }
    
    // Render segments with highlights
    return (
      <>
        {segments.map((segment, i) => 
          segment.isMatch ? (
            <mark key={i} className="bg-yellow-100 font-medium px-0.5 rounded">
              {segment.text}
            </mark>
          ) : (
            segment.text
          )
        )}
      </>
    );
  };

  // Format price display
  const formatPriceDisplay = (priceData: PriceData) => {
    if (!priceData) return null;
    
    // 숫자 형식 변환 시 안정적인 방식 사용
    let formattedPrice = '0';
    try {
      const priceNumber = Number(priceData.standard_price || 0);
      if (!isNaN(priceNumber)) {
        formattedPrice = priceNumber.toLocaleString('en-US');
      }
    } catch (e) {
      console.error('Error formatting price:', e);
    }
    
    const standardUnit = priceData.standard_unit ? priceData.standard_unit.toLowerCase() : 'unit';
    const standardPrice = `$${formattedPrice} per ${standardUnit}`;
    
    // Check if member price exists
    if (priceData.member_price) {
      let formattedMemberPrice = '0';
      try {
        const memberPriceNumber = Number(priceData.member_price || 0);
        if (!isNaN(memberPriceNumber)) {
          formattedMemberPrice = memberPriceNumber.toLocaleString('en-US');
        }
      } catch (e) {
        console.error('Error formatting member price:', e);
      }
      
      const memberUnit = priceData.member_unit ? priceData.member_unit.toLowerCase() : 'unit';
      const memberPrice = `$${formattedMemberPrice} per ${memberUnit}`;
      
      return (
        <div>
          <div>{standardPrice}</div>
          <div className="text-sm text-green-600">Member: {memberPrice}</div>
        </div>
      );
    }
    
    return <div>{standardPrice}</div>;
  };

  // Calculate distance between user and medspa
  const getMedspaDistance = (): number | null => {
    if (!userLocation || !calculateDistance) return null;
    
    try {
      let coords;
      
      if (medspa.coordinates) {
        coords = medspa.coordinates;
      } else if (medspa.lat !== undefined && medspa.lng !== undefined) {
        const isValidLat = !isNaN(medspa.lat) && medspa.lat >= -90 && medspa.lat <= 90;
        const isValidLng = medspa.lng !== null && medspa.lng !== undefined && !isNaN(medspa.lng);
        
        if (isValidLat && isValidLng) {
          coords = { lat: medspa.lat, lng: medspa.lng };
        } else {
          return null;
        }
      } else {
        return null;
      }
      
      return calculateDistance(
        userLocation.lat, 
        userLocation.lng,
        coords.lat, 
        coords.lng
      );
    } catch (error) {
      console.error(`Error calculating distance for MedSpa ${medspa.id}:`, error);
      return null;
    }
  };

  return (
    <div 
      onClick={() => onCardClick(medspa.id)}
      className="flex flex-col gap-4 bg-white border-b p-4 cursor-pointer hover:border-b"
    >
      <div className="flex gap-4">
        {/* Left side - Image slider */}
        <div className="flex flex-col w-32 gap-2">
          {imageUrls.length > 0 ? (
            <ImageSlider 
              images={imageUrls} 
              currentIndex={currentIndex}
              onIndexChange={setCurrentIndex}
              medspaName={medspa.medspa_name}
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-md">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>

        {/* Right side - Content */}
        <div className="flex-1 flex flex-col">
          {/* Free consultation and favorite button */}
          <div className="flex justify-between items-center mb-1">
            <div>
              {medspa.free_consultation && medspa.free_consultation.trim() !== '' ? (
                <span className="text-left text-amber-900 py-1 text-sm">
                  {medspa.free_consultation}
                </span>
              ) : (
                <span className="text-left text-gray-500 py-1 text-sm">
                  Paid Consultation
                </span>
              )}
            </div>
            
            {/* Favorite heart icon */}
            <button 
              className={`p-1 rounded-full ${
                isFavorite 
                  ? 'bg-white/80 text-red-500' 
                  : 'bg-white/60 text-gray-500 hover:bg-white/80'
              } transition-all duration-200`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(medspa);
              }}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                size={18} 
                className={isFavorite ? "fill-red-500" : ""} 
              />
            </button>
          </div>

          {/* Medspa name and location */}
          <div className="mb-1">
            <h3 className="text-lg font-semibold">
              {searchQuery 
                ? highlightMatches(medspa.medspa_name, searchQuery.toLowerCase().split(' ').filter(Boolean)) 
                : medspa.medspa_name}
            </h3>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin size={14} className="mr-1" />
              <span>
                {medspa.village || 'Location not specified'}
                {userLocation && calculateDistance && medspa.lat && medspa.lng && (
                  <span className="ml-1">
                    ({getMedspaDistance()?.toFixed(1) || '?'} mi)
                  </span>
                )}
              </span>
            </div>
          </div>
          
          {/* Ratings */}
          <MedspaRatings 
            googleRating={medspa.google_star} 
            googleReviews={medspa.google_review} 
            yelpRating={medspa.yelp_star} 
            yelpReviews={medspa.yelp_review}
          />
          
          {/* Treatment price */}
          {getRandomTreatment && (
            <div className="mt-2">
              {(() => {
                // 안정적인 렌더링을 위해 함수로 감싸서 처리
                try {
                  const treatment = getRandomTreatment(medspa);
                  if (treatment) {
                    return (
                      <>
                        <div className="text-base font-medium">
                          {treatment.treatment_name || 'Treatment'}
                        </div>
                        <div className="text-sm text-gray-700">
                          {formatPriceDisplay(treatment)}
                        </div>
                      </>
                    );
                  }
                  return null;
                } catch (error) {
                  console.error('Error rendering treatment:', error);
                  return null;
                }
              })()}
            </div>
          )}
          
          {/* Reviews */}
          {medspa.review_summary && (
            <div className="mt-2 text-sm text-gray-700 line-clamp-2">
              "{medspa.review_summary}"
            </div>
          )}
          
          {/* Pros and cons */}
          <div className="mt-2 flex flex-wrap gap-1">
            {medspa.pros && medspa.pros.split(',').map((pro, index) => (
              <span key={`pro-${index}`} className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                {pro.trim()}
              </span>
            ))}
            
            {medspa.cons && medspa.cons.split(',').map((con, index) => (
              <span key={`con-${index}`} className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                {con.trim()}
              </span>
            ))}
          </div>
          
          {/* Call and consultation buttons */}
          <div className="mt-auto pt-3 flex gap-2">
            {medspa.number && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => handleCall(medspa.number, e)}
                className="flex-1 flex items-center justify-center"
              >
                <Phone size={14} className="mr-1" />
                Call
              </Button>
            )}
            
            <Button
              variant="default"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onConsultationRequestAction(medspa);
              }}
              className="flex-1 flex items-center justify-center bg-amber-900 hover:bg-amber-800"
            >
              <Navigation size={14} className="mr-1" />
              Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 