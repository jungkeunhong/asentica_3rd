'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import SearchBar from '@/components/SearchBar';
import { doctors } from '@/data/doctors';
import DoctorModalSheet from '@/components/DoctorModalSheet';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import type { Libraries } from '@react-google-maps/api';

const libraries: Libraries = ['places'];

const defaultCenter = {
  lat: 40.7831,
  lng: -73.9712 // Manhattan coordinates
};

const manhattanLocations = [
  { lat: 40.7831, lng: -73.9712 }, // Upper East Side
  { lat: 40.7505, lng: -73.9934 }, // Chelsea
  { lat: 40.7589, lng: -73.9851 }, // Midtown
  { lat: 40.7308, lng: -73.9973 }, // East Village
  { lat: 40.7484, lng: -73.9857 }  // Murray Hill
];

interface MapComponentProps {
  userLocation: { lat: number; lng: number };
  mapOptions: google.maps.MapOptions;
  doctors: typeof doctors.botox;
  getCoordinatesFromMapsUrl: (url: string) => { lat: number; lng: number } | null;
}

const MapComponent = ({ userLocation, mapOptions, doctors, getCoordinatesFromMapsUrl }: MapComponentProps) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <LoadScript 
      id="google-map-script"
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={libraries}
      onLoad={() => setIsMapLoaded(true)}
    >
      {isMapLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={userLocation}
          zoom={13}
          options={mapOptions}
        >
          {doctors.map((doctor) => {
            const coords = getCoordinatesFromMapsUrl(doctor.reviews);
            if (coords) {
              return (
                <Marker
                  key={doctor.id}
                  position={coords}
                  title={doctor.name}
                />
              );
            }
            return null;
          })}
        </GoogleMap>
      )}
    </LoadScript>
  );
};

const DynamicMap = dynamic(() => Promise.resolve(MapComponent), {
  ssr: false
});

// Search content component that uses useSearchParams
const SearchContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [modalOpen, setModalOpen] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>(defaultCenter);

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

  // Combine all doctors into one array for search
  const allDoctors = [
    ...(doctors.botox || []),
    ...(doctors.filler || []),
    ...(doctors.microneedling || [])
  ];

  // Filter doctors based on search query
  const filteredDoctors = allDoctors.filter(doctor => 
    doctor.name.toLowerCase().includes(query.toLowerCase()) ||
    doctor.clinic.toLowerCase().includes(query.toLowerCase()) ||
    doctor.expertise.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
  );

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  };

  // Extract coordinates from Google Maps URL
  const getCoordinatesFromMapsUrl = (url: string) => {
    try {
      const queryMatch = url.match(/query=([^&]+)/);
      if (!queryMatch) return null;
      
      const query = decodeURIComponent(queryMatch[1]);
      const parts = query.split(',');
      
      // Try to find coordinates in the address
      for (const part of parts) {
        const coords = part.trim().match(/-?\d+\.\d+/g);
        if (coords && coords.length >= 2) {
          return {
            lat: parseFloat(coords[0]),
            lng: parseFloat(coords[1])
          };
        }
      }
      
      // If no coordinates found, use the location string to approximate
      if (query.includes('NY') || query.includes('New York')) {
        const index = Math.abs(query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % manhattanLocations.length;
        return manhattanLocations[index];
      }
      
      return defaultCenter;
    } catch (e) {
      console.error('Error parsing maps URL:', e);
      return defaultCenter;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="beforeInteractive"
      />
      {/* Fixed header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b">
        <div className="max-w-7xl mx-auto py-4 px-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <div className="flex-grow">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="pt-16">
        {/* Map Section */}
        <div className="h-[45vh] relative z-10">
          <DynamicMap
            userLocation={userLocation}
            mapOptions={mapOptions}
            doctors={filteredDoctors}
            getCoordinatesFromMapsUrl={getCoordinatesFromMapsUrl}
          />
        </div>

        {/* Modal Sheet */}
        <DoctorModalSheet
          doctors={filteredDoctors}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </div>
  );
};

// Main search page component with Suspense boundary
const SearchResults = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
};

export default SearchResults;