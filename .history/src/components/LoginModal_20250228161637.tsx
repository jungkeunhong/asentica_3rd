import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { tv } from 'tailwind-variants';

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = isSignUp
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=/search`,
              data: {
                name: name,
              },
            },
          })
        : await supabase.auth.signInWithPassword({
            email,
            password,
          });

      if (error) {
        throw error;
      }

      if (data?.user) {
        onLoginSuccess();
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=/search`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: unknown) {
      console.error('Google login error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during Google login');
      setGoogleLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=/search`,
        },
      });

      if (error) {
        throw error;
      }
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

        <h2 className="cormorant text-2xl font-bold text-center text-[#754731] mb-6">
          Begin your skincare journey
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 w-full">
            {error}
          </div>
        )}

        {!showEmailForm ? (
          <>
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
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#754731] hover:underline"
              >
                {isSignUp ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleLogin} className="w-full">
            <button 
              type="button"
              onClick={() => setShowEmailForm(false)}
              className="text-gray-700 mb-4 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back
            </button>
            
            <h3 className="text-xl font-bold text-[#754731] mb-6">
              {isSignUp ? 'Sign Up with Email' : 'Log In with Email'}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#754731]"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#754731]"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#754731]"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#754731] text-white rounded-full font-medium hover:bg-[#5d3926] transition-all duration-300"
              disabled={loading}
            >
              {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
