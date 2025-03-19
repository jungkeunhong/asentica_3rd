// app/auth/callback/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // URL 파라미터 추출
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectParam = requestUrl.searchParams.get('redirectTo');
  
  // 디버깅을 위한 로그
  console.log('Auth callback triggered');
  console.log('Code present:', !!code);
  console.log('Redirect param:', redirectParam);
  
  // 환경 변수에서 사이트 URL 가져오기
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                  (process.env.NEXT_PUBLIC_VERCEL_URL ? 
                    `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 
                    'http://localhost:3000');
  
  console.log('Site URL from env:', siteUrl);
  
  // 기본 리다이렉트 URL 설정
  let redirectTo = `${siteUrl}/my-page`;
  
  // redirectParam이 있으면 사용
  if (redirectParam) {
    // localhost 리다이렉트 처리 (프로덕션 환경에서는 허용하지 않음)
    if (redirectParam.includes('localhost') && !siteUrl.includes('localhost')) {
      console.log('Localhost redirect detected in production, using default redirect');
    } else {
      redirectTo = redirectParam;
      console.log('Using provided redirect URL:', redirectTo);
    }
  }
  
  // 코드가 없으면 리다이렉트
  if (!code) {
    console.log('No code provided, redirecting to:', redirectTo);
    return NextResponse.redirect(redirectTo);
  }

  // Supabase 클라이언트 초기화
  const supabase = await createClient();

  try {
    // 코드 교환 및 세션 생성
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error.message);
      return NextResponse.redirect(`${siteUrl}/auth/auth-error?error=${encodeURIComponent(error.message)}`);
    }
    
    console.log('Successfully exchanged code for session, redirecting to:', redirectTo);
    return NextResponse.redirect(redirectTo);
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    return NextResponse.redirect(`${siteUrl}/auth/auth-error?error=Unexpected_error`);
  }
}
