'use client';

import { useLoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useMemo, useState, useCallback, useEffect } from 'react';
import type { Libraries } from '@react-google-maps/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, Navigation } from 'lucide-react';

// Medspa 인터페이스 정의
interface Medspa {
  id: string;
  medspa_name: string;
  location: string;
  village: string;
  image_url1?: string;
  google_star?: number;
  google_review?: number;
  best_treatment?: string;
  free_consultation?: string;
  // 임시로 좌표 추가 (실제로는 데이터에서 가져와야 함)
  coordinates?: {
    lat: number;
    lng: number;
  };
}

const libraries: Libraries = ['places'];

const mapOptions = {
  disableDefaultUI: false,
  clickableIcons: false,
  scrollwheel: true,
  zoomControl: true,
  streetViewControl: true,
  mapTypeControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: 'poi.business',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'transit',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

// New York City coordinates as default center
const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

interface DynamicMapProps {
  medspas: Medspa[];
  onMedspaSelect?: (medspa: Medspa) => void;
}

export default function DynamicMap({ medspas, onMedspaSelect }: DynamicMapProps) {
  const [selectedMedspa, setSelectedMedspa] = useState<Medspa | null>(null);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const router = useRouter();

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  // Check if API key is missing or is a placeholder
  const isValidApiKey = apiKey && 
    apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE' && 
    apiKey.length > 10;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries,
    // Only attempt to load if we have a valid API key
    ...(isValidApiKey ? {} : { preventGoogleFontsLoading: true })
  });

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          console.log('Error getting location');
        }
      );
    }
  }, []);

  // 임시로 좌표 생성 (실제로는 데이터에서 가져와야 함)
  const medspaWithCoordinates = useMemo(() => {
    return medspas.map((medspa, index) => ({
      ...medspa,
      coordinates: medspa.coordinates || {
        lat: defaultCenter.lat + (Math.random() * 0.05 - 0.025),
        lng: defaultCenter.lng + (Math.random() * 0.05 - 0.025)
      }
    }));
  }, [medspas]);

  const center = useMemo(() => {
    if (userLocation) return userLocation;
    if (medspaWithCoordinates.length > 0 && medspaWithCoordinates[0].coordinates) {
      return medspaWithCoordinates[0].coordinates;
    }
    return defaultCenter;
  }, [medspaWithCoordinates, userLocation]);

  const handleMarkerClick = (medspa: Medspa) => {
    setSelectedMedspa(medspa);
    if (mapRef && medspa.coordinates) {
      mapRef.panTo(medspa.coordinates);
    }
  };

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);
  }, []);

  const goToUserLocation = () => {
    if (userLocation && mapRef) {
      mapRef.panTo(userLocation);
      mapRef.setZoom(14);
    }
  };

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

  if (!isValidApiKey) {
    return (
      <div className="w-full h-full rounded-lg bg-gray-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
          <h3 className="text-xl font-semibold text-red-600 mb-2">Google Maps API Key Required</h3>
          <p className="text-gray-700 mb-4">
            To use the map feature, you need to set up a Google Maps API key.
          </p>
          <div className="bg-gray-50 p-4 rounded-md text-left mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Follow these steps:</p>
            <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-1">
              <li>Go to the Google Cloud Console</li>
              <li>Create a project and enable the Maps JavaScript API</li>
              <li>Create an API key in Credentials</li>
              <li>Create a <code className="bg-gray-200 px-1 rounded">.env.local</code> file in the project root</li>
              <li>Add <code className="bg-gray-200 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here</code></li>
              <li>Restart the development server</li>
            </ol>
          </div>
          <p className="text-xs text-gray-500">
            For detailed instructions, please refer to the README.md file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <GoogleMap
        options={mapOptions}
        zoom={12}
        center={center}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        onLoad={onMapLoad}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: '/icons/user-location.svg',
              scaledSize: new google.maps.Size(30, 30)
            }}
            zIndex={1000}
          />
        )}
        
        {medspaWithCoordinates.map((medspa) => (
          <Marker
            key={medspa.id}
            position={medspa.coordinates!}
            title={medspa.medspa_name}
            onClick={() => handleMarkerClick(medspa)}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#FF5A5F',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#FFFFFF',
            }}
            animation={google.maps.Animation.DROP}
          />
        ))}
        
        {selectedMedspa && (
          <InfoWindow
            position={selectedMedspa.coordinates!}
            onCloseClick={() => setSelectedMedspa(null)}
          >
            <div 
              className="p-3 max-w-xs" 
              onClick={() => {
                if (onMedspaSelect) {
                  onMedspaSelect(selectedMedspa);
                } else {
                  router.push(`/medspa/${selectedMedspa.id}`);
                }
              }}
            >
              {selectedMedspa.image_url1 && (
                <div className="relative w-full h-36 mb-2 overflow-hidden rounded-lg">
                  <Image
                    src={selectedMedspa.image_url1}
                    alt={selectedMedspa.medspa_name}
                    fill
                    className="object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <h3 className="font-semibold text-lg">{selectedMedspa.medspa_name}</h3>
              <p className="text-gray-600 text-sm mb-2">{selectedMedspa.location}</p>
              
              <div className="flex flex-col gap-1">
                {selectedMedspa.google_star && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span className="text-sm">{selectedMedspa.google_star}</span>
                    {selectedMedspa.google_review && (
                      <span className="text-xs text-gray-500">({selectedMedspa.google_review})</span>
                    )}
                  </div>
                )}
                
                {selectedMedspa.best_treatment && (
                  <div className="text-sm text-gray-700 mt-1">
                    <span className="font-medium">Best for:</span> {selectedMedspa.best_treatment}
                  </div>
                )}
                
                {selectedMedspa.free_consultation && (
                  <div className="mt-2">
                    <span className="bg-black text-white px-3 py-1 rounded-full text-xs">
                      {selectedMedspa.free_consultation}
                    </span>
                  </div>
                )}
              </div>
              
              <button 
                className="w-full mt-3 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/medspa/${selectedMedspa.id}`);
                }}
              >
                View Details
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      {/* Map controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
        {userLocation && (
          <button 
            onClick={goToUserLocation}
            className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Go to my location"
          >
            <Navigation className="h-5 w-5 text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
}
