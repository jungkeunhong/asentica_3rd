'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Navbar from '@/components/Navbar';
import LoginModal from '@/components/LoginModal';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string | undefined;
  name: string;
  avatar_url: string;
  created_at: string;
  // 추가 피부 관련 정보
  gender?: string;
  age_range?: string;
  skin_type?: string;
  ethnicity?: string;
  skin_concerns?: string[];
}

// 피부 관련 정보 옵션
const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const AGE_RANGE_OPTIONS = ['Under 18', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
const SKIN_TYPE_OPTIONS = ['Dry', 'Oily', 'Combination', 'Normal', 'Sensitive'];
const ETHNICITY_OPTIONS = ['Asian', 'Black', 'Hispanic/Latino', 'Middle Eastern', 'White', 'Mixed', 'Other'];
const SKIN_CONCERN_OPTIONS = [
  'Acne', 
  'Aging', 
  'Dark spots', 
  'Dryness', 
  'Fine lines', 
  'Pores', 
  'Redness', 
  'Sensitivity', 
  'Uneven skin tone',
  'Wrinkles'
];

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

  // 피부 관련 정보 상태
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [ageRange, setAgeRange] = useState<string | undefined>(undefined);
  const [skinType, setSkinType] = useState<string | undefined>(undefined);
  const [ethnicity, setEthnicity] = useState<string | undefined>(undefined);
  const [skinConcerns, setSkinConcerns] = useState<string[]>([]);

  // 섹션 확장 상태
  const [expandedSections, setExpandedSections] = useState({
    skinConcerns: false
  });

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
            }),
            gender: authUser.user_metadata?.gender,
            age_range: authUser.user_metadata?.age_range,
            skin_type: authUser.user_metadata?.skin_type,
            ethnicity: authUser.user_metadata?.ethnicity,
            skin_concerns: authUser.user_metadata?.skin_concerns || []
          };
          
          setUser(userProfile);
          setName(userProfile.name);
          setAvatarUrl(userProfile.avatar_url);
          setGender(userProfile.gender);
          setAgeRange(userProfile.age_range);
          setSkinType(userProfile.skin_type);
          setEthnicity(userProfile.ethnicity);
          setSkinConcerns(userProfile.skin_concerns || []);
          
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

  // 피부 고민 토글
  const toggleSkinConcern = (concern: string) => {
    const currentConcerns = [...skinConcerns];
    const index = currentConcerns.indexOf(concern);
    
    if (index === -1) {
      currentConcerns.push(concern);
    } else {
      currentConcerns.splice(index, 1);
    }
    
    setSkinConcerns(currentConcerns);
  };

  // 섹션 확장 토글
  const toggleExpandedSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
          avatar_url: newAvatarUrl,
          gender,
          age_range: ageRange,
          skin_type: skinType,
          ethnicity,
          skin_concerns: skinConcerns
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              required
            />
          </div>
          
          {/* 성별 선택 */}
          <div className="mb-6 space-y-2 border-t pt-4">
            <h3 className="text-lg font-medium text-amber-900">Gender</h3>
            <div className="flex flex-wrap gap-2">
              {GENDER_OPTIONS.map((option) => (
                <button
                  key={`gender-${option}`}
                  onClick={() => setGender(gender === option ? undefined : option)}
                  className={`px-4 py-1 rounded-full border ${
                    gender === option
                      ? 'bg-amber-900 text-white border-amber-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-900'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          {/* 나이 범위 선택 */}
          <div className="mb-6 space-y-2 border-t pt-4">
            <h3 className="text-lg font-medium text-amber-900">Age Range</h3>
            <div className="flex flex-wrap gap-2">
              {AGE_RANGE_OPTIONS.map((option) => (
                <button
                  key={`age-${option}`}
                  onClick={() => setAgeRange(ageRange === option ? undefined : option)}
                  className={`px-4 py-1 rounded-full border ${
                    ageRange === option
                      ? 'bg-amber-900 text-white border-amber-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-900'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          {/* 피부 타입 선택 */}
          <div className="mb-6 space-y-2 border-t pt-4">
            <h3 className="text-lg font-medium text-amber-900">Skin Type</h3>
            <div className="flex flex-wrap gap-2">
              {SKIN_TYPE_OPTIONS.map((option) => (
                <button
                  key={`skin-type-${option}`}
                  onClick={() => setSkinType(skinType === option ? undefined : option)}
                  className={`px-4 py-1 rounded-full border ${
                    skinType === option
                      ? 'bg-amber-900 text-white border-amber-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-900'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          {/* 인종 선택 */}
          <div className="mb-6 space-y-2 border-t pt-4">
            <h3 className="text-lg font-medium text-amber-900">Ethnicity</h3>
            <div className="flex flex-wrap gap-2">
              {ETHNICITY_OPTIONS.map((option) => (
                <button
                  key={`ethnicity-${option}`}
                  onClick={() => setEthnicity(ethnicity === option ? undefined : option)}
                  className={`px-4 py-1 rounded-full border ${
                    ethnicity === option
                      ? 'bg-amber-900 text-white border-amber-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-900'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          {/* 피부 고민 선택 */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-amber-900">Skin Concerns</h3>
              <button 
                onClick={() => toggleExpandedSection('skinConcerns')}
                className="text-amber-900"
              >
                {expandedSections.skinConcerns ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
            
            <div className="space-y-2">
              {SKIN_CONCERN_OPTIONS
                .slice(0, expandedSections.skinConcerns ? undefined : 5)
                .map((concern) => (
                  <div key={concern} className="flex items-center justify-between">
                    <label htmlFor={`concern-${concern}`} className="flex-1 cursor-pointer">
                      {concern}
                    </label>
                    <input
                      id={`concern-${concern}`}
                      type="checkbox"
                      checked={skinConcerns.includes(concern)}
                      onChange={() => toggleSkinConcern(concern)}
                      className="appearance-none w-5 h-5 rounded border border-gray-300 bg-white checked:border-amber-900 checked:bg-amber-900 relative
                      checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2
                      checked:after:content-['✓'] checked:after:text-white checked:after:text-sm focus:ring-amber-900 focus:ring-2 focus:ring-offset-2"
                    />
                  </div>
                ))}
              
              {SKIN_CONCERN_OPTIONS.length > 5 && (
                <button 
                  onClick={() => toggleExpandedSection('skinConcerns')}
                  className="text-amber-900 text-sm font-medium mt-2"
                >
                  {expandedSections.skinConcerns ? 'Show less' : '...more'}
                </button>
              )}
            </div>
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