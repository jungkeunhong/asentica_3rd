'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Doctor } from '@/data/doctors';

interface DoctorModalSheetProps {
  doctor: Doctor;
  isOpen: boolean;
  onClose: () => void;
}

export default function DoctorModalSheet({ doctor, isOpen, onClose }: DoctorModalSheetProps) {
  if (!isOpen) return null;

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl">
        <div className="p-6 space-y-4">
          {/* Handle bar */}
          <div className="flex justify-center">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Doctor Info */}
          <div className="flex items-start gap-4">
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={doctor.image}
                alt={doctor.name}
                fill
                className="rounded-lg object-cover"
              />
            </div>
            
            <div className="flex-grow">
              <h3 className="text-xl font-semibold">{doctor.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{doctor.title}</p>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {renderStars(doctor.rating)}
                </div>
                <span className="text-gray-600">
                  {doctor.rating} ({doctor.reviews.split('reviews')[0].trim()})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}