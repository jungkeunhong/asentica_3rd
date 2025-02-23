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
  const isDragging = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    currentY.current = e.touches[0].clientY;
    const deltaY = currentY.current - startY.current;
    
    // Prevent pulling up beyond 90vh
    if (deltaY < 0 && sheetHeight === '90vh') {
      return;
    }
    
    // Update sheet height based on drag
    const newHeight = Math.max(
      Math.min(window.innerHeight * 0.9, window.innerHeight - currentY.current),
      window.innerHeight * 0.2
    );
    setSheetHeight(`${newHeight}px`);
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const deltaY = currentY.current - startY.current;
    const threshold = window.innerHeight * 0.2;
    
    if (deltaY > threshold) {
      onClose();
    } else if (deltaY < -threshold) {
      setSheetHeight('90vh');
    } else {
      setSheetHeight('55vh');
    }
  };

  if (!mounted) return null;

  return (
    <div 
      ref={sheetRef}
      className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`} 
      style={{ height: sheetHeight }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Drag handle */}
      <div className="w-full h-12 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing">
        <div className="w-12"></div>
        <div className="w-20 h-1 bg-gray-300 rounded-full"></div>
        <button 
          onClick={onClose}
          className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Doctor list */}
      <div className="overflow-y-auto h-[calc(100%-3rem)] pb-safe">
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