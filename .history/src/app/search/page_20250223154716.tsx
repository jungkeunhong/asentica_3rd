'use client';

import { useState, Suspense, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import SearchFilters from '@/components/SearchFilters';
import DynamicMap from '@/components/DynamicMap';
import { doctors } from '@/data/doctors';
import { StarIcon, MapPinIcon } from '@heroicons/react/24/solid';

function SearchContent() {
  const [view, setView] = useState<'list' | 'map'>('list');
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  // Combine all doctors into a single array and calculate distances
  const doctorsWithDistance = useMemo(() => {
    const allDocs = Object.values(doctors).flat();
    if (!location) return allDocs;

    return allDocs.map(doctor => ({
      ...doctor,
      distance: calculateDistance(
        location.latitude,
        location.longitude,
        doctor.lat,
        doctor.lng
      )
    }));
  }, [location]);

  // Filter doctors based on search query
  const filteredDoctors = useMemo(() => {
    if (!query) return doctorsWithDistance;
    return doctorsWithDistance.filter(doctor => 
      doctor.name.toLowerCase().includes(query.toLowerCase()) ||
      doctor.clinic.toLowerCase().includes(query.toLowerCase()) ||
      doctor.title.toLowerCase().includes(query.toLowerCase()) ||
      doctor.expertise.some(exp => exp.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, doctorsWithDistance]);

  const handleDoctorClick = (doctorId: string) => {
    router.push(`/doctor/${doctorId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-4">
        <SearchBar initialValue={query} />
      </div>
      <div className="flex justify-end space-x-2 mb-4">
        <button
          onClick={() => setView('list')}
          className={`px-4 py-2 text-brown-600 ${
            view === 'list' ? 'bg-brown-100' : 'bg-white'
          } rounded-lg`}
        >
          List
        </button>
        <button
          onClick={() => setView('map')}
          className={`px-4 py-2 text-brown-600 ${
            view === 'map' ? 'bg-brown-100' : 'bg-white'
          } rounded-lg`}
        >
          Map
        </button>
      </div>

      {locationLoading ? (
        <div className="text-center text-gray-600">Calculating distances...</div>
      ) : view === 'map' ? (
        <DynamicMap doctors={filteredDoctors} />
      ) : (
        <div className="grid gap-4">
          {filteredDoctors.map((doctor) => (
            <div 
              key={doctor.id}
              onClick={() => handleDoctorClick(doctor.id)}
              className="p-4 flex items-start space-x-4 border-b cursor-pointer hover:bg-gray-50"
            >
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-sm text-gray-600">{doctor.title}</p>
                <p className="text-sm text-gray-600">{doctor.clinic}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <span className="ml-1 font-medium">{doctor.rating}</span>
                    <span className="text-gray-600 ml-1">({doctor.reviews.length} reviews)</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-4 w-4" />
                    <span className="ml-1">{doctor.location}</span>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {doctor.highlights?.slice(0, 3).map((highlight, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}