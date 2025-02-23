'use client';

import { useEffect, useRef } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import { Doctor } from '@/data/doctors';

interface DynamicMapProps {
  userLocation: { lat: number; lng: number };
  mapOptions: google.maps.MapOptions;
  doctors: Doctor[];
  getCoordinatesFromMapsUrl: (url: string) => { lat: number; lng: number };
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

export default function DynamicMap({ userLocation, mapOptions, doctors, getCoordinatesFromMapsUrl }: DynamicMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  useEffect(() => {
    if (mapRef.current) {
      // Enable one finger pan on mobile
      const map = mapRef.current;
      map.setOptions({
        gestureHandling: 'greedy',
      });
    }
  }, [mapRef.current]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={userLocation}
      zoom={12}
      options={{
        ...mapOptions,
        gestureHandling: 'greedy', // Enable one finger pan
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      }}
      onLoad={(map) => {
        mapRef.current = map;
      }}
    >
      {doctors.map((doctor) => {
        const position = getCoordinatesFromMapsUrl(doctor.location);
        return (
          <MarkerF
            key={doctor.id}
            position={position}
            title={doctor.name}
          />
        );
      })}
    </GoogleMap>
  );
}
