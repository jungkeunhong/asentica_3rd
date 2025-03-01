import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { tv } from 'tailwind-variants';
import Image from 'next/image';

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
      secondary: 'bg-gray-200 text-[#754731] hover:bg-gray-300',
      google: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
      email: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
      apple: 'bg-black text-white hover:bg-gray-900',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  
  // 모달이 열릴 때 body에 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      console.log('LoginModal is open');
    } else {
      document.body.style.overflow = 'unset';
      console.log('LoginModal is closed');
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting login process...');
      const supabase = createClient();
      
      if (isSignUp) {
        console.log('Attempting signup with email:', email);
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) {
          console.error('Signup error:', error);
          throw error;
        }
        console.log('Signup successful');
        onLoginSuccess();
      } else {
        console.log('Attempting signin with email:', email);
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          console.error('Signin error:', error);
          throw error;
        }
        console.log('Signin successful');
        onLoginSuccess();
      }
    } catch (err: Error | unknown) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    
    try {
      console.log('Starting Google login process...');
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/auth/callback?redirectPath=${encodeURIComponent(window.location.pathname)}`;
      console.log('Redirecting to:', redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });
      
      if (error) {
        console.error('Google OAuth error:', error);
        throw error;
      }
      console.log('Google OAuth initiated, redirecting...');
      // 리다이렉트되므로 onLoginSuccess는 호출되지 않음
    } catch (err: Error | unknown) {
      console.error('Google login error:', err);
      setError(err instanceof Error ? err.message : 'Google 로그인 중 오류가 발생했습니다.');
      setGoogleLoading(false);
    }
  };

  // 모달이 닫혀 있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#14517c]">
      <div className="bg-[#14517c] p-6 w-full max-w-md mx-4 relative flex flex-col items-center">
        <button 
          onClick={onClose}
          className="absolute left-4 top-4 text-white hover:text-gray-200"
          title="Close"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        
        <div className="w-32 h-32 mb-8 flex items-center justify-center">
          <Image src="/images/logo-white.png" alt="Logo" width={120} height={120} />
        </div>
        
        {!showEmailForm ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">
              Create an account to
            </h2>
            <p className="text-xl text-white mb-8">save your progress</p>
            
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 w-full">
                {error}
              </div>
            )}
            
            <button
              onClick={() => setShowEmailForm(true)}
              className={button({ variant: 'email' })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              Continue with Email
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
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
            
            <button
              className={button({ variant: 'apple' })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M17.05 20.28c-.98.95-2.05.86-3.08.38-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.38C2.79 15.2 3.51 7.08 9.05 6.74c1.79.04 3.07 1.2 4.08 1.2 1 0 2.87-1.47 4.84-1.25 2.49.38 4.29 2.26 4.29 2.26-3.92 2.22-3.32 7.41.56 9.71-.89 1.34-1.93 2.69-3.77 1.62zM12.03 6.54c-.24-2.67 2.04-5.02 4.89-5.28.41 3.09-2.7 5.19-4.89 5.28z"/>
              </svg>
              Continue with Apple
            </button>
            
            <div className="mt-8 text-center">
              <p className="text-white text-sm">
                By tapping Continue or logging into an existing account, you agree to our
              </p>
              <button className="text-white underline text-sm">
                Terms
              </button>
              <span className="text-white text-sm"> and acknowledge that you have read our </span>
              <button className="text-white underline text-sm">
                Privacy Policy
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-white text-sm">
                Have an account? <button className="text-white underline" onClick={() => setIsSignUp(false)}>Log In</button>
              </p>
            </div>
          </>
        ) : (
          <form onSubmit={handleLogin} className="w-full">
            <button 
              type="button"
              onClick={() => setShowEmailForm(false)}
              className="text-white mb-4 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-6">
              {isSignUp ? 'Sign Up with Email' : 'Log In with Email'}
            </h2>
            
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-white mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-white mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 px-4 bg-white text-[#14517c] rounded-full font-medium hover:bg-gray-100 transition-all duration-300"
              disabled={loading}
            >
              {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
            </button>
            
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-white hover:underline"
              >
                {isSignUp ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
