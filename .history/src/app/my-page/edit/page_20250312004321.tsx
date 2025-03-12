'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Navbar from '@/components/Navbar';
import LoginModal from '@/components/LoginModal';

interface UserProfile {
  id: string;
  email: string | undefined;
  name: string;
  avatar_url: string;
  created_at: string;
}

export default function EditProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();

  // 사용자 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { user: authUser } = session;
          
          const userProfile = {
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
            avatar_url: authUser.user_metadata?.avatar_url || '/placeholder-user.jpg',
            created_at: new Date(authUser.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long'
            })
          };
          
          setUser(userProfile);
          setName(userProfile.name);
          setAvatarUrl(userProfile.avatar_url);
          
          console.log('인증된 사용자 확인됨:', authUser.email);
        } else {
          console.log('인증되지 않은 사용자, 로그인 모달 표시');
          setShowLoginModal(true);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // 이미지 파일 선택 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // 미리보기 URL 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 프로필 저장 처리
  const handleSave = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      const supabase = createClient();
      
      let newAvatarUrl = avatarUrl;
      
      // 이미지 파일이 있으면 업로드
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, imageFile);
        
        if (uploadError) {
          throw uploadError;
        }
        
        // 업로드된 이미지의 공개 URL 가져오기
        const { data: urlData } = await supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
        
        if (urlData) {
          newAvatarUrl = urlData.publicUrl;
        }
      }
      
      // 사용자 메타데이터 업데이트
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: name,
          avatar_url: newAvatarUrl
        }
      });
      
      if (updateError) {
        throw updateError;
      }
      
      console.log('프로필 업데이트 성공');
      router.push('/my-page');
      
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLoginSuccess = () => {
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-[#754731] animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => router.push('/')} 
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24 max-w-md">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => router.back()} 
            className="text-black"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <h1 className="text-2xl font-semibold">Edit Profile</h1>
          <div className="w-6"></div> {/* 균형을 위한 빈 공간 */}
        </div>
        
        {/* 프로필 사진 편집 */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
              <Image 
                src={previewUrl || avatarUrl} 
                alt="Profile" 
                fill
                className="object-cover"
              />
            </div>
            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
                aria-label="Upload profile picture"
              />
            </label>
          </div>
          <button 
            className="text-amber-900 font-medium"
            onClick={() => document.getElementById('avatar-upload')?.click()}
          >
            Edit
          </button>
        </div>
        
        {/* 프로필 정보 */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your profile</h2>
          <p className="text-gray-600 mb-6">
            The information you share will be used to customize your skin care and treatment recommendations.
          </p>
          
          {/* 이름 입력 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          
          {/* 학교 정보 (선택 사항) */}
          <div className="mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-gray-500">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
            <span className="text-gray-500">Where I went to school</span>
          </div>
          
          {/* 직업 정보 (선택 사항) */}
          <div className="mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-gray-500">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            <span className="text-gray-500">My work</span>
          </div>
        </div>
        
        {/* 저장 버튼 */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 px-4 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
              Saving...
            </span>
          ) : 'Done'}
        </button>
      </div>
    </div>
  );
} 