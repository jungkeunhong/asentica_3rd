'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import SearchBar from '@/components/SearchBar';
import { doctors } from '@/data/doctors';
import DoctorModalSheet from '@/components/DoctorModalSheet';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

const GoogleMap = dynamic(() => import('@react-google-maps/api').then(mod => mod.GoogleMap));
const LoadScript = dynamic(() => import('@react-google-maps/api').then(mod => mod.LoadScript));
const Marker = dynamic(() => import('@react-google-maps/api').then(mod => mod.Marker));

const defaultCenter = {
  lat: 40.7831,
  lng: -73.9712 // Manhattan coordinates
};

const SearchResults = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [center, setCenter] = useState(defaultCenter);
  const [userLocation, setUserLocation] = useState<null | { lat: number; lng: number }>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);

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
      for (let part of parts) {
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
        // Use different locations in Manhattan for better spread
        const manhattanLocations = [
          { lat: 40.7831, lng: -73.9712 }, // Upper East Side
          { lat: 40.7505, lng: -73.9934 }, // Chelsea
          { lat: 40.7589, lng: -73.9851 }, // Midtown
          { lat: 40.7308, lng: -73.9973 }, // East Village
          { lat: 40.7484, lng: -73.9857 }  // Murray Hill
        ];
        
        const index = Math.abs(query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % manhattanLocations.length;
        return manhattanLocations[index];
      }
      
      return defaultCenter;
    } catch (e) {
      console.error('Error parsing maps URL:', e);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
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
          <LoadScript 
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            onLoad={() => setIsMapLoaded(true)}
          >
            {isMapLoaded && (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={userLocation || center}
                zoom={13}
                options={mapOptions}
              >
                {filteredDoctors.map((doctor) => {
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

export default SearchResults;