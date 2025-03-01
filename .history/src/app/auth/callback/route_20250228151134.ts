// app/auth/callback/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

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
    try {
      const supabase = await (createClient());
      const { error: supabaseError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (supabaseError) {
        console.error('Supabase auth error:', supabaseError);
        return NextResponse.redirect(`${requestUrl.origin}?auth_error=${supabaseError.message}`);
      }
    } catch (err) {
      console.error('Unexpected auth error:', err);
      return NextResponse.redirect(`${requestUrl.origin}?auth_error=unexpected_error`);
    }
  }

  return NextResponse.redirect(requestUrl.origin);
}
