'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import SearchFilters from '@/components/SearchFilters';
import DynamicMap from '@/components/DynamicMap';
import { doctors } from '@/data/doctors';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { StarIcon, MapPinIcon } from '@heroicons/react/24/solid';

export default function SearchContent() {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleDoctorClick = (doctorId: string) => {
    router.push(`/doctor/${doctorId}`);
  };

  const filteredDoctors = Object.values(doctors).flat().filter((doctor) =>
    doctor.name.toLowerCase().includes(query.toLowerCase()) ||
    doctor.title.toLowerCase().includes(query.toLowerCase()) ||
    doctor.clinic.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-40 bg-white border-b">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* Back Button (왼쪽) */}
                <Link href="/" className="flex items-center text-brown-600">
                <ChevronLeftIcon className="h-6 w-6" />
                </Link>

                {/* Search Bar (가운데) */}
                <div className="w-[480px] flex-1 mx-4">
                <SearchBar 
                    initialValue={query} 
                    onSearch={(value) => setQuery(value)}
                />
                </div>

                {/* Map/List Toggle Button (오른쪽) */}
                <button
                onClick={() => setView(view === 'map' ? 'list' : 'map')}
                className="text-brown-600"
                >
                {view === 'map' ? 'List' : 'Map'}
                </button>
            </div>
        </div>
        <div className="border-b">
          <div className="container mx-auto">
            <SearchFilters />
          </div>
        </div>

      {/* Content */}
      {view === 'map' ? (
        <div className="flex-1 h-[calc(100vh-194px)]"> 
          <DynamicMap doctors={filteredDoctors} />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-6">
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
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 font-medium">{doctor.rating}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="h-4 w-4" />
                      <span className="ml-1">{doctor.location}</span>
                    </div>
                  </div>
                  {doctor.highlights && doctor.highlights.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {doctor.highlights.slice(0, 3).map((highlight, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}
                  {doctor.expertise && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {doctor.expertise.slice(0, 2).map((item, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-brown-50 text-brown-600 text-xs rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}