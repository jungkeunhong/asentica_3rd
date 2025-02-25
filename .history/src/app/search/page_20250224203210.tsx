import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Page({ searchParams }: { searchParams: { q?: string } }) {
  try {
    console.log("🔍 Starting search page...");

    const query = searchParams?.q || "";
    console.log(`🔍 Received search query: ${query}`);

    const cookieStore = cookies(); // ✅ 쿠키 가져오기 (SSR 지원)
    const supabase = await createClient(cookieStore); // ✅ Supabase 클라이언트 생성
    console.log("✅ Supabase client initialized");

    const { data: medspaData, error } = await supabase
      .from('medspa_NYC_info')
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
      .filter('best_treatment', 'ilike', `%,${query},%`) // ✅ "Botox"가 중간에 포함된 경우 검색
      .or(
        `best_treatment.ilike.%${query}%, 
         best_treatment.ilike.%${query}\n%, 
         best_treatment.ilike.%\n${query}%`
      ); // ✅ `\n` 포함된 데이터 대응
      
    if (error) {
      console.error("❌ Error fetching Medspa data:", error);
      return <div>Failed to load Medspa data: {error.message}</div>;
    }

    console.log("✅ Medspa data successfully fetched:", medspaData);

    return (
      <div>
        <h1>Search Results for "{query}"</h1>
        {medspaData.length === 0 ? <p>No results found.</p> : (
          <ul>
            {medspaData.map((medspa) => (
              <li key={medspa.UUID}>
                <h3>{medspa.medspa_name}</h3>
                <p>Location: {medspa.location}</p>
                <p>Rating: {medspa.google_star} ⭐ ({medspa.google_review} reviews)</p>
                <p>Yelp: {medspa.yelp_star} ⭐ ({medspa.yelp_review} reviews)</p>
                <p>Best Treatment: {medspa.best_treatment}</p>
                <a href={medspa.website} target="_blank" rel="noopener noreferrer">Visit Website</a>
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