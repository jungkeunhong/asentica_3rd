// app/auth/callback/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/my-page';

  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(`/?auth_error=${error}`);
  }
  
  if (code) {
    try {
      const supabase = await createClient();
      const { error: supabaseError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (supabaseError) {
        console.error('Supabase auth error:', supabaseError);
        return NextResponse.redirect(`/?auth_error=${supabaseError.message}`);
      }
      
      // 성공적으로 로그인한 경우 redirectTo 경로로 리디렉션
      console.log('로그인 성공, 리디렉션 경로:', redirectTo);
      return NextResponse.redirect(redirectTo);
    } catch (err) {
      console.error('Unexpected auth error:', err);
      return NextResponse.redirect(`/?auth_error=unexpected_error`);
    }
  }

  // 코드가 없는 경우에도 redirectTo 경로로 리디렉션
  return NextResponse.redirect(redirectTo);
}
