'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import SearchBar from '@/components/SearchBar';
import DoctorCard from '@/components/DoctorCard';
import { doctors } from '@/data/doctors';
import DoctorModalSheet from '@/components/DoctorModalSheet';

const defaultCenter = {
  lat: 40.7831,
  lng: -73.9712 // Manhattan coordinates
};

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [showMap, setShowMap] = useState(true);
  const [center, setCenter] = useState(defaultCenter);
  const [userLocation, setUserLocation] = useState<null | { lat: number; lng: number }>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    // Ask for location permission when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // If user denies or there's an error, keep using default Manhattan location
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

  return (
    <div className="min-h-screen">
      {/* Search header */}
      <div className="fixed top-16 left-0 right-0 bg-white z-40 border-b">
        <div className="max-w-7xl mx-auto py-4 px-4 flex items-center gap-4">
          <div className="flex-grow">
            <SearchBar />
          </div>
          <button
            onClick={() => setShowMap(!showMap)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            {showMap ? 'List' : 'Map'}
          </button>
        </div>
      </div>

      <div className="pt-32">
        {showMap ? (
          <>
            {/* Map Section */}
            <div className="h-[33vh] relative">
              <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={userLocation || center}
                  zoom={13}
                >
                  {filteredDoctors.map((doctor) => (
                    <MarkerF
                      key={doctor.id}
                      position={{
                        lat: parseFloat(doctor.location.split(',')[0]),
                        lng: parseFloat(doctor.location.split(',')[1])
                      }}
                      onClick={() => setSelectedDoctor(doctor)}
                    />
                  ))}
                </GoogleMap>
              </LoadScript>
            </div>


            {/* Results Section */}
            <div className="min-h-[67vh] bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid gap-6">
                  {filteredDoctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          // List-only view
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="grid gap-6">
                {filteredDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            </div>
                    {/* Modal Sheet */}
                <DoctorModalSheet
                    doctor={selectedDoctor}
                    isOpen={!!selectedDoctor}
                    onClose={() => setSelectedDoctor(null)}
                        />
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;