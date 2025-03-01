import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import SearchContent from './SearchContent';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Search - Asentica',
  description: 'Search for medical spas and treatments',
};

// Configure the page for dynamic rendering
export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // Await searchParams
  const params = await searchParams;
  const searchQuery = params.q || '';
  console.log("🔍 Starting search page...");

  try {
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
        price6,
        image_url1,
        image_url2,
        image_url3,
        lat,
        lng
      `)
      .filter('best_treatment', 'ilike', `%${searchQuery}%`)
      .limit(20);
      
    console.log("✅ Supabase data:", medspaData?.map(m => ({
      id: m.id,
      name: m.medspa_name,
      lat: m.lat,
      lng: m.lng
    })));
    
    if (error) {
      throw new Error(error.message);
    }

    return <SearchContent initialMedspas={medspaData || []} searchQuery={searchQuery} />;
  } catch (error) {
    console.error("❌ Unexpected error in search page:", error);
    return <SearchContent initialMedspas={[]} searchQuery={searchQuery} />;
  }
}