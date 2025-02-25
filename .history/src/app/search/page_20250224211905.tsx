import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

interface SearchParams {
  q?: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  try {
    console.log("🔍 Starting search page...");

    // Await searchParams according to Next.js 15 guidelines
    const { q } = await searchParams;
    const searchQuery = (q || '').toLowerCase().trim();
    console.log(`🔍 Received search query: ${searchQuery}`);

    const cookieStore = cookies();
    const supabase = await createClient();
    console.log("✅ Supabase client initialized");

    const { data: medspaData, error } = await supabase
      .from('medspa_nyc_info')
      .select(`
        UUID,
        medspa_name,
        location,
        website,
        google_star,
        google_review,
        yelp_star,
        yelp_review,
        best_treatment
      `)
      .or(`best_treatment.ilike.%${searchQuery}%,medspa_name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);

    console.log("✅ Query executed:", searchQuery);
    console.log("✅ Supabase data:", medspaData);
    console.log("✅ Supabase error:", error);

    if (error) {
      console.error("❌ Error fetching Medspa data:", error);
      return <div>Failed to load Medspa data: {error.message}</div>;
    }

    console.log("✅ Medspa data successfully fetched:", medspaData);

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {searchQuery ? `Search Results for "${searchQuery}"` : "All Medspas"}
        </h1>
        {medspaData.length === 0 ? (
          <p className="text-gray-600">No results found.</p>
        ) : (
          <ul className="space-y-6">
            {medspaData.map((medspa) => (
              <li key={medspa.UUID} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900">{medspa.medspa_name}</h3>
                <p className="text-gray-600 mt-2">📍 {medspa.location}</p>
                <div className="mt-3 space-y-2">
                  <p className="text-gray-700">
                    Google: {medspa.google_star} ⭐ ({medspa.google_review} reviews)
                  </p>
                  <p className="text-gray-700">
                    Yelp: {medspa.yelp_star} ⭐ ({medspa.yelp_review} reviews)
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Best Treatment:</span> {medspa.best_treatment}
                  </p>
                </div>
                <a 
                  href={medspa.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Visit Website →
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  } catch (err) {
    console.error("❌ Unexpected error in search page:", err);
    return <div>Unexpected error occurred. Please try again.</div>;
  }
}