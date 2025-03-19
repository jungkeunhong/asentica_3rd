'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFavorites } from '@/context/FavoritesContext';
import { ChevronLeftIcon, Heart, Star, ArrowLeft, LogOut } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { createClient } from '@/utils/supabase/client';
import LoginModal from '@/components/LoginModal';

export default function MyPage() {
  const { favorites } = useFavorites();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Check authentication status when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Set user data if logged in
          const { user: authUser } = session;
          
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
        } else {
          // Show login modal if not logged in
          setShowLoginModal(true);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Handle successful login
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Fetch user data after login
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { user: authUser } = session;
        
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
    };
    fetchUser();
  };
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = '/'; // Redirect to home page after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#754731]"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      
      {/* Only show MyPage content if user is logged in */}
      {user && (
        <div className="container mx-auto px-4 py-8 pt-24">
          <Link href="/" className="inline-flex items-center text-[#754731] mb-6 hover:underline">
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
          </Link>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* User Profile Section */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
                    <Image 
                      src={user.avatar_url} 
                      alt="Profile" 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-semibold text-[#754731]">{user.name}</h2>
                  <p className="text-gray-400 text-xs mt-1">Skincare journey since {user.created_at}</p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 text-[#754731] mr-2" />
                      <span className="text-gray-700">Favorites</span>
                    </div>
                    <span className="bg-[#F5EBE0] text-[#754731] px-2 py-1 rounded-full text-xs font-medium">
                      {favorites.length}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleSignOut}
                  className="w-full mt-6 flex items-center justify-center gap-2 bg-[#F5EBE0] hover:bg-[#EAD7C7] text-[#754731] py-2 px-4 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
            
            {/* Favorites Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#754731] mb-6">My Favorites</h2>
                
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                ) : (
                  <div className="text-center py-10">
                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">You haven't added any favorites yet</p>
                    <Link href="/" className="mt-4 inline-block text-[#754731] hover:underline">
                      Explore MedSpas
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
