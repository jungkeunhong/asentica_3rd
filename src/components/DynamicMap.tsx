'use client';

import { useEffect, useState, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface Doctor {
  id: string;
  name: string;
  image: string;
  location: string;
  clinic: string;
  title: string;
  rating: number;
}

interface DynamicMapProps {
  doctors: Doctor[];
}

const defaultCenter = { lat: 40.7831, lng: -73.9712 }; // Manhattan coordinates

const DynamicMap = ({ doctors }: DynamicMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const getCoordinates = (location: string): google.maps.LatLngLiteral => {
    try {
      // Try to parse coordinates in format "lat,lng"
      const [lat, lng] = location.split(',').map(coord => parseFloat(coord.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    } catch (error) {
      console.error('Error parsing coordinates:', error);
    }
    
    // Return default coordinates if parsing fails
    return defaultCenter;
  };

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places']
    });

    loader.load().then(() => {
      if (!mapRef.current) return;

      const mapInstance = new google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 12,
        disableDefaultUI: true, // Disable all default controls
        zoomControl: true, // Only enable zoom control
        mapTypeId: 'roadmap', // Force roadmap view
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      setMap(mapInstance);
      setInfoWindow(new google.maps.InfoWindow());
    }).catch(error => {
      console.error('Error loading Google Maps:', error);
    });
  }, []);

  useEffect(() => {
    if (!map || !infoWindow) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();

    doctors.forEach(doctor => {
      const position = getCoordinates(doctor.location);

      const marker = new google.maps.Marker({
        position,
        map,
        title: doctor.name
      });

      const content = `
        <div class="p-2 max-w-[200px]">
          <div class="relative w-full h-[150px] mb-2">
            <img
              src="${doctor.image}"
              alt="${doctor.name}"
              class="w-full h-full object-cover rounded"
            />
          </div>
          <h3 class="font-semibold">${doctor.name}</h3>
          <p class="text-sm text-gray-600">${doctor.title}</p>
          <p class="text-sm text-gray-600">${doctor.clinic}</p>
          <div class="mt-1">
            <span class="text-yellow-400">★</span>
            <span class="ml-1 text-sm">${doctor.rating}</span>
          </div>
        </div>
      `;

      marker.addListener('click', () => {
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    if (doctors.length > 0) {
      map.fitBounds(bounds);
    } else {
      map.setCenter(defaultCenter);
      map.setZoom(12);
    }
  }, [doctors, map, infoWindow]);

  return <div ref={mapRef} className="w-full h-full" />;
};

export default DynamicMap;
