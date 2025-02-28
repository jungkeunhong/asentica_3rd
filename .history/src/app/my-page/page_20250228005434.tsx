'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFavorites } from '@/context/FavoritesContext';
import { User, Heart, MapPin, Star, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function MyPage() {
  const { favorites } = useFavorites();
  const [userName, setUserName] = useState('Guest User');
  const [userImage, setUserImage] = useState('/placeholder-user.jpg');
  
  // For demo purposes, we'll use a placeholder user
  // In a real app, this would come from authentication
  
  return (
    <div className="min-h-screen bg-[var(--beige-bg)]">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Back button */}
        <Link href="/" className="flex items-center text-[#754731] mb-6">
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to Home</span>
        </Link>
        
        {/* Profile header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-4">
              <Image
                src={userImage}
                alt="User profile"
                fill
                className="rounded-full object-cover border-2 border-[#754731]"
              />
              <button 
                className="absolute bottom-0 right-0 bg-[#754731] text-white rounded-full p-1"
                aria-label="Edit profile picture"
              >
                <User size={16} />
              </button>
            </div>
            <h1 className="cormorant text-2xl font-semibold text-[#333333] mb-1">{userName}</h1>
            <p className="text-[#666666] text-sm mb-4">Member since February 2025</p>
            
            <div className="flex gap-8 text-center">
              <div>
                <p className="text-xl font-semibold text-[#754731]">{favorites.length}</p>
                <p className="text-sm text-[#666666]">Favorites</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-[#754731]">0</p>
                <p className="text-sm text-[#666666]">Visits</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-[#754731]">0</p>
                <p className="text-sm text-[#666666]">Reviews</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Favorite MedSpas */}
        <div className="mb-8">
          <h2 className="cormorant text-2xl font-semibold text-[#333333] mb-4">My Favorite MedSpas</h2>
          
          {favorites.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <Heart className="mx-auto mb-4 text-gray-300" size={48} />
              <p className="text-[#666666] mb-2">You haven't saved any favorites yet</p>
              <p className="text-sm text-[#999999] mb-4">
                Browse MedSpas and click the heart icon to save your favorites
              </p>
              <Link 
                href="/"
                className="inline-block px-6 py-2 bg-[#754731] text-white rounded-md hover:bg-[#5d3926] transition-colors"
              >
                Explore MedSpas
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((medspa) => (
                <Link 
                  href={`/medspa/${medspa.id}`} 
                  key={medspa.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={medspa.image_url1 || '/placeholder-medspa.jpg'}
                      alt={medspa.medspa_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="cormorant text-xl font-semibold text-[#333333] mb-1">
                      {medspa.medspa_name}
                    </h3>
                    <div className="flex items-center text-[#666666] text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{medspa.village}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {medspa.google_star && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                          <span className="text-sm text-[#666666]">
                            {medspa.google_star} ({medspa.google_review || 0})
                          </span>
                        </div>
                      )}
                      {medspa.yelp_star && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-red-500 fill-red-500 mr-1" />
                          <span className="text-sm text-[#666666]">
                            {medspa.yelp_star} ({medspa.yelp_review || 0})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* Recent Activity - Placeholder for future feature */}
        <div>
          <h2 className="cormorant text-2xl font-semibold text-[#333333] mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-[#666666]">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
