import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import SearchContent from './SearchContent';

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

    let medspaData;
    let priceData;
    
    // Only apply filtering if there's a search query
    if (searchQuery) {
      // Fetch medspa data
      const { data: filteredData, error: filteredError } = await supabase
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
          image_url1,
          image_url2,
          image_url3,
          lat,
          lng
        `)
        .or(`medspa_name.ilike.%${searchQuery}%,village.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,best_treatment.ilike.%${searchQuery}%,treatment1.ilike.%${searchQuery}%,treatment2.ilike.%${searchQuery}%,treatment3.ilike.%${searchQuery}%,treatment4.ilike.%${searchQuery}%,treatment5.ilike.%${searchQuery}%,treatment6.ilike.%${searchQuery}%,recommended_practitioner1_name.ilike.%${searchQuery}%,recommended_practitioner2_name.ilike.%${searchQuery}%,recommended_practitioner3_name.ilike.%${searchQuery}%`);

      if (filteredError) {
        throw new Error(filteredError.message);
      }
      
      medspaData = filteredData;
      
      // Fetch price data from price_test table
      const { data: filteredPriceData, error: priceError } = await supabase
        .from('price_test')
        .select('*')
        .or(`treatment_name.ilike.%${searchQuery}%,treatment_category.ilike.%${searchQuery}%,efficacy.ilike.%${searchQuery}%`);
      
      if (priceError) {
        console.error("Error fetching price data:", priceError);
      } else {
        priceData = filteredPriceData;
        console.log(`💰 Found ${priceData?.length || 0} price records for query: "${searchQuery}"`);
      }
    } else {
      // If no search query, get all medspas
      const { data, error } = await supabase
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
        `);
      
      if (error) {
        throw new Error(error.message);
      }
      
      medspaData = data;
      
      // Get a sample of price data (limit to avoid too much data)
      const { data: samplePriceData, error: priceError } = await supabase
        .from('price_test')
        .select('*')
        .limit(100);
      
      if (priceError) {
        console.error("Error fetching price data:", priceError);
      } else {
        priceData = samplePriceData;
        console.log(`💰 Loaded ${priceData?.length || 0} sample price records`);
      }
    }
    
    console.log("✅ Supabase data:", medspaData?.map(m => ({
      id: m.id,
      name: m.medspa_name,
      lat: m.lat,
      lng: m.lng
    })));
    
    return <SearchContent 
      initialMedspas={medspaData || []} 
      searchQuery={searchQuery} 
      priceData={priceData || []}
    />;
  } catch (error) {
    console.error("❌ Unexpected error in search page:", error);
    return <SearchContent initialMedspas={[]} searchQuery={searchQuery} priceData={[]} />;
  }
}