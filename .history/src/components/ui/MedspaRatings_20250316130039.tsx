'use client';

import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface MedspaRatingsProps {
  googleStar?: number | null;
  googleReview?: number | null;
  yelpStar?: number | null;
  yelpReview?: number | null;
  className?: string;
}

export const MedspaRatings: React.FC<MedspaRatingsProps> = ({
  googleStar,
  googleReview,
  yelpStar,
  yelpReview,
  className = '',
}) => {
  // Helper function to render stars based on rating
  const renderStars = (rating: number | null | undefined) => {
    if (rating === null || rating === undefined) return null;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
        ))}
        {hasHalfStar && (
          <StarHalf className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
        )}
      </div>
    );
  };
  
  // Format review count
  const formatReviewCount = (count: number | null | undefined) => {
    if (count === null || count === undefined) return '';
    
    if (count >= 1000) {
      return `(${(count / 1000).toFixed(1)}k)`;
    }
    
    return `(${count})`;
  };
  
  // Determine if we have any rating data to display
  const hasAnyRatings = googleStar || googleReview || yelpStar || yelpReview;
  
  if (!hasAnyRatings) {
    return null;
  }
  
  return (
    <div className={`flex flex-wrap gap-x-4 gap-y-1 text-xs ${className}`}>
      {/* Google Rating */}
      {(googleStar || googleReview) && (
        <div className="flex items-center gap-1">
          <span className="font-medium">Google:</span>
          {renderStars(googleStar)}
          {googleStar && <span className="font-medium">{googleStar.toFixed(1)}</span>}
          {googleReview !== null && googleReview !== undefined && (
            <span className="text-gray-500">{formatReviewCount(googleReview)}</span>
          )}
        </div>
      )}
      
      {/* Yelp Rating */}
      {(yelpStar || yelpReview) && (
        <div className="flex items-center gap-1">
          <span className="font-medium">Yelp:</span>
          {renderStars(yelpStar)}
          {yelpStar && <span className="font-medium">{yelpStar.toFixed(1)}</span>}
          {yelpReview !== null && yelpReview !== undefined && (
            <span className="text-gray-500">{formatReviewCount(yelpReview)}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default MedspaRatings; 