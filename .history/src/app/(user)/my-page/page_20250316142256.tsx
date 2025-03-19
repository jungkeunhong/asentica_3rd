import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function MyPage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // Redirect to home page if not authenticated
    redirect('/');
  }
  
  // Fetch user data from both auth and profiles table
  const { data: userData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  
  // If profile data doesn't exist, use auth metadata
  const userProfile = userData || {
    full_name: session.user.user_metadata?.full_name || 'Not set',
    avatar_url: session.user.user_metadata?.avatar_url || '/placeholder-user.jpg',
    gender: session.user.user_metadata?.gender,
    age_range: session.user.user_metadata?.age_range,
    skin_type: session.user.user_metadata?.skin_type,
    ethnicity: session.user.user_metadata?.ethnicity,
    skin_concerns: session.user.user_metadata?.skin_concerns || []
  };
  
  // Fetch user's favorites
  const { data: favorites } = await supabase
    .from('favorites')
    .select('medspa_id, created_at')
    .eq('user_id', session.user.id);
  
  // Fetch consultation requests
  const { data: consultations } = await supabase
    .from('consultation_requests')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Profile</h2>
            <Link 
              href="/my-page/edit" 
              className="px-4 py-2 bg-amber-900 text-white rounded-md text-sm hover:bg-amber-800 transition-colors"
            >
              Edit Profile
            </Link>
          </div>
          
          {/* Profile Avatar */}
          <div className="flex items-center mb-6">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4">
              <Image 
                src={userProfile.avatar_url || '/placeholder-user.jpg'} 
                alt="Profile" 
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-lg">{userProfile.full_name}</h3>
              <p className="text-gray-600">{session.user.email}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {userProfile.gender && (
              <div>
                <p className="text-gray-600">Gender</p>
                <p className="font-medium">{userProfile.gender}</p>
              </div>
            )}
            
            {userProfile.age_range && (
              <div>
                <p className="text-gray-600">Age Range</p>
                <p className="font-medium">{userProfile.age_range}</p>
              </div>
            )}
            
            {userProfile.skin_type && (
              <div>
                <p className="text-gray-600">Skin Type</p>
                <p className="font-medium">{userProfile.skin_type}</p>
              </div>
            )}
            
            {userProfile.ethnicity && (
              <div>
                <p className="text-gray-600">Ethnicity</p>
                <p className="font-medium">{userProfile.ethnicity}</p>
              </div>
            )}
            
            {userProfile.skin_concerns && userProfile.skin_concerns.length > 0 && (
              <div>
                <p className="text-gray-600">Skin Concerns</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {userProfile.skin_concerns.map((concern: string) => (
                    <span key={concern} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                      {concern}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Favorites Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Favorites</h2>
          {favorites && favorites.length > 0 ? (
            <p>{favorites.length} saved MedSpas</p>
          ) : (
            <p className="text-gray-500">No favorites yet</p>
          )}
        </div>
        
        {/* Consultations Section */}
        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Consultation Requests</h2>
          {consultations && consultations.length > 0 ? (
            <div className="space-y-4">
              {consultations.map((consultation) => (
                <div key={consultation.consultation_id} className="border-b pb-4">
                  <p className="font-medium">{consultation.medspa_name || 'Unknown MedSpa'}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(consultation.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-2">Status: <span className="text-amber-600">Pending</span></p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No consultation requests yet</p>
          )}
        </div>
      </div>
    </div>
  );
} 