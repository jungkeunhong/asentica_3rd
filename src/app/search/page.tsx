'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import DynamicMap from '@/components/DynamicMap';
import { doctors } from '@/data/doctors';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
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
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center py-3">
            <Link href="/" className="flex-shrink-0 mr-4">
              <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
            </Link>
            <div className="w-[480px]">
              <SearchBar initialValue={query} />
            </div>
            <button
              onClick={() => setView(view === 'map' ? 'list' : 'map')}
              className="ml-4 text-[#6f3d2e] hover:underline whitespace-nowrap"
            >
              {view === 'map' ? 'List' : 'Map'}
            </button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 mt-[72px]">
        {/* Map View */}
        <div className={`h-full ${view === 'map' ? 'block' : 'hidden'}`}>
          <DynamicMap doctors={filteredDoctors} />
        </div>

        {/* List View */}
        <div className={`h-full bg-white overflow-auto ${view === 'list' ? 'block' : 'hidden'}`}>
          <div className="max-w-7xl mx-auto divide-y divide-gray-200">
            {filteredDoctors.map((doctor) => (
              <div 
                key={doctor.id} 
                className="p-4 flex items-start space-x-4"
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
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{doctor.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{doctor.title}</p>
                  <p className="text-sm text-gray-600 truncate">{doctor.clinic}</p>
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