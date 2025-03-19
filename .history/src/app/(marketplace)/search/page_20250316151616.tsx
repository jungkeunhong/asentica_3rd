import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import SearchContent from '@/components/marketplace/SearchContent';

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
        .select('*')
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
        console.error("Error fetching price data:", {
          error: priceError,
          message: priceError.message,
          details: priceError.details,
          hint: priceError.hint
        });
      } else {
        priceData = filteredPriceData;
      }
    } else {
      // If no search query, get all medspas
      const { data, error } = await supabase
        .from('medspa_nyc')
        .select('*');
      
      if (error) {
        throw new Error(error.message);
      }
      
      medspaData = data;
      
      // Get all price data
      const { data: allPriceData, error: priceError } = await supabase
        .from('price_test')
        .select('*');
      
      if (priceError) {
        console.error("Error fetching price data:", priceError);
      } else {
        priceData = allPriceData;
      }
    }
    
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