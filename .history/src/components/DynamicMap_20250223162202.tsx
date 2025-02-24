'use client';

import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { useMemo, useCallback, useState } from 'react';
import { Doctor, Coordinates } from '@/ㅇㅁ/doctor';

const mapOptions = {
  disableDefaultUI: false,
  clickableIcons: false,
  scrollwheel: true,
  zoomControl: true,
  streetViewControl: true,
  mapTypeControl: false,
  fullscreenControl: false,
};

const defaultCenter: Coordinates = {
  lat: 37.7749,
  lng: -122.4194,
};

interface DynamicMapProps {
  doctors: Doctor[];
}

export default function DynamicMap({ doctors }: DynamicMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  const center = useMemo(() => {
    const doctorsWithCoordinates = doctors.filter(doctor => doctor.coordinates);
    if (doctorsWithCoordinates.length > 0) {
      return doctorsWithCoordinates[0].coordinates;
    }
    return defaultCenter;
  }, [doctors]);

  const onLoad = useCallback(() => {
    setMapLoaded(true);
  }, []);

  if (loadError) {
    return (
      <div className="w-full h-[400px] rounded-lg bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">Error loading map</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[400px] rounded-lg bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  const validDoctors = doctors.filter(doctor => doctor.coordinates);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <GoogleMap
        options={mapOptions}
        zoom={12}
        center={center}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        onLoad={onLoad}
      >
        {mapLoaded && validDoctors.map((doctor) => (
          <Marker
            key={doctor.id}
            position={doctor.coordinates as Coordinates}
            title={doctor.name}
            label={{
              text: doctor.name,
              className: 'text-sm',
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
