import { createBrowserClient } from '@supabase/ssr';

// 현재 브라우저의 origin을 전역 변수로 설정
if (typeof window !== 'undefined') {
  // @ts-expect-error - 전역 객체에 사용자 정의 속성 추가
  window.SITE_URL = window.location.origin;
  console.log('Setting global SITE_URL:', window.location.origin);
}

// Supabase 클라이언트 생성
export const createClient = () => {
  try {
    console.log('Creating Supabase browser client...');
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase configuration');
    }

    const client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          flowType: 'pkce',
          detectSessionInUrl: true,
          autoRefreshToken: true,
          persistSession: true,
          storage: {
            getItem: (key) => {
              if (typeof window === 'undefined') return null;
              return window.localStorage.getItem(key);
            },
            setItem: (key, value) => {
              if (typeof window === 'undefined') return;
              window.localStorage.setItem(key, value);
            },
            removeItem: (key) => {
              if (typeof window === 'undefined') return;
              window.localStorage.removeItem(key);
            },
          },
        },
      }
    );

    console.log('Supabase browser client created successfully');
    return client;
  } catch (error) {
    console.error('Error creating Supabase browser client:', error);
    throw error;
  }
};

// ✅ 검색 함수 추가 (Trigram Index 기반 검색)
export const searchTreatments = async (query: string) => {
  try {
    const supabase = createClient();

    if (!query.trim()) return [];

    console.log('Searching for treatments with query:', query);

    const { data, error } = await supabase
      .from('price_test')
      .select('*')
      .or(`
        treatment_name.ilike.%${query}%,
        treatment_category.ilike.%${query}%,
        efficacy.ilike.%${query}%
      `)
      .limit(10);

    if (error) {
      console.error('Error fetching price data:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return [];
    }

    console.log('🔎 Search results:', data?.length || 0, 'items found');
    return data || [];
  } catch (err) {
    console.error('Unexpected error in searchTreatments:', err);
    return [];
  }
};