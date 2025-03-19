import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export default async function MyPage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // Redirect to home page if not authenticated
    redirect('/');
  }
  
  // Fetch user data
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  
  // Fetch user's favorites
  const { data: favorites, error: favoritesError } = await supabase
    .from('favorites')
    .select('medspa_id, created_at')
    .eq('user_id', session.user.id);
  
  // Fetch consultation requests
  const { data: consultations, error: consultationsError } = await supabase
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
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{session.user.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium">{userData?.full_name || 'Not set'}</p>
            </div>
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