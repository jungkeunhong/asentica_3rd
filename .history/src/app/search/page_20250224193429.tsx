'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import SearchContent from './SearchContent';

export default function Page() {
  const searchParams = useSearchParams(); // ✅ searchParams를 useSearchParams()로 변경
  const query = searchParams.get('q') || ""; // ✅ get()을 사용하여 값 가져오기
  const [medspaData, setMedspaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient(); // ✅ Supabase 클라이언트 생성

      const { data, error } = await supabase
        .from('medspa_NYC_info')
        .select(`
          UUID,
          medspa_name,
          location,
          website,
          google_star,
          google_review,
          yelp_star,
          yelp_review,
          best_treatment
        `)
        .ilike('best_treatment', `%${query}%`); // ✅ Botox 같은 검색어 필터링

      if (error) {
        console.error('Error fetching Medspa data:', error.message || error);
        setError(error.message);
      } else {
        setMedspaData(data || []);
      }
      setLoading(false);
    }

    fetchData();
  }, [query]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Failed to load Medspa data: {error}</div>;

  return <SearchContent initialMedspas={medspaData} />;
}