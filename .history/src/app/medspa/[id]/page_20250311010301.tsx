import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import MedspaDetail from './MedspaDetail';

export const metadata: Metadata = {
  title: 'MedSpa Details - Asentica',
  description: 'View detailed information about medical spas',
};

// Configure the page for dynamic rendering
export const dynamic = 'force-dynamic';

// Define params type for Next.js 15
type PageParams = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageParams) {
  // First await the params object, then access the id property
  const resolvedParams = await params;
  const id = resolvedParams.id;
  console.log(`🔍 Loading MedSpa details for ID: ${id}`);

  try {
    const supabase = await createClient();
    console.log("✅ Supabase client initialized");

    const { data: medspaData, error } = await supabase
      .from('medspa_nyc')
      .select('*')
      .eq('id', id)
      .single();
      
    console.log("✅ Supabase data:", medspaData);
    
    if (error || !medspaData) {
      console.error("❌ Error fetching MedSpa data:", error);
      return notFound();
    }

    return <MedspaDetail medspa={medspaData} />;
  } catch (error) {
    console.error("❌ Unexpected error in MedSpa detail page:", error);
    return notFound();
  }
}
