/* eslint-disable @typescript-eslint/no-unused-vars */
import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import SearchContent from './SearchContent';

export const metadata: Metadata = {
  title: 'Search - Asentica',
  description: 'Search for medical spas and treatments',
};

// Configure the page for dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

interface SearchParams {
  q?: string;
}

interface PageProps {
  searchParams: SearchParams;
}

export default async function Page({ searchParams }: PageProps) {
  const searchQuery = searchParams.q || '';
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
        google_rating,
        yelp_rating,
        good_reviews,
        bad_reviews,
        best_treatment,
        price1,
        treatment1,
        price2,
        treatment2,
        price3,
        treatment3,
        price4,
        treatment4,
        price5,
        treatment5,
        price6,
        treatment6
      `)
      .or(`best_treatment.ilike.%${searchQuery}%,medspa_name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`)
      .limit(20);
      
    console.log("✅ Supabase data:", medspaData);
    
    if (error) {
      throw error;
    }

    return <SearchContent initialData={medspaData || []} searchQuery={searchQuery} />;
  } catch (error) {
    console.error("❌ Unexpected error in search page:", error);
    return <SearchContent initialData={[]} searchQuery={searchQuery} error={error} />;
  }
}