'use client';

import { useLoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useMemo, useState } from 'react';
import { Doctor } from '@/data/doctors';
import type { Libraries } from '@react-google-maps/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const libraries: Libraries = ['places'];

const mapOptions = {
  disableDefaultUI: false,
  clickableIcons: false,
  scrollwheel: true,
  zoomControl: true,
  streetViewControl: true,
  mapTypeControl: false,
  fullscreenControl: false,
};

// New York City coordinates as default center
const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

interface DynamicMapProps {
  doctors: Doctor[];
}

export default function DynamicMap({ doctors }: DynamicMapProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const router = useRouter();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const center = useMemo(() => {
    if (doctors.length > 0) {
      return doctors[0].coordinates;
    }
    return defaultCenter;
  }, [doctors]);

  if (loadError) {
    return (
      <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">Failed to load Google Maps</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <GoogleMap
        options={mapOptions}
        zoom={12}
        center={center}
        mapContainerStyle={{ width: '100%', height: '100%' }}
      >
        {doctors.map((doctor) => (
          <Marker
            key={doctor.id}
            position={doctor.coordinates}
            title={doctor.name}
            onClick={() => setSelectedDoctor(doctor)}
          />
        ))}
        
        {selectedDoctor && (
          <InfoWindow
            position={selectedDoctor.coordinates}
            onCloseClick={() => setSelectedDoctor(null)}
          >
            <div className="p-2" onClick={() => router.push(`/doctor/${selectedDoctor.id}`)}>
              <div className="relative w-48 h-48 mb-2">
                <Image
                  src={selectedDoctor.image}
                  alt={selectedDoctor.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <h3 className="font-semibold text-lg">{selectedDoctor.name}</h3>
              <p className="text-gray-600 text-sm">{selectedDoctor.title}</p>
              <p className="text-gray-600 text-sm">{selectedDoctor.clinic}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-brown-600">{selectedDoctor.rating}</span>
                <span>•</span>
                <span className="text-gray-600">{selectedDoctor.location}</span>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
