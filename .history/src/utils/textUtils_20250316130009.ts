'use client';

import React from 'react';

/**
 * Highlights occurrences of a search term within a text string
 * 
 * @param text The text to search within
 * @param searchTerm The term to highlight
 * @returns A React fragment with highlighted text
 */
export const highlightText = (
  text: string | null | undefined,
  searchTerm: string
): React.ReactNode => {
  if (!text || !searchTerm) {
    return text || '';
  }
  
  // Prepare search term for regex by escaping special characters
  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Create regex pattern with case insensitivity
  const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
  
  // Split the text by the search term, keeping the search term as a separate segment
  const parts = text.split(regex);
  
  if (parts.length === 1) {
    return text; // No matches found
  }
  
  // Map each part to either regular text or a highlighted span
  return (
    <React.Fragment>
      {parts.map((part, index) => {
        if (part.toLowerCase() === searchTerm.toLowerCase()) {
          return (
            <span key={index} className="bg-yellow-200 font-medium">
              {part}
            </span>
          );
        }
        return part;
      })}
    </React.Fragment>
  );
};

/**
 * Format price for display
 * 
 * @param price Price value as string or number
 * @returns Formatted price string
 */
export const formatPrice = (price: string | number | null | undefined): string => {
  if (price === null || price === undefined) {
    return 'Price not available';
  }
  
  // Convert to number
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Check if conversion yielded a valid number
  if (isNaN(numericPrice)) {
    return 'Price not available';
  }
  
  // Format price with dollar sign and no decimal places
  return `$${Math.round(numericPrice).toLocaleString()}`;
};

/**
 * Truncate text to a specific length with ellipsis
 * 
 * @param text Text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text
 */
export const truncateText = (
  text: string | null | undefined, 
  maxLength: number
): string => {
  if (!text) return '';
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength) + '...';
}; 