import React from 'react';
import MapClient from '@/components/MapClient';

// Dynamically import the map component to avoid SSR issues
const Map = MapClient;

interface MedSpa {
  id: number;
  name: string;
  rating: number;
  reviewCount: number;
  services: string[];
  address: string;
  description: string;
  image: string;
  location: {
    lat: number;
    lng: number;
  };
}

const dummyMedspas: MedSpa[] = [
  {
    id: 1,
    name: "Physicos Aesthetics",
    rating: 5.0,
    reviewCount: 63,
    services: ["Medical Spas", "Hair Loss"],
    address: "1372 N Main St, Ste 202",
    description: "We specialize in facial injectables",
    image: "/images/medspa1.jpg",
    location: {
      lat: 37.8715,
      lng: -122.2730
    }
  },
  // Add more dummy data as needed
];

export default function CategoryPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Top bar */}
      <div className="bg-white p-4 flex items-center justify-between shadow-sm">
        <button className="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div className="font-medium">Medspa</div>
        <button className="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
        </button>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <Map medspas={dummyMedspas} />
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 p-4 bg-white">
        <button className="px-4 py-2 border rounded-full text-sm">Sort</button>
        <button className="px-4 py-2 border rounded-full text-sm">Open Now</button>
        <button className="px-4 py-2 border rounded-full text-sm">Price</button>
        <button className="px-4 py-2 border rounded-full text-sm">Hours</button>
      </div>

      {/* Results list */}
      <div className="bg-white">
        {dummyMedspas.map((medspa) => (
          <div key={medspa.id} className="p-4 border-b">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <h3 className="font-medium">{medspa.name}</h3>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-red-500">★</span>
                  <span>{medspa.rating}</span>
                  <span className="text-gray-500">({medspa.reviewCount} reviews)</span>
                </div>
                <div className="text-sm text-gray-500">{medspa.services.join(", ")}</div>
                <div className="text-sm text-gray-500">{medspa.address}</div>
                <div className="text-sm text-gray-500">{medspa.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
