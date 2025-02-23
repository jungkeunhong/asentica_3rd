'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Doctor } from '@/data/doctors';

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex gap-6">
        {/* Image section */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <Image
            src={doctor.image}
            alt={doctor.name}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        {/* Content section */}
        <div className="flex-grow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold">{doctor.name}</h3>
              <p className="text-gray-600 text-sm">{doctor.title}</p>
              <p className="text-gray-500 text-sm mt-1">{doctor.clinic}</p>
            </div>
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">★</span>
              <span className="font-medium">{doctor.rating}</span>
            </div>
          </div>

          {/* Expertise tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {doctor.expertise.map((skill, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Treatment preview */}
          {doctor.treatments[0] && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{doctor.treatments[0].name}</p>
                  <p className="text-gray-600 text-xs mt-1">{doctor.treatments[0].time}</p>
                </div>
                <p className="text-sm font-medium">
                  {doctor.treatments[0].price.split('\n')[0]}
                </p>
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-4 mt-4">
            <Link 
              href={doctor.website} 
              target="_blank"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Visit Website
            </Link>
            <Link 
              href={doctor.reviews} 
              target="_blank"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Read Reviews
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
