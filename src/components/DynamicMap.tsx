'use client';

import { useEffect, useState, useRef } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import type { Libraries } from '@react-google-maps/api';
import { Doctor } from '@/data/doctors';

const libraries: Libraries = ['places'];

const defaultCenter = {
  lat: 40.7831,
  lng: -73.9712 // Manhattan coordinates
};

interface DynamicMapProps {
  doctors: Doctor[];
}

const manhattanLocations = [
  { lat: 40.7831, lng: -73.9712 }, // Upper East Side
  { lat: 40.7505, lng: -73.9934 }, // Chelsea
  { lat: 40.7589, lng: -73.9851 }, // Midtown
  { lat: 40.7308, lng: -73.9973 }, // East Village
  { lat: 40.7484, lng: -73.9857 }  // Murray Hill
];

export default function DynamicMap({ doctors }: DynamicMapProps) {
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          console.log('Using default Manhattan location');
        }
      );
    }
  }, []);

  const getCoordinatesFromLocation = (location: string): google.maps.LatLngLiteral => {
    // If location contains coordinates in the format "lat,lng"
    const coordMatch = location.match(/-?\d+\.\d+/g);
    if (coordMatch && coordMatch.length >= 2) {
      return {
        lat: parseFloat(coordMatch[0]),
        lng: parseFloat(coordMatch[1])
      };
    }

    // If location contains "NY" or "New York", use a random Manhattan location
    if (location.includes('NY') || location.includes('New York')) {
      const index = Math.abs(location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % manhattanLocations.length;
      return manhattanLocations[index];
    }

    // Default to Manhattan center
    return defaultCenter;
  };

  if (!isLoaded) {
    return <div className="h-full w-full bg-gray-100 animate-pulse" />;
  }

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full"
      center={userLocation}
      zoom={13}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      }}
      onLoad={map => {
        mapRef.current = map;
      }}
    >
      {doctors.map((doctor) => {
        const position = getCoordinatesFromLocation(doctor.location);
        return (
          <MarkerF
            key={doctor.id}
            position={position}
            title={doctor.name}
            onClick={() => {
              if (mapRef.current) {
                mapRef.current.panTo(position);
                mapRef.current.setZoom(15);
              }
            }}
          />
        );
      })}
    </GoogleMap>
  );
}
