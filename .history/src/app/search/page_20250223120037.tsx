'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import Image from 'next/image';
import SearchBar from '@/components/SearchBar';
import DynamicMap from '@/components/DynamicMap';
import DoctorModalSheet from '@/components/DoctorModalSheet';
import { doctors } from '@/data/doctors';
import { MapIcon, ListBulletIcon } from '@heroicons/react/24/outline';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [view, setView] = useState<'map' | 'list'>('map');

  // Combine all doctors into a single array
  const allDoctors = [
    ...doctors.botox,
    ...(doctors.filler || []),
    ...(doctors.microneedling || [])
  ];

  // Filter doctors based on search query
  const filteredDoctors = allDoctors.filter(doctor =>
    doctor.name.toLowerCase().includes(query.toLowerCase()) ||
    doctor.clinic.toLowerCase().includes(query.toLowerCase()) ||
    doctor.title.toLowerCase().includes(query.toLowerCase()) ||
    doctor.expertise.some(exp => exp.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed header with search bar and toggle */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="flex items-center justify-between py-3">
          <SearchBar initialValue={query} className="flex-1" />
          <button
            onClick={() => setView(view === 'map' ? 'list' : 'map')}
            className="mr-4 px-3 py-2 rounded-lg bg-primary-50 text-primary-600 flex items-center space-x-1"
          >
            {view === 'map' ? (
              <>
                <ListBulletIcon className="w-5 h-5" />
                <span>List</span>
              </>
            ) : (
              <>
                <MapIcon className="w-5 h-5" />
                <span>Map</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 mt-[72px]">
        {/* Map View */}
        <div className={view === 'map' ? 'block h-full' : 'hidden'}>
          <DynamicMap doctors={filteredDoctors} />
        </div>

        {/* List View */}
        <div className={view === 'list' ? 'block h-full bg-gray-50' : 'hidden'}>
          <div className="p-4 space-y-4">
            {filteredDoctors.map((doctor) => (
              <div 
                key={doctor.id} 
                className="bg-white rounded-lg shadow p-4 flex items-start space-x-4"
              >
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.title}</p>
                  <p className="text-sm text-gray-600">{doctor.clinic}</p>
                  <div className="mt-2 flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-sm">{doctor.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Sheet (only visible in map view) */}
      {view === 'map' && (
        <DoctorModalSheet
          doctors={filteredDoctors}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
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