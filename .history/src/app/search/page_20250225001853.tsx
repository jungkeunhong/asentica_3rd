/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import SearchContent from './SearchContent';

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
      .from('medspa_nyc')
      .select(`
        id,
        medspa_name,
        location,
        village,
        number,
        website,
        verified,
        best_treatment,
        google_star,
        google_review,
        yelp_star,
        yelp_review,
        free_consultation,
        good_review_short,
        good_review_deepdive1,
        good_review_deepdive2,
        good_review_deepdive3,
        bad_review_short,
        bad_review_deepdive,
        bad_review_deepdive1,
        bad_review_deepdive2,
        bad_review_deepdive3,
        recommended_practitioner1_name,
        recommended_practitioner1_reason,
        recommended_practitioner2_name,
        recommended_practitioner2_reason,
        recommended_practitioner3_name,
        recommended_practitioner3_reason,
        treatment1,
        price1,
        treatment2,
        price2,
        treatment3,
        price3,
        treatment4,
        price4,
        treatment5,
        price5,
        treatment6,
        price6
      `)
      .or(`best_treatment.ilike.%${searchQuery}%,medspa_name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`)
      .limit(20); 
      
    console.log("✅ Query executed:", searchQuery);
    console.log("✅ Supabase data:", medspaData);
    console.log("✅ Supabase error:", error);

    if (error) {
      console.error("❌ Error fetching Medspa data:", error);
      return <div>Failed to load Medspa data: {error.message}</div>;
    }

    // Pass both the data and searchQuery to SearchContent component
    return <SearchContent initialMedspas={medspaData || []} searchQuery={searchQuery} />;

  } catch (err) {
    console.error("❌ Unexpected error in search page:", err);
    return <div>Unexpected error occurred. Please try again.</div>;
  }
}