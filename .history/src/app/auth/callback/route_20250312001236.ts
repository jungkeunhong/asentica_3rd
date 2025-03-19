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
  
  // 기본 리다이렉트 URL 설정
  const redirectTo = '/my-page';
  
  // 코드가 없으면 리다이렉트
  if (!code) {
    console.log('No code provided, redirecting to:', redirectTo);
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // Supabase 클라이언트 초기화
  const supabase = await createClient();

  try {
    // 코드 교환 및 세션 생성
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error.message);
      return NextResponse.redirect(new URL('/auth/auth-error', request.url));
    }
    
    console.log('Successfully exchanged code for session, redirecting to:', redirectTo);
    return NextResponse.redirect(new URL(redirectTo, request.url));
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    return NextResponse.redirect(new URL('/auth/auth-error', request.url));
  }
}
