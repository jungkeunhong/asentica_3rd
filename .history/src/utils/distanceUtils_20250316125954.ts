'use client';

/**
 * Calculate the distance between two points using the Haversine formula
 * This calculates the great-circle distance between two points on a sphere (Earth)
 * 
 * @param lat1 Latitude of the first point in decimal degrees
 * @param lon1 Longitude of the first point in decimal degrees
 * @param lat2 Latitude of the second point in decimal degrees
 * @param lon2 Longitude of the second point in decimal degrees
 * @returns Distance in miles
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  // Radius of the Earth in miles
  const R = 3958.8;
  
  // Convert latitude and longitude from degrees to radians
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  // Haversine formula calculation
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return parseFloat(distance.toFixed(1)); // Round to 1 decimal place
};

/**
 * Convert degrees to radians
 * @param degrees Angle in degrees
 * @returns Angle in radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Format a distance for display
 * @param distance Distance in miles
 * @returns Formatted distance string (e.g., "1.2 mi")
 */
export const formatDistance = (distance: number): string => {
  if (distance === null || distance === undefined) {
    return 'N/A';
  }
  
  // For very short distances, show "< 0.1 mi"
  if (distance < 0.1) {
    return '< 0.1 mi';
  }
  
  return `${distance.toFixed(1)} mi`;
}; 