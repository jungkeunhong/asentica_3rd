import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { useMemo } from 'react';
import { Doctor } from '@/types/doctor';

const mapOptions = {
  disableDefaultUI: true,
  clickableIcons: false,
  scrollwheel: true,
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

interface DynamicMapProps {
  doctors: Doctor[];
}

export default function DynamicMap({ doctors }: DynamicMapProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const center = useMemo(() => defaultCenter, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-[600px] rounded-lg overflow-hidden">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={12}
        options={mapOptions}
      >
        {doctors.map((doctor) => (
          <Marker
            key={doctor.id}
            position={defaultCenter}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
