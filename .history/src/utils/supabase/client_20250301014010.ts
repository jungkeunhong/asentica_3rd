import { createBrowserClient } from '@supabase/ssr';

// Create a Supabase client for browser environments
export const createClient = () => {
  try {
    console.log('Creating Supabase browser client...');
    
    // Check if environment variables are defined
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
      throw new Error('Missing Supabase URL configuration');
    }
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
      throw new Error('Missing Supabase key configuration');
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
          cookies: {
            name: 'sb-auth-token',
            lifetime: 60 * 60 * 8,
            domain: '',
            path: '/',
            sameSite: 'lax'
          }
        }
      }
    );
    
    console.log('Supabase browser client created successfully');
    return client;
  } catch (error) {
    console.error('Error creating Supabase browser client:', error);
    throw error;
  }
};