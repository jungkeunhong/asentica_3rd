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
        console.log('Price data fetch result:', {
          hasData: !!filteredPriceData,
          count: filteredPriceData?.length || 0,
          sample: filteredPriceData?.[0]
        });
        // Add more detailed logging about the price data
        if (priceData && priceData.length > 0) {
          console.log('Sample price data:', priceData[0]);
          // Log medspa names in price data to help with debugging matching issues
          const medspaNamesInPriceData = [...new Set(priceData.map(p => p.medspa_name))];
          console.log('Medspa names in price data:', medspaNamesInPriceData);
        } else {
          console.log('No price data found for the query');
        }
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
        console.log(`💰 Loaded ${priceData?.length || 0} price records`);
        // Log medspa names in price data to help with debugging matching issues
        if (priceData && priceData.length > 0) {
          const medspaNamesInPriceData = [...new Set(priceData.map(p => p.medspa_name))];
          console.log('Medspa names in price data:', medspaNamesInPriceData);
        }
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