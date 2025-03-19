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
              
              {/* Combined Reviews - Google (yellow) and Yelp (red) displayed horizontally */}
              <div className="flex items-center space-x-3 mb-2">
                {/* Google rating */}
                {selectedMedspa.google_star && (
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                      <path fill="#000000" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#000000" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#000000" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#000000" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-xs text-black">{selectedMedspa.google_star}</span>
                    <span className="text-xs text-gray-500">({selectedMedspa.google_review || 0})</span>
                  </div>
                )}
                
                {/* Yelp rating - only show if data exists */}
                {selectedMedspa.yelp_star && selectedMedspa.yelp_review && (
                  <div className="flex items-center gap-1">                              
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 228.097 228.097">
                      <g>
                        <path fill="#000000" d="M173.22,68.06c8.204,6.784,30.709,25.392,27.042,38.455c-1.696,5.867-8.434,7.746-13.43,9.579 c-11.505,4.171-23.33,7.471-35.339,9.9c-9.717,1.971-30.48,6.279-26.63-10.909c1.512-6.646,6.875-12.284,11.184-17.28 c8.846-10.404,17.876-21.405,28.555-29.93c0.871-0.688,1.925-0.871,2.842-0.733C169.232,66.41,171.386,66.502,173.22,68.06z"/>
                        <path fill="#000000" d="M161.119,205.197c-7.196-5.821-12.284-14.942-16.684-22.917c-4.309-7.7-11.092-17.876-12.238-26.813 c-2.337-18.38,24.292-7.333,31.947-4.675c10.175,3.575,37.447,7.517,34.422,23.421c-2.521,12.971-18.151,28.784-31.213,30.801 c-0.137,0.046-0.321,0-0.504,0c-0.046,0.046-0.092,0.092-0.137,0.137c-0.367,0.183-0.779,0.413-1.192,0.596 C163.961,206.573,162.449,206.252,161.119,205.197z"/>
                        <path fill="#000000" d="M101.58,157.896c14.484-6.004,15.813,10.175,15.721,19.984c-0.137,11.688-0.504,23.421-1.375,35.063 c-0.321,4.721-0.137,10.405-4.629,13.384c-5.546,3.667-16.225,0.779-21.955-1.008c-0.183-0.092-0.367-0.183-0.55-0.229 c-12.054-2.108-26.767-7.654-28.188-18.792c-0.138-1.283,0.367-2.429,1.146-3.3c0.367-0.688,0.733-1.329,1.146-1.925 c1.788-2.475,3.85-4.675,5.913-6.921c3.483-5.179,7.242-10.175,11.229-14.988C85.813,172.197,92.917,161.471,101.58,157.896z"/>
                        <path fill="#000000" d="M103.689,107.661c-21.13-17.371-41.71-44.276-52.344-69.164 c-8.113-18.93,12.513-30.48,28.417-35.705c21.451-7.059,29.976-0.917,32.13,20.534c1.788,18.471,2.613,37.08,2.475,55.643 c-0.046,7.838,2.154,20.488-2.429,27.547c0.733,2.888-3.621,4.95-6.096,2.979c-0.367-0.275-0.733-0.642-1.146-0.963 C104.33,108.303,104.009,108.028,103.689,107.661z"/>
                        <path fill="#000000" d="M101.397,134.566c1.696,7.517-3.621,10.542-9.854,13.384c-11.092,4.996-22.734,8.984-34.422,12.284 c-6.784,1.879-17.188,6.371-23.742,1.375c-4.95-3.758-5.271-11.596-5.729-17.28c-1.008-12.696,0.917-42.993,18.517-44.276 c8.617-0.596,19.388,7.104,26.447,11.138c9.396,5.409,19.48,11.596,26.492,20.076C100.159,131.862,101.03,132.916,101.397,134.566z"/>
                      </g>
                    </svg>
                    <span className="text-xs text-black">{selectedMedspa.yelp_star}</span>
                    <span className="text-xs text-gray-500">({selectedMedspa.yelp_review})</span>
                  </div>
                )}
              </div>
              
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
