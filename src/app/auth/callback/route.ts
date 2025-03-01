// app/auth/callback/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const redirectTo = requestUrl.searchParams.get('redirectTo');
  
  // URL 디코딩 적용
  const decodedRedirectTo = redirectTo ? decodeURIComponent(redirectTo) : null;
  
  console.log('Auth callback 호출됨, 요청 URL:', request.url);
  console.log('요청 Origin:', requestUrl.origin);
  console.log('리다이렉트 경로:', decodedRedirectTo);

  // Vercel 배포 환경에서의 origin 처리
  // 'localhost'가 포함된 경우 실제 배포 URL로 변경
  const deployedOrigin = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;
  const effectiveOrigin = requestUrl.origin.includes('localhost') ? deployedOrigin : requestUrl.origin;
  
  console.log('유효 Origin:', effectiveOrigin);

  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(new URL('/', effectiveOrigin));
  }
  
  if (code) {
    try {
      const supabase = await createClient();
      const { error: supabaseError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (supabaseError) {
        console.error('Supabase auth error:', supabaseError);
        return NextResponse.redirect(new URL('/', effectiveOrigin));
      }
      
      // 성공적으로 로그인한 경우 redirectTo 경로로 리디렉션
      console.log('로그인 성공, 리다이렉션 경로:', decodedRedirectTo);
      
      if (decodedRedirectTo) {
        // 절대 URL 또는 상대 URL 처리
        let redirectUrl;
        
        if (decodedRedirectTo.startsWith('http')) {
          // 이미 절대 URL인 경우 - localhost 체크
          if (decodedRedirectTo.includes('localhost')) {
            // localhost URL을 배포 URL로 변환
            const parsedUrl = new URL(decodedRedirectTo);
            redirectUrl = `${effectiveOrigin}${parsedUrl.pathname}${parsedUrl.search}`;
          } else {
            redirectUrl = decodedRedirectTo;
          }
        } else {
          // 상대 URL인 경우 현재 origin과 결합
          const path = decodedRedirectTo.startsWith('/') ? decodedRedirectTo : `/${decodedRedirectTo}`;
          redirectUrl = `${effectiveOrigin}${path}`;
        }
        
        console.log('최종 리다이렉트 URL:', redirectUrl);
        return NextResponse.redirect(redirectUrl);
      } else {
        // redirectTo가 없는 경우 기본 페이지로 리다이렉션
        const defaultRedirect = new URL('/my-page', effectiveOrigin);
        console.log('기본 리다이렉트 URL:', defaultRedirect.toString());
        return NextResponse.redirect(defaultRedirect);
      }
    } catch (err) {
      console.error('Unexpected auth error:', err);
      return NextResponse.redirect(new URL('/', effectiveOrigin));
    }
  }

  // 코드가 없는 경우에도 redirectTo 경로로 리디렉션
  let finalRedirectUrl;
  
  if (decodedRedirectTo) {
    if (decodedRedirectTo.startsWith('http')) {
      // 이미 절대 URL인 경우 - localhost 체크
      if (decodedRedirectTo.includes('localhost')) {
        // localhost URL을 배포 URL로 변환
        const parsedUrl = new URL(decodedRedirectTo);
        finalRedirectUrl = `${effectiveOrigin}${parsedUrl.pathname}${parsedUrl.search}`;
      } else {
        finalRedirectUrl = decodedRedirectTo;
      }
    } else {
      // 상대 URL인 경우 현재 origin과 결합
      const path = decodedRedirectTo.startsWith('/') ? decodedRedirectTo : `/${decodedRedirectTo}`;
      finalRedirectUrl = `${effectiveOrigin}${path}`;
    }
  } else {
    // 리다이렉트 경로가 없는 경우 기본 경로 사용
    finalRedirectUrl = `${effectiveOrigin}/my-page`;
  }
  
  console.log('코드 없음, 최종 리다이렉트 URL:', finalRedirectUrl);
  return NextResponse.redirect(finalRedirectUrl);
}
