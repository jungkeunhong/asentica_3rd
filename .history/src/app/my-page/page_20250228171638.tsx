'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFavorites } from '@/context/FavoritesContext';
import { User, Heart, MapPin, Star, ArrowLeft, LogOut } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { createClient } from '@/utils/supabase/client';

export default function MyPage() {
  const { favorites } = useFavorites();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user from session
          const { user: authUser } = session;
          
          // If you have additional user data in a profiles table, fetch it
          // const { data: profile } = await supabase
          //   .from('profiles')
          //   .select('*')
          //   .eq('id', authUser.id)
          //   .single();
          
          setUser({
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
            avatar_url: authUser.user_metadata?.avatar_url || '/placeholder-user.jpg',
            created_at: new Date(authUser.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long'
            })
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = '/'; // Redirect to home page after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--beige-bg)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#754731]"></div>
      </div>
    );
  }
  
  // If no user is logged in, show a prompt to log in
  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--beige-bg)]">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <Link href="/" className="flex items-center text-[#754731] mb-6">
            <ArrowLeft size={20} className="mr-2" />
          </Link>
          
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <User className="mx-auto mb-4 text-[#754731]" size={48} />
            <h1 className="cormorant text-2xl font-semibold text-[#333333] mb-2">Sign in to view your profile</h1>
            <p className="text-[#666666] mb-6">You need to be logged in to view and manage your profile</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 bg-[#754731] text-white rounded-md hover:bg-[#5d3926] transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[var(--beige-bg)]">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Back button */}
        <Link href="/" className="flex items-center text-[#754731] mb-6">
          <ArrowLeft size={20} className="mr-2" />
        </Link>
        
        {/* Profile header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-4">
              <Image
                src={user.avatar_url}
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
            <h1 className="cormorant text-2xl font-semibold text-[#333333] mb-1">{user.name}</h1>
            <p className="text-[#666666] text-sm mb-2">{user.email}</p>
            <p className="text-[#666666] text-sm mb-4">Member since {user.created_at}</p>
            
            <div className="flex gap-8 text-center mb-4">
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
            
            <button 
              onClick={handleSignOut}
              className="flex items-center text-[#754731] hover:text-[#5d3926] transition-colors"
            >
              <LogOut size={16} className="mr-1" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
        
        {/* Favorite MedSpas */}
        <div className="mb-8">
          <h2 className="cormorant text-2xl font-semibold text-[#333333] mb-4">My Favorite MedSpas</h2>
          
          {favorites.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <Heart className="mx-auto mb-4 text-gray-300" size={48} />
              <p className="text-[#666666] mb-2">You haven&apos;t saved any favorites yet</p>
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
              {favorites.map((favorite) => (
                <Link href={`/medspa/${favorite.id}`} key={favorite.id} className="block">
                  <div className="bg-[#F9F5F1] rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-40 w-full">
                      <Image
                        src={favorite.image_url1 || '/placeholder-medspa.jpg'}
                        alt={favorite.medspa_name || favorite.name || 'MedSpa'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-[#754731]">{favorite.medspa_name || favorite.name || 'MedSpa'}</h3>
                      <p className="text-gray-500 text-sm mt-1">{favorite.location || favorite.village || 'Location not available'}</p>
                      <div className="flex items-center mt-2">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-700">{favorite.google_star || favorite.rating || '0.0'}</span>
                      </div>
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
