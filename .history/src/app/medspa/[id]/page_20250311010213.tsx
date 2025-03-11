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
      .select(`
        id,
        medspa_name,
        location,
        village,
        number,
        website,
        verified,
        best_treatment,
        best_treatment1,
        best_treatment2,
        best_treatment3,
        google_star,
        google_review,
        yelp_star,
        yelp_review,
        free_consultation,
        good_review_short,
        good_review_deepdive1,
        good_review_deepdive2,
        good_review_deepdive3,
        good_review_deepdive1_explanation,
        good_review_deepdive2_explanation,
        good_review_deepdive3_explanation,
        bad_review_short,
        bad_review_deepdive,
        bad_review_deepdive1,
        bad_review_deepdive2,
        bad_review_deepdive3,
        bad_review_deepdive1_explanation,
        bad_review_deepdive2_explanation,
        bad_review_deepdive3_explanation,
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
        lng,
        review1_author,
        review1_author_photo,
        review1_text,
        review1_date,
        review2_rating,
        review2_author,
        review2_author_photo,
        review2_text,
        review2_date,
        review3_rating,
        review3_author,
        review3_author_photo,
        review3_text,
        review3_date,
        review4_rating,
        review4_author,
        review4_author_photo,
        review4_text,
        review4_date,
        review5_rating,
        review5_author,
        review5_author_photo,
        review5_text,
        review5_date
      `)
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
