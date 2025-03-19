'use client';

import { useEffect } from 'react';

interface MapSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  businessName: string;
}

export default function MapSelectionModal({ isOpen, onClose, address, businessName }: MapSelectionModalProps) {
  // Create URLs for both map services with business name and address
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${businessName} ${address}`)}`;
  const appleMapsUrl = `https://maps.apple.com/?q=${encodeURIComponent(`${businessName} ${address}`)}`;

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('map-modal-backdrop')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAppleMaps = () => {
    window.open(appleMapsUrl, '_blank');
    onClose();
  };

  const handleGoogleMaps = () => {
    window.open(googleMapsUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center pb-8 map-modal-backdrop">
      <div className="bg-white rounded-xl w-full max-w-sm mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 text-center border-b border-gray-200">
          <h3 className="text-lg font-medium">Open Location</h3>
        </div>
        <button 
          className="w-full p-4 text-center text-blue-500 border-b border-gray-200 font-medium"
          onClick={handleAppleMaps}
        >
          Open in Maps
        </button>
        <button 
          className="w-full p-4 text-center text-blue-500 border-b border-gray-200 font-medium"
          onClick={handleGoogleMaps}
        >
          Open in Google Maps
        </button>
        <button 
          className="w-full p-4 text-center font-medium"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
} 