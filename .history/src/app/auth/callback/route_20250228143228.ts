import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(`${requestUrl.origin}?auth_error=${error}`);
  }
  
  if (code) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    try {
      const { error: supabaseError } = await (await supabase).auth.exchangeCodeForSession(code);
      
      if (supabaseError) {
        console.error('Supabase auth error:', supabaseError);
        return NextResponse.redirect(`${requestUrl.origin}?auth_error=${supabaseError.message}`);
      }
    } catch (err) {
      console.error('Unexpected auth error:', err);
      return NextResponse.redirect(`${requestUrl.origin}?auth_error=unexpected_error`);
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin);
}
