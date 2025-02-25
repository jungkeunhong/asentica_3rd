import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Page({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams?.q || ""; // ✅ searchParams 안전하게 처리
  const cookieStore = cookies(); // ✅ 쿠키 가져오기 (SSR에서 Supabase 인증 가능하게)
  const supabase = createClient(cookieStore); // ✅ SSR에서 Supabase 클라이언트 생성

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
    .ilike('best_treatment', `%${query}%`); // ✅ Botox 같은 검색어 필터링

  if (error) {
    console.error('Error fetching Medspa data:', error.message || error);
    return <div>Failed to load Medspa data: {error.message}</div>;
  }

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
              <a href={medspa.website} target="_blank">Visit Website</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}