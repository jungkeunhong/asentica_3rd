// app/auth/callback/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const redirectPath = requestUrl.searchParams.get('redirectPath') || '/search';

  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(`${requestUrl.origin}?auth_error=${error}`);
  }
  
  if (code) {
    try {
      const supabase = await createClient();
      const { error: supabaseError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (supabaseError) {
        console.error('Supabase auth error:', supabaseError);
        return NextResponse.redirect(`${requestUrl.origin}?auth_error=${supabaseError.message}`);
      }
      
      // 성공적으로 로그인한 경우 search 페이지로 리디렉션
      console.log('로그인 성공, 리디렉션 경로:', `${requestUrl.origin}${redirectPath}`);
      return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`);
    } catch (err) {
      console.error('Unexpected auth error:', err);
      return NextResponse.redirect(`${requestUrl.origin}?auth_error=unexpected_error`);
    }
  }

  // 코드가 없는 경우에도 search 페이지로 리디렉션
  return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`);
}
