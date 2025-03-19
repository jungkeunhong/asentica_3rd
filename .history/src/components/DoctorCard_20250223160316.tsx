'use client';

import Image from 'next/image';
import { StarIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { Doctor } from '@/data/doctors';

interface DoctorCardProps {
  doctor: Doctor;
  onClick?: () => void;
}

export default function DoctorCard({ doctor, onClick }: DoctorCardProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48">
        <Image
          src={doctor.image}
          alt={doctor.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{doctor.name}</h3>
        <p className="text-gray-600 text-sm">{doctor.title}</p>
        <p className="text-gray-600 text-sm">{doctor.clinic}</p>

        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 text-yellow-400" />
            <span className="ml-1 font-medium">{doctor.rating}</span>
            <span className="text-gray-600 ml-1">(Google Reviews)</span>
          </div>
        </div>

        <div className="mt-2 flex items-center text-gray-600">
          <MapPinIcon className="h-4 w-4" />
          <span className="ml-1">{doctor.location}</span>
        </div>

        {doctor.expertise && doctor.expertise.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {doctor.expertise.slice(0, 3).map((item, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
