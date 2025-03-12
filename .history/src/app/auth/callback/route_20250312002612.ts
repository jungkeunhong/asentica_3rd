// app/auth/callback/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // URL 파라미터 추출
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  // 디버깅을 위한 로그
  console.log('Auth callback triggered');
  console.log('Code present:', !!code);
  console.log('Request URL:', request.url);
  
  // 현재 호스트 추출 - 항상 요청의 origin을 사용 (.env 파일의 URL 무시)
  const host = requestUrl.origin;
  console.log('Current host:', host);
  
  // 기본 리다이렉트 URL 설정
  const redirectTo = `${host}/my-page`;
  console.log('Redirect target:', redirectTo);
  
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
      return NextResponse.redirect(`${host}/auth/auth-error`);
    }
    
    console.log('Successfully exchanged code for session, redirecting to:', redirectTo);
    return NextResponse.redirect(redirectTo);
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    return NextResponse.redirect(`${host}/auth/auth-error`);
  }
}
