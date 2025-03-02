import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { tv } from 'tailwind-variants';
import confetti from 'canvas-confetti';
import { Eye, EyeOff } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const button = tv({
  base: 'w-full py-3 px-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 mb-3',
  variants: {
    variant: {
      primary: 'bg-[#754731] text-white hover:bg-[#5d3926]',
      google: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
      email: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
      apple: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
      facebook: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 리다이렉트 URL을 가져오는 함수
  const getRedirectUrl = () => {
    // 서버 사이드에서 실행될 경우 기본 경로 반환
    if (typeof window === 'undefined') {
      return '/my-page';
    }
    
    // 사이트 URL 가져오기 (환경에 따라 다름)
    let url = 
      process.env.NEXT_PUBLIC_SITE_URL || // 프로덕션 환경에서 설정된 사이트 URL
      process.env.NEXT_PUBLIC_VERCEL_URL || // Vercel에서 자동으로 설정
      'http://localhost:3000';
    
    // URL이 http로 시작하지 않으면 https:// 추가
    url = url.startsWith('http') ? url : `https://${url}`;
    
    // URL 끝에 슬래시가 없으면 추가
    url = url.endsWith('/') ? url : `${url}/`;
    
    console.log('Base URL for redirect:', url);
    
    // 기본 리다이렉트 경로
    const defaultPath = 'my-page';
    
    // 현재 경로 가져오기 (홈페이지나 로그인 페이지가 아닌 경우)
    let redirectPath = defaultPath;
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath !== '/' && currentPath !== '/login') {
        redirectPath = currentPath.startsWith('/') ? currentPath.substring(1) : currentPath;
      }
    }
    
    // 최종 리다이렉트 URL 생성
    const redirectUrl = `${url}auth/callback?redirectTo=${encodeURIComponent(`${url}${redirectPath}`)}`;
    console.log('Final redirect URL:', redirectUrl);
    
    return redirectUrl;
  };

  // 모달이 열릴 때 body에 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const supabase = createClient();

  // Confetti 효과를 보여주는 함수
  const showConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#754731', '#5d3926', '#f8f8f8', '#e6e6e6', '#d4d4d4']
    });
  };

  // 이메일 로그인/회원가입 처리
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const redirectUrl = getRedirectUrl();
      console.log('Email auth with redirect URL:', redirectUrl);
      
      if (isSignUp) {
        // 회원가입 처리
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: redirectUrl
          }
        });

        if (error) {
          console.error('Signup error:', error);
          throw error;
        }

        if (data.user) {
          console.log('Signup successful, user:', data.user.id);
          showConfetti();
          onLoginSuccess();
          onClose();
        }
      } else {
        // 로그인 처리
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          console.error('Login error:', error);
          throw error;
        }

        if (data.user) {
          console.log('Login successful, user:', data.user.id);
          showConfetti();
          onLoginSuccess();
          onClose();
        }
      }
    } catch (err: unknown) {
      console.error('Email auth error:', err);
      setError(err instanceof Error ? err.message : '인증 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Google 로그인 처리
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      setError(null);
      
      const redirectUrl = getRedirectUrl();
      console.log('Google login with redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        console.error('Google login error:', error);
        setError(error.message);
      }
      
      // 성공적으로 리다이렉트되면 이 코드는 실행되지 않음
      console.log('OAuth login initiated:', data);
    } catch (err: unknown) {
      console.error('Unexpected error during Google login:', err);
      setError(err instanceof Error ? err.message : '구글 로그인 중 오류가 발생했습니다.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: getRedirectUrl(),
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        throw error;
      }
      
      // 에러가 없으면 OAuth 로그인이 진행 중입니다.
      console.log('Facebook 로그인 진행 중');
    } catch (error: unknown) {
      console.error('Facebook login error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during Facebook login');
    }
  };

  // 모달이 닫혀 있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          title="Close"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <h2 className="cormorant text-2xl font-semibold text-center text-amber-900 mb-6">
          Better skin starts today
        </h2>

        {!showEmailForm ? (
          <>
            <button
              type={showEmailForm ? 'button' : 'submit'}
              onClick={showEmailForm ? handleEmailAuth : () => setShowEmailForm(true)}
              className={button({ variant: 'email' })}
              disabled={showEmailForm ? loading : false}
            >
              {showEmailForm ? (
                loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  isSignUp ? 'Sign-up' : 'Login'
                )
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                  Continue with Email
                </>
              )}
            </button>

            <button
              onClick={handleGoogleLogin}
              className={button({ variant: 'google' })}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-gray-700 rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="#000000" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#000000" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#000000" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#000000" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <button
              onClick={handleFacebookLogin}
              className={button({ variant: 'facebook' })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>

            <button
              className={button({ variant: 'apple' })}
              onClick={() => {}}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black">
                <path d="M17.05 20.28c-.98.95-2.05.86-3.08.38-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.38C2.79 15.2 3.51 7.08 9.05 6.74c1.79.04 3.07 1.2 4.08 1.2 1 0 2.87-1.47 4.84-1.25 2.49.38 4.29 2.26 4.29 2.26-3.92 2.22-3.32 7.41.56 9.71-.89 1.34-1.93 2.69-3.77 1.62zM12.03 6.54c-.24-2.67 2.04-5.02 4.89-5.28.41 3.09-2.7 5.19-4.89 5.28z"/>
              </svg>
              Continue with Apple
            </button>

            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                By continuing, you agree to our
              </p>
              <button className="text-[#754731] underline text-sm">
                Terms
              </button>
              <span className="text-gray-600 text-sm"> and acknowledge that you have read our </span>
              <button className="text-[#754731] underline text-sm">
                Privacy Policy
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setShowEmailForm(true);
                }}
                className="text-[#754731] hover:underline"
              >
                {isSignUp ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleEmailAuth} className="w-full">
            <button 
              type="button"
              onClick={() => setShowEmailForm(false)}
              className="text-gray-700 mb-4 flex items-center"
              title="Go back"
              aria-label="Go back to login options"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>              
            </button>
            
            <h3 className="text-xl font-bold text-[#754731] mb-6">
              {isSignUp ? '' : ''}
            </h3>
            
            {isSignUp && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-0 py-2 bg-transparent border-0 border-b border-black focus:outline-none focus:border-[#754731] transition-colors"
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-0 py-2 bg-transparent border-0 border-b border-black focus:outline-none focus:border-[#754731] transition-colors"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-0 py-2 bg-transparent border-0 border-b border-black focus:outline-none focus:border-[#754731] transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {error && (
                <div className="text-red-500 text-sm mt-1">
                  {error}
                </div>
              )}
            </div>

                        
            
            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#754731] text-white rounded-full font-medium hover:bg-[#5d3926] transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : isSignUp ? 'Sign Up' : 'Log In'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
