'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Medspa } from '@/types';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';

// 지도 컨테이너 스타일
const containerStyle = {
  width: '100%',
  height: '60vh',
};

// 기본 지도 중심 좌표 (뉴욕)
const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

// DynamicMap 컴포넌트 Props 타입
interface DynamicMapProps {
  medspas: Medspa[];
  onMedspaSelect: (medspa: Medspa) => void;
}

// 지도 옵션
const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  gestureHandling: "greedy",
  styles: [
    {
      featureType: 'poi.business',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'transit',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

export default function DynamicMap({ medspas, onMedspaSelect }: DynamicMapProps) {
  // Google Maps API 로드
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  // 지도 인스턴스 참조
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // 선택된 메드스파 상태
  const [selectedMedspa, setSelectedMedspa] = useState<Medspa | null>(null);
  
  // 지도 중심 좌표 상태
  const [center, setCenter] = useState(defaultCenter);
  
  // 사용자 위치 상태
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  
  // 지도 로드 콜백
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);
  
  // 지도 언마운트 콜백
  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);
  
  // 마커 클릭 핸들러
  const handleMarkerClick = (medspa: Medspa) => {
    setSelectedMedspa(medspa);
  };
  
  // 정보창 닫기 핸들러
  const handleInfoWindowClose = () => {
    setSelectedMedspa(null);
  };
  
  // 사용자 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          setCenter(userPos); // 사용자 위치로 지도 중심 이동
        },
        () => {
          console.log('Error getting location');
        }
      );
    }
  }, []);
  
  // 내 위치로 이동 핸들러
  const handleGoToMyLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.panTo(userLocation);
      mapRef.current.setZoom(14);
    }
  };
  
  // 마커 렌더링
  const renderMarkers = () => {
    if (!isLoaded) return null;
    
    return medspas.map(medspa => {
      try {
        let position: google.maps.LatLngLiteral;
        
        if (medspa.coordinates) {
          position = medspa.coordinates;
          console.log(`Using coordinates for MedSpa ${medspa.id}:`, position);
        } else if (medspa.lat && medspa.lng) {
          // 추가적인 유효성 검사
          const isValidLat = !isNaN(medspa.lat) && medspa.lat >= -90 && medspa.lat <= 90;
          const isValidLng = !isNaN(medspa.lng) && medspa.lng >= -180 && medspa.lng <= 180;
          
          if (isValidLat && isValidLng) {
            position = { lat: medspa.lat, lng: medspa.lng };
            console.log(`Using lat/lng for MedSpa ${medspa.id}:`, position);
          } else {
            console.warn(`Invalid lat/lng values for MedSpa ${medspa.id}: lat=${medspa.lat}, lng=${medspa.lng}`);
            // 유효하지 않은 좌표인 경우 랜덤 좌표 사용
            position = {
              lat: center.lat + (Math.random() * 0.05 - 0.025),
              lng: center.lng + (Math.random() * 0.05 - 0.025)
            };
            console.log(`Using random coordinates for MedSpa ${medspa.id} due to invalid values:`, position);
          }
        } else {
          position = {
            lat: center.lat + (Math.random() * 0.05 - 0.025),
            lng: center.lng + (Math.random() * 0.05 - 0.025)
          };
          console.log(`Using random coordinates for MedSpa ${medspa.id} (no coordinates available):`, position);
        }
        
        return (
          <Marker
            key={medspa.id}
            position={position}
            onClick={() => handleMarkerClick(medspa)}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#FF5A5F",
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: "#FFFFFF",
              scale: 8
            }}
            animation={isLoaded ? google.maps.Animation.DROP : undefined}
          />
        );
      } catch (error) {
        console.error(`Error creating marker for medspa ${medspa.id}:`, error);
        return null;
      }
    }).filter(Boolean);
  };
  
  // API 로드 에러 처리
  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-100 rounded-lg p-4">
        <div className="text-red-500 text-xl mb-2">
          Failed to load Google Maps
        </div>
        <div className="text-gray-600">
          Please check your API key and try again.
        </div>
      </div>
    );
  }
  
  // API 키가 없는 경우 처리
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-100 rounded-lg p-4">
        <div className="text-amber-500 text-xl mb-2">
          Google Maps API Key Missing
        </div>
        <div className="text-gray-600 mb-4 text-center">
          Please add your Google Maps API key to the .env.local file:<br />
          <code className="bg-gray-200 px-2 py-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key</code>
        </div>
        <div className="text-gray-600 text-sm text-center">
          Get your API key from the <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Google Cloud Console</a>
        </div>
      </div>
    );
  }
  
  // API 로딩 중 처리
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // 사용자 위치 마커 아이콘
  const userLocationIcon = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: "#4285F4",
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: "#FFFFFF",
    scale: 8
  };
  
  return (
    <div className="relative h-full w-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {/* 사용자 위치 마커 */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={userLocationIcon}
            zIndex={1000}
          />
        )}
        
        {/* 메드스파 마커들 */}
        {renderMarkers()}
        
        {/* 선택된 메드스파 정보창 */}
        {selectedMedspa && (
          <InfoWindow
            position={
              selectedMedspa.coordinates || 
              (selectedMedspa.lat && selectedMedspa.lng ? 
                { lat: selectedMedspa.lat, lng: selectedMedspa.lng } : 
                {
                  lat: center.lat + (Math.random() * 0.05 - 0.025),
                  lng: center.lng + (Math.random() * 0.05 - 0.025)
                }
              )
            }
            onCloseClick={handleInfoWindowClose}
          >
            <div className="max-w-[280px]">
              <div className="relative h-32 w-full mb-2">
                <Image
                  src={selectedMedspa.image_url1 || '/placeholder-medspa.jpg'}
                  alt={selectedMedspa.name || selectedMedspa.medspa_name || 'MedSpa'}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <h3 className="cormorant font-semibold text-lg truncate text-black">
                {selectedMedspa.name || selectedMedspa.medspa_name}
              </h3>
              <div className="flex items-center mb-1">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm font-medium text-black">
                  {selectedMedspa.yelp_star || selectedMedspa.google_star || 'N/A'}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  ({selectedMedspa.yelp_review || selectedMedspa.google_review || '0'} reviews)
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="truncate">{selectedMedspa.address || selectedMedspa.location || selectedMedspa.village || ''}</span>
              </div>
              <Button 
                className="w-full mt-2 bg-black text-white hover:bg-gray-800"
                onClick={() => onMedspaSelect(selectedMedspa)}
              >
                View Details
              </Button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      {/* 내 위치로 이동 버튼 */}
      {userLocation && (
        <Button
          className="absolute bottom-6 right-4 bg-white text-black hover:bg-gray-100 shadow-md rounded-full w-10 h-10 p-0 flex items-center justify-center z-10"
          onClick={handleGoToMyLocation}
          size="sm"
          title="Go to my location"
          aria-label="Go to my location"
        >
          <Navigation className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
