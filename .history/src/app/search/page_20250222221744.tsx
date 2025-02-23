'use client';

import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';

const SearchResults = () => {
  const center = {
    lat: 37.7749,
    lng: -122.4194
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="h-[calc(100vh-64px)]">
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={13}
          >
            {/* Add markers here */}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default SearchResults;