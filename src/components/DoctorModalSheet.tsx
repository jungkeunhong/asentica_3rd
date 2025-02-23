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
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const lastVelocity = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const animationFrame = useRef<number | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSheetPosition('20vh');
    }
  }, [isOpen]);

  useEffect(() => {
    // Cleanup animation frame on unmount
    return () => {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.drag-handle')) return;

    isDragging.current = true;
    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
    lastTime.current = Date.now();
    lastVelocity.current = 0;

    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    const now = Date.now();
    const dt = now - lastTime.current;
    const newY = e.touches[0].clientY;
    const dy = newY - currentY.current;
    
    // Calculate velocity (pixels per millisecond)
    if (dt > 0) {
      lastVelocity.current = dy / dt;
    }
    
    currentY.current = newY;
    lastTime.current = now;
    
    // Calculate new position with smooth interpolation
    const windowHeight = window.innerHeight;
    const currentPosition = parseInt(sheetPosition);
    const targetPosition = Math.max(
      Math.min(90, (windowHeight - currentY.current) / windowHeight * 100),
      20
    );
    
    const smoothPosition = currentPosition + (targetPosition - currentPosition) * 0.5;
    setSheetPosition(`${smoothPosition}vh`);

    // Prevent page scrolling while dragging
    e.preventDefault();
  };

  const animateToPosition = (targetPosition: number) => {
    const startPosition = parseInt(sheetPosition);
    const startTime = Date.now();
    const duration = 300; // Animation duration in ms

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic function
      const easing = 1 - Math.pow(1 - progress, 3);
      
      const current = startPosition + (targetPosition - startPosition) * easing;
      setSheetPosition(`${current}vh`);

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      } else {
        animationFrame.current = null;
      }
    };

    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
    }
    animationFrame.current = requestAnimationFrame(animate);
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const velocity = lastVelocity.current;
    const currentPos = parseInt(sheetPosition);
    
    // Use velocity to determine target position
    if (Math.abs(velocity) > 0.5) {
      if (velocity > 0) {
        // Swiping down
        if (currentPos <= 30) {
          onClose();
        } else {
          animateToPosition(20);
        }
      } else {
        // Swiping up
        animateToPosition(90);
      }
    } else {
      // Snap to closest position based on current position
      if (currentPos < 30) {
        onClose();
      } else if (currentPos < 55) {
        animateToPosition(20);
      } else {
        animateToPosition(90);
      }
    }
  };

  return (
    <div 
      ref={sheetRef}
      className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-[20px] shadow-lg transform transition-all duration-300 ease-out ${
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
      <div className="overflow-y-auto h-[calc(100%-3rem)] overscroll-contain pb-safe">
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