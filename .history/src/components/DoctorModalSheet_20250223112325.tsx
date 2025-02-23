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
  const [sheetPosition, setSheetPosition] = useState('20vh');
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSheetPosition('20vh');
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.drag-handle')) return;

    isDragging.current = true;
    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    currentY.current = e.touches[0].clientY;
    
    // Calculate new position
    const windowHeight = window.innerHeight;
    const newPosition = Math.max(
      Math.min(90, (windowHeight - currentY.current) / windowHeight * 100),
      20
    );
    setSheetPosition(`${newPosition}vh`);

    // Prevent page scrolling while dragging
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const deltaY = currentY.current - startY.current;
    const threshold = window.innerHeight * 0.2;
    
    if (deltaY > threshold) {
      // Drag down - minimize or close
      if (sheetPosition === '40vh') {
        onClose();
      } else {
        setSheetPosition('40vh');
      }
    } else if (deltaY < -threshold) {
      // Drag up - maximize
      setSheetPosition('90vh');
    } else {
      // Return to previous position
      setSheetPosition('40vh');
    }
  };

  return (
    <div 
      ref={sheetRef}
      className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-[20px] shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ 
        height: sheetPosition,
        zIndex: 100,
        touchAction: isDragging.current ? 'none' : 'auto'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Drag handle */}
      <div className="sticky top-0 bg-white z-10 drag-handle rounded-t-[20px]">
        <div className="w-full h-12 flex items-center justify-center">
          <div className="w-20 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>

      {/* Doctor list */}
      <div 
        className="overflow-y-auto h-[calc(100%-3rem)] overscroll-contain pb-safe"
      >
        <div className="p-4 space-y-4">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="flex items-start space-x-4 p-4 bg-white rounded-lg border">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover rounded-lg border border-gray-100"
                />
              </div>
              <div className="flex-grow">
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
  );
}