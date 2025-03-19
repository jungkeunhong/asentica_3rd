import { createClient } from '@/utils/supabase/server';
import SearchContent from './SearchContent';

export default async function Page() {
  const supabase = createClient();
  
  // ✅ 테이블 이름을 'medspa_NYC_info'로 변경
  const { data: medspaData, error } = await supabase
    .from('medspa_NYC_info') // ✅ 테이블명 수정
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