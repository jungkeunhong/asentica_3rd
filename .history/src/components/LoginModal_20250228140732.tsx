// components/LoginModal.tsx
import { useState } from 'react';
import { authService } from '@/services/auth.service';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { error } = await authService.signIn(email, password);
      
      if (error) throw error;
      
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white p-6 rounded-lg shadow-xl">
        <h3 className="font-bold text-lg mb-4">계속 보려면 로그인하세요</h3>
        <p className="text-sm text-gray-600 mb-4">
          더 많은 콘텐츠를 보려면 로그인이 필요합니다.
        </p>
        
        {error && (
          <div className="alert alert-error mb-4">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">이메일</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered"
              required
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">비밀번호</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered"
              required
            />
          </div>
          
          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn bg-blue-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>
          </div>
        </form>
        
        <button
          onClick={onClose}
          className="btn btn-ghost mt-4"
        >
          나중에 하기
        </button>
      </div>
    </div>
  );
}
v