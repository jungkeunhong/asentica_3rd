import { createBrowserClient } from '@supabase/ssr';

// Supabase 클라이언트 생성
export const createClient = () => {
  try {
    console.log('Creating Supabase browser client...');
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase configuration');
    }

    // 현재 브라우저의 origin을 사이트 URL로 사용
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    console.log('Using site URL for Supabase client:', siteUrl);

    const client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          flowType: 'pkce',
          detectSessionInUrl: true,
          autoRefreshToken: true,
          persistSession: true,
          // 사이트 URL 설정 추가
          site_url: siteUrl,
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
  const supabase = createClient();

  if (!query.trim()) return [];

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
    return [];
  }

  console.log('🔎 Search results:', data);
  return data;
};