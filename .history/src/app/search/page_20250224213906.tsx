import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import SearchContent from '@/components/SearchContent'; // ✅ SearchContent 컴포넌트 불러오기

interface SearchParams {
  q?: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  try {
    console.log("🔍 Starting search page...");

    const searchQuery = (searchParams.q || '').toLowerCase().trim();
    console.log(`🔍 Received search query: ${searchQuery}`);

    const cookieStore = cookies();
    const supabase = await createClient();
    console.log("✅ Supabase client initialized");

    const { data: medspaData, error } = await supabase
      .from('medspa_nyc_info')
      .select(`
        id,
        medspa_name,
        location,
        website,
        google_star,
        google_review,
        yelp_star,
        yelp_review,
        best_treatment
      `)
      .ilike('best_treatment', `%${searchQuery}%`);

    console.log("✅ Query executed:", searchQuery);
    console.log("✅ Supabase data:", medspaData);
    console.log("✅ Supabase error:", error);

    if (error) {
      console.error("❌ Error fetching Medspa data:", error);
      return <div>Failed to load Medspa data: {error.message}</div>;
    }

    console.log("✅ Medspa data successfully fetched:", medspaData);

    // ✅ 데이터를 `SearchContent` 컴포넌트로 전달
    return <SearchContent initialMedspas={medspaData || []} />;
  } catch (err) {
    console.error("❌ Unexpected error in search page:", err);
    return <div>Unexpected error occurred. Please try again.</div>;
  }
}