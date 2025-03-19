'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, MapPin, Navigation, Phone } from 'lucide-react';
import { MedspaRatings } from '@/components/ui/medspa-ratings';
import { ImageSlider } from '@/components/ui/ImageSlider';
import { Button } from '@/components/ui/button/button';
import { Medspa } from '@/types';
import { PriceData } from '@/types';

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
    
    const formattedPrice = new Intl.NumberFormat('en-US').format(Number(priceData.standard_price || 0));
    const standardUnit = priceData.standard_unit ? priceData.standard_unit.toLowerCase() : 'unit';
    const standardPrice = `$${formattedPrice} per ${standardUnit}`;
    
    // Check if member price exists
    if (priceData.member_price) {
      const formattedMemberPrice = new Intl.NumberFormat('en-US').format(Number(priceData.member_price));
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

          {/* Medspa name and village */}
          <h3 className="cormorant text-xl font-semibold text-black break-words leading-[1.1]">
            {searchQuery ? highlightMatches(medspa.medspa_name, searchQuery.split(' ')) : medspa.medspa_name}
          </h3>
          
          <div className="flex items-center text-gray-500 text-[12px] mt-1">
            {userLocation && calculateDistance && (
              <span className="flex items-center whitespace-nowrap mr-2">
                <Navigation className="h-3.5 w-3.5 text-gray-400 mr-1" />
                {getMedspaDistance()?.toFixed(1) || '?'}mil
              </span>
            )}
            <div className="flex items-center truncate">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 mr-1" />
              <span className="truncate">
                {searchQuery ? highlightMatches(medspa.village, searchQuery.split(' ')) : medspa.village}
              </span>
            </div>
          </div>

          {/* Ratings */}
          <MedspaRatings 
            googleStar={medspa.google_star} 
            googleReview={medspa.google_review} 
            yelpStar={medspa.yelp_star} 
            yelpReview={medspa.yelp_review}
            google_map_link={medspa.google_map_link}
            yelp_url={medspa.yelp_url}
          />
        </div>
      </div>
      
      {/* Treatment Price */}
      {getRandomTreatment && (
        <div className="text-left mt-2">
          <span className="text-2xl font-bold text-black">
            {(() => {
              const priceData = getRandomTreatment(medspa);
              if (!priceData) return null;
              
              return (
                <>
                  <div className="text-base font-light mb-1">
                    {priceData.treatment_name}
                    {priceData.treatment_category && (
                      <span className="text-sm text-gray-500 ml-2">
                        ({priceData.treatment_category})
                      </span>
                    )}
                  </div>
                  {formatPriceDisplay(priceData)}
                </>
              );
            })()}
          </span>
        </div>
      )}

      {/* Review Preview */}
      {medspa.review1_text && (
        <div className="text-left text-gray-600 text-sm">
          &quot;{medspa.review1_text.slice(0, 50)}...
          {medspa.review1_text.length > 20 && (
            <span className="text-amber-900 font-medium ml-1 cursor-pointer">Read more</span>
          )}
        </div>
      )}

      {/* Pros and Cons */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="min-w-[20px] w-5 h-5 flex-shrink-0 flex items-center justify-center">
            <Image 
              src="/icons/thumb_up_gray.png"
              alt="Thumb up"
              width={20}
              height={20}
              className="text-gray-500 relative top-[1px]"
            />
          </div>
          <span className="text-base text-gray-500">{medspa.good_review_short || ""}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="min-w-[20px] w-5 h-5 flex-shrink-0 flex items-center justify-center">
            <Image 
              src="/icons/thumb_down_gray.png"
              alt="Thumb down"
              width={20}
              height={20}
              className="text-gray-500 relative top-[1px]"
            />
          </div>
          <span className="text-base text-gray-500">{medspa.bad_review_short || ""}</span>
        </div>
      </div>

      {/* Call and Consultation CTA Buttons */}
      <div className="flex flex-row gap-3">
        <Button
          onClick={(e) => handleCall(medspa.number, e)}
          variant="destructive"
          className="bg-amber-900 hover:bg-amber-950 text-white border-none hover:shadow-lg w-12 h-10 p-0"
          title="call"
          aria-label="call"
        >
          <Phone size={16} />
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onConsultationRequestAction(medspa);
          }}
          variant="outline"
          className="bg-white hover:bg-amber-900 border border-amber-900 text-amber-900 hover:text-white hover:border-amber-900 hover:shadow-lg flex-1"
        >
          <span>Get Consultation</span>
        </Button>
      </div>
    </div>
  );
}; 