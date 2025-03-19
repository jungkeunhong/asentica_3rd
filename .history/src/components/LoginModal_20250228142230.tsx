import React, { useState } from 'react';
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
  base: 'w-full py-3 px-4 rounded-md font-medium transition-all duration-300',
  variants: {
    variant: {
      primary: 'bg-[#754731] text-white hover:bg-[#5d3926]',
      secondary: 'bg-gray-200 text-[#754731] hover:bg-gray-300',
      google: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2',
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const supabase = createClient();
      
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        onLoginSuccess();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      // 리다이렉트되므로 onLoginSuccess는 호출되지 않음
    } catch (err: any) {
      setError(err.message || 'Google 로그인 중 오류가 발생했습니다.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className={`modal fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box bg-white rounded-lg p-6 w-full max-w-md mx-4 relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-[#754731] mb-6">
          {isSignUp ? '회원가입' : '로그인'}
        </h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <button
          onClick={handleGoogleLogin}
          className={button({ variant: 'google' })}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-t-2 border-b-2 border-gray-700 rounded-full animate-spin"></div>
              처리 중...
            </span>
          ) : (
            <>
              <Image src="/images/google-logo.png" alt="Google" width={20} height={20} />
              Google로 {isSignUp ? '회원가입' : '로그인'}
            </>
          )}
        </button>
        
        <div className="my-4 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 text-sm">또는</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#754731]"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#754731]"
              required
            />
          </div>
          
          <button
            type="submit"
            className={button({ variant: 'primary' })}
            disabled={loading}
          >
            {loading ? '처리 중...' : isSignUp ? '회원가입' : '로그인'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#754731] hover:underline"
          >
            {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
