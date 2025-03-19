'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { doctors } from '@/data/doctors';
import { StarIcon, MapPinIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';

export default function DoctorPage() {
  const params = useParams();
  const allDoctors = Object.values(doctors).flat();
  const doctor = allDoctors.find(d => d.id === params.id);

  if (!doctor) {
    return <div>Doctor not found</div>;
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/search" className="flex items-center text-brown-600">
            <ChevronLeftIcon className="h-6 w-6" />
            <span>Back to Search</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column - Image and basic info */}
          <div className="md:w-1/3">
            <div className="relative aspect-square w-full">
              {doctor.image && (
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover rounded-lg"
                />
              )}
            </div>
            <div className="mt-4">
              {doctor.rating && (
                <div className="flex items-center gap-2 mb-2">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="font-medium">{doctor.rating}</span>
                  {doctor.reviews && (
                    <span className="text-gray-600">({doctor.reviews.length} reviews)</span>
                  )}
                </div>
              )}
              {doctor.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPinIcon className="h-5 w-5" />
                  <span>{doctor.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Details */}
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
            {doctor.title && (
              <p className="text-xl text-gray-600 mb-4">{doctor.title}</p>
            )}
            {doctor.clinic && (
              <p className="text-lg text-gray-700 mb-6">{doctor.clinic}</p>
            )}

            {/* Highlights */}
            {doctor.highlights && doctor.highlights.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Highlights</h2>
                <div className="flex flex-wrap gap-2">
                  {doctor.highlights.map((highlight, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-brown-50 text-brown-600 rounded-full text-sm"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Treatments */}
            {doctor.treatments && doctor.treatments.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Available Treatments</h2>
                <div className="space-y-4">
                  {doctor.treatments.map((treatment, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-medium text-lg mb-2">{treatment.name}</h3>
                      {treatment.time && (
                        <p className="text-gray-600 mb-2">Duration: {treatment.time}</p>
                      )}
                      {treatment.price && (
                        <p className="text-gray-600 whitespace-pre-line">{treatment.price}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
