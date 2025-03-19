'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ImageSliderProps {
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  medspaName?: string;
}

export const ImageSlider = ({
  images,
  currentIndex,
  onIndexChange,
  medspaName = 'MedSpa'
}: ImageSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (e: any, info: any) => {
    const threshold = 50; // Drag threshold
    const draggedDistance = info.offset.x;
    
    // Change index based on drag direction and distance
    if (Math.abs(draggedDistance) > threshold) {
      if (draggedDistance < 0 && currentIndex < images.length - 1) {
        onIndexChange(currentIndex + 1);
      } else if (draggedDistance > 0 && currentIndex > 0) {
        onIndexChange(currentIndex - 1);
      }
    }
  };

  return (
    <div className="relative w-32 h-32 overflow-hidden rounded-md">
      <motion.div 
        ref={sliderRef}
        className="flex h-full"
        drag="x"
        dragConstraints={{ left: -32 * (images.length - 1), right: 0 }}
        dragElastic={0.2}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        onDragEnd={handleDragEnd}
        animate={{ x: -currentIndex * 128 }} // Adjust to image width
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ touchAction: "none" }} // Prevent page scrolling when swiping on mobile
      >
        {images.map((url, index) => (
          <div key={index} className="w-32 h-32 flex-shrink-0">
            <Image 
              src={url} 
              alt={`${medspaName} image ${index + 1}`}
              width={128}
              height={128}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              priority={index === 0}
            />
          </div>
        ))}
      </motion.div>
      
      {/* Image indicators (dots) */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onIndexChange(index);
              }}
              className={`w-1.5 h-1.5 rounded-full ${
                currentIndex === index 
                  ? 'bg-white' 
                  : 'bg-white/50'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}; 