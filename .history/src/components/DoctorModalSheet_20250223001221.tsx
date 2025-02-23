'use client';

import { useEffect, useState, useRef } from 'react';
import { Doctor } from '@/data/doctors';
import Image from 'next/image';

interface DoctorModalSheetProps {
  doctors: Doctor[];
  isOpen: boolean;
  onClose: () => void;
}

export default function DoctorModalSheet({ doctors, isOpen, onClose }: DoctorModalSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [sheetHeight, setSheetHeight] = useState('55vh');
  const startY = useRef(0);
  const currentY = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    currentY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaY = e.touches[0].clientY - currentY.current;
    currentY.current = e.touches[0].clientY;

    if (sheetRef.current) {
      const newHeight = parseInt(sheetHeight) - (deltaY / window.innerHeight * 100);
      if (newHeight >= 30 && newHeight <= 90) {
        setSheetHeight(`${newHeight}vh`);
      }
    }
  };

  const handleTouchEnd = () => {
    const threshold = window.innerHeight * 0.6;
    if (currentY.current - startY.current > threshold) {
      setSheetHeight('55vh');
    } else if (startY.current - currentY.current > threshold) {
      setSheetHeight('90vh');
    }
  };

  if (!mounted || !isOpen) return null;

  return (
    <div 
      ref={sheetRef}
      className="fixed left-0 right-0 bg-white rounded-t-3xl z-50 transition-all duration-300 ease-out"
      style={{ 
        height: sheetHeight,
        bottom: 0,
        transform: isOpen ? 'translateY(0)' : 'translateY(100%)'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="sticky top-0 bg-white p-4 border-b">
      </div>
      <div className="overflow-y-auto h-full pb-safe">
        {doctors.map((doctor, index) => (
          <div key={doctor.id}>
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="rounded-lg object-cover"
                    sizes="80px"
                    priority
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-black">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-black">{doctor.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{doctor.intro}</p>
                </div>
              </div>
            </div>
            {index < doctors.length - 1 && <div className="border-b border-gray-100" />}
          </div>
        ))}
      </div>
    </div>
  );
}