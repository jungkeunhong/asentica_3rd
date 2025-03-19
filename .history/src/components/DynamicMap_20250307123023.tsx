'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Medspa } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Phone, Heart } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { MedspaRatings } from "@/components/ui/medspa-ratings";
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
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  // 정보창 위치 상태
  const [infoWindowPosition, setInfoWindowPosition] = useState<{x: number, y: number} | null>(null);
  
  // Favorites context
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  
  // Toggle favorite status
  const toggleFavorite = (medspa: Medspa, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isFavorite(medspa.id)) {
      removeFavorite(medspa.id);
    } else {
      addFavorite(medspa);
    }
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
    
    // Get marker position on screen
    if (mapRef.current && medspa) {
      const position = medspa.coordinates || 
        (medspa.lat && medspa.lng ? 
          { lat: medspa.lat, lng: medspa.lng } : 
          {
            lat: center.lat + (Math.random() * 0.05 - 0.025),
            lng: center.lng + (Math.random() * 0.05 - 0.025)
          }
        );
      
      const projection = mapRef.current.getProjection();
      if (projection) {
        const point = projection.fromLatLngToPoint(new google.maps.LatLng(position.lat, position.lng));
        const bounds = mapRef.current.getBounds();
        if (bounds && point) {
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          
          // Add null checks and type assertions for these points
          const neBound = projection.fromLatLngToPoint(
            new google.maps.LatLng(ne.lat(), ne.lng())
          );
          const swBound = projection.fromLatLngToPoint(
            new google.maps.LatLng(sw.lat(), sw.lng())
          );
          
          if (neBound && swBound) {
            const mapDiv = mapRef.current.getDiv();
            const mapWidth = mapDiv.offsetWidth;
            const mapHeight = mapDiv.offsetHeight;
            
            const x = (point.x - swBound.x) / (neBound.x - swBound.x) * mapWidth;
            const y = (point.y - neBound.y) / (swBound.y - neBound.y) * mapHeight;
            
            setInfoWindowPosition({x, y: y - 10}); // Offset to position above marker
          }
        }
      }
    }
  };
  
  // 정보창 닫기 핸들러
  const handleInfoWindowClose = () => {
    setSelectedMedspa(null);
    setInfoWindowPosition(null);
  };
  
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
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: "#FFFFFF",
              scale: 8
            }}
            zIndex={1000}
          />
        )}
        
        {/* 메드스파 마커들 */}
        {renderMarkers()}
        
      </GoogleMap>
      
      {/* Custom InfoWindow */}
      {selectedMedspa && infoWindowPosition && (
        <>
          {/* Modal backdrop for closing InfoWindow when clicked outside */}
          <div 
            className="fixed inset-0 bg-transparent z-10" 
            onClick={handleInfoWindowClose}
          />
          
          {/* Custom InfoWindow */}
          <div 
            className="absolute z-20 bg-white rounded-lg shadow-lg info-window"
            style={{
              left: `${infoWindowPosition.x}px`,
              top: `${infoWindowPosition.y}px`
            }}
          >
            <div className="p-3">
              <div className="relative h-32 w-full mb-2">
                <Image
                  src={selectedMedspa.image_url1 || '/placeholder-medspa.jpg'}
                  alt={selectedMedspa.name || selectedMedspa.medspa_name || 'MedSpa'}
                  fill
                  className="object-cover rounded-t-lg"
                />
                
                {/* Favorite heart icon */}
                <button 
                  className={`absolute top-2 right-2 p-1 rounded-full ${
                    isFavorite(selectedMedspa.id) 
                      ? 'bg-white/80 text-red-500' 
                      : 'bg-white/60 text-gray-500 hover:bg-white/80'
                  } transition-all duration-200`}
                  onClick={(e) => toggleFavorite(selectedMedspa, e)}
                  aria-label={isFavorite(selectedMedspa.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart 
                    size={18} 
                    className={isFavorite(selectedMedspa.id) ? "fill-red-500" : ""} 
                  />
                </button>
              </div>
              <h3 className="cormorant font-semibold text-lg truncate text-black">
                {selectedMedspa.name || selectedMedspa.medspa_name}
              </h3>
              
              {/* Combined Reviews - Google (yellow) and Yelp (red) */}
              <MedspaRatings 
                          googleStar={selectedMedspa.google_star} 
                          googleReview={selectedMedspa.google_review} 
                          yelpStar={selectedMedspa.yelp_star} 
                          yelpReview={selectedMedspa.yelp_review} 
                        />

              
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="truncate">{selectedMedspa.address || selectedMedspa.location || selectedMedspa.village || ''}</span>
              </div>
              
              {/* Call and Consultation CTA Buttons */}
              <div className="flex flex-row gap-2 mt-2">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `tel:${selectedMedspa.number}`;
                  }}
                  className="btn bg-amber-800 hover:bg-amber-900 text-white border-none hover:shadow-lg transform flex items-center justify-center gap-2 w-12 h-9 rounded"
                  title="전화하기"
                  aria-label="전화하기"
                >
                  <Phone size={16} />
                </button>
                <button 
                  onClick={() => onMedspaSelect(selectedMedspa)}
                  className="btn bg-white hover:bg-amber-800 border border-amber-800 text-amber-800 hover:text-white hover:shadow-lg transform flex items-center justify-center gap-2 flex-1 h-9 rounded text-sm"
                  title="Consultation"
                  aria-label="Consultation"
                >
                  <span>Consultation</span>
                </button>
              </div>
            </div>
            
            {/* Arrow pointing to marker */}
            <div 
              className="absolute left-1/2 bottom-0 w-4 h-4 bg-white transform rotate-45 translate-y-1/2 -translate-x-1/2 info-window-arrow"
            />
          </div>
        </>
      )}
      
      {/* 내 위치로 이동 버튼 */}
      {userLocation && (
        <Button
          className="absolute bottom-24 right-4 bg-white text-black hover:bg-gray-100 shadow-md rounded-full w-10 h-10 p-0 flex items-center justify-center z-10"
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
