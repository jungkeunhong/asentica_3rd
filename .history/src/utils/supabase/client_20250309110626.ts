import { createBrowserClient } from '@supabase/ssr';

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
            getItem: (key) => (typeof window === 'undefined' ? null : window.localStorage.getItem(key)),
            setItem: (key, value) => (typeof window === 'undefined' ? null : window.localStorage.setItem(key, value)),
            removeItem: (key) => (typeof window === 'undefined' ? null : window.localStorage.removeItem(key)),
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