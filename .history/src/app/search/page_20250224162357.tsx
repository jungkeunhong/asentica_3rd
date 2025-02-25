mport { createClient } from '@/utils/supabase/server';
import SearchContent from './SearchContent';

export default async function Page() {
  const supabase = createClient();
  
  // 서버에서 데이터 가져오기
  const { data: doctors, error } = await supabase
    .from('doctors')
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
    console.error('Error fetching doctors:', error);
    return <div>Failed to load doctors.</div>;
  }

  // 클라이언트 컴포넌트로 데이터 전달
  return <SearchContent initialDoctors={doctors || []} />;
}