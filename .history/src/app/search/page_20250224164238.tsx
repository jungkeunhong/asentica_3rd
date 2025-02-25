import { createClient } from '@/utils/supabase/server';
import SearchContent from './SearchContent';

export default async function Page() {
  const supabase = createClient();
  
  const { data: medspaData, error } = await supabase
    .from('medspa_NYC_info')
    .select(`
      id,
      name,
      title,
      clinic,
      image,
      rating,
      location,
      highlights,
      expertise
    `);

  if (error) {
    console.error('Error fetching Medspa data:', error);
    return <div>Failed to load Medspa data.</div>;
  }

  return <SearchContent initialDoctors={medspaData || []} />;
}