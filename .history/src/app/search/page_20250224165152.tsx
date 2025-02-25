import { createClient } from '@/utils/supabase/server';

export default async function Page({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || "";
  const supabase = createClient();

  // ✅ id 대신 UUID 사용
  const { data: medspaData, error } = await supabase
    .from('medspa_NYC_info')
    .select(`
      UUID,  -- ✅ 기존 id 대신 UUID 사용
      medspa_name,
      location,
      website,
      google_star,
      google_review,
      yelp_star,
      yelp_review,
      best_treatment
    `)
    .ilike('best_treatment', `%${query}%`); // ✅ Botox 등 키워드 검색

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