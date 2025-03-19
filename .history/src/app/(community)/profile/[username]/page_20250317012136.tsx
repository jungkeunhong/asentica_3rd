'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, MapPin, Calendar, Globe, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { mockCommunityPosts } from '@/data/mockCommunityPosts';
import { CommunityPost, UserProfile } from '@/types/community';
import PostCard from '@/components/community/PostCard';

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const unwrappedParams = use(params);
  const username = unwrappedParams.username;
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<CommunityPost[]>([]);
  const [savedPosts, setSavedPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  const decodedUsername = decodeURIComponent(username);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // 실제 앱에서는 API 호출을 통해 사용자 데이터를 가져옵니다
        // 여기서는 목업 데이터를 사용합니다
        
        // 목업 사용자 데이터
        const mockUser: UserProfile = {
          id: 'user1',
          username: decodedUsername,
          displayName: decodedUsername === 'BeautyExpert' ? 'Sarah Johnson' : 
                      decodedUsername === 'SkincarePro' ? 'Michael Chen' : 
                      decodedUsername === 'BeautyEnthusiast' ? 'Emma Wilson' : 
                      'User Profile',
          avatarUrl: decodedUsername === 'BeautyExpert' ? 'https://randomuser.me/api/portraits/women/44.jpg' : 
                    decodedUsername === 'SkincarePro' ? 'https://randomuser.me/api/portraits/men/45.jpg' : 
                    decodedUsername === 'BeautyEnthusiast' ? 'https://randomuser.me/api/portraits/women/33.jpg' : 
                    'https://randomuser.me/api/portraits/lego/1.jpg',
          coverImageUrl: 'https://images.unsplash.com/photo-1607006483224-75ee5b17b9eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
          bio: `Beauty and skincare enthusiast with a passion for helping others look and feel their best. Sharing my experiences with various treatments and products.`,
          location: 'New York, NY',
          website: 'https://beautyexpert.com',
          joinDate: '2023-01-15T00:00:00.000Z',
          isVerified: decodedUsername === 'BeautyExpert' || decodedUsername === 'SkincarePro',
          followersCount: 1243,
          followingCount: 567,
          postsCount: 42
        };
        
        setUser(mockUser);
        
        // 사용자가 작성한 포스트 가져오기
        const userPostsData = mockCommunityPosts.filter(
          post => post.author.username.toLowerCase() === decodedUsername.toLowerCase()
        );
        setUserPosts(userPostsData);
        
        // 저장한 포스트 가져오기 (로컬 스토리지에서)
        const savedPostIds = JSON.parse(localStorage.getItem('savedPosts') || '[]');
        const savedPostsData = mockCommunityPosts.filter(post => savedPostIds.includes(post.id));
        setSavedPosts(savedPostsData);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [decodedUsername]);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // 실제 앱에서는 API 호출을 통해 팔로우/언팔로우 처리를 합니다
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-lg mb-6"></div>
          <div className="flex items-center mb-6">
            <div className="h-24 w-24 bg-gray-200 rounded-full mr-4"></div>
            <div className="flex-1">
              <div className="h-6 w-1/3 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded mb-6 w-2/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-amber-900 mb-4">User Not Found</h1>
          <p className="mb-6">The user profile you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/">
            <Button className="bg-amber-900 hover:bg-amber-800 text-white">
              Back to Community
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 뒤로 가기 버튼 */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="pl-0 text-amber-900 hover:text-amber-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Community
          </Button>
        </Link>
      </div>

      {/* 커버 이미지 */}
      <div className="relative h-48 md:h-64 w-full mb-6 rounded-lg overflow-hidden">
        <Image
          src={user.coverImageUrl}
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* 사용자 정보 */}
      <div className="flex flex-col md:flex-row items-start md:items-end mb-8 -mt-16 relative z-10">
        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-md">
          <AvatarImage src={user.avatarUrl} alt={user.displayName} />
          <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 mt-4 md:mt-0 md:ml-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold mr-2">{user.displayName}</h1>
                {user.isVerified && (
                  <CheckCircle size={20} className="text-amber-900" />
                )}
              </div>
              <p className="text-gray-600">@{user.username}</p>
            </div>
            
            <Button 
              onClick={handleFollowToggle}
              className={`mt-4 md:mt-0 ${
                isFollowing 
                  ? 'bg-white text-amber-900 border border-amber-900 hover:bg-amber-50' 
                  : 'bg-amber-900 hover:bg-amber-800 text-white'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>
        </div>
      </div>

      {/* 사용자 소개 및 정보 */}
      <div className="mb-8">
        <p className="text-gray-700 mb-4">{user.bio}</p>
        
        <div className="flex flex-wrap gap-y-2">
          {user.location && (
            <div className="flex items-center text-gray-600 text-sm mr-6">
              <MapPin size={16} className="mr-1" />
              <span>{user.location}</span>
            </div>
          )}
          
          {user.website && (
            <div className="flex items-center text-amber-900 text-sm mr-6">
              <Globe size={16} className="mr-1" />
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          
          {user.joinDate && (
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar size={16} className="mr-1" />
              <span>Joined {format(new Date(user.joinDate), 'MMMM yyyy')}</span>
            </div>
          )}
        </div>
      </div>

      {/* 통계 */}
      <div className="flex mb-8 border-b pb-4">
        <div className="mr-6">
          <span className="font-bold">{user.postsCount}</span>
          <span className="text-gray-600 ml-1">Posts</span>
        </div>
        <div className="mr-6">
          <span className="font-bold">{user.followersCount.toLocaleString()}</span>
          <span className="text-gray-600 ml-1">Followers</span>
        </div>
        <div>
          <span className="font-bold">{user.followingCount.toLocaleString()}</span>
          <span className="text-gray-600 ml-1">Following</span>
        </div>
      </div>

      {/* 탭 내비게이션 */}
      <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="posts" className="text-amber-900 data-[state=active]:bg-amber-50">Posts</TabsTrigger>
          <TabsTrigger value="saved" className="text-amber-900 data-[state=active]:bg-amber-50">Saved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts">
          {userPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No posts yet</p>
              <Link href="/">
                <Button className="bg-amber-900 hover:bg-amber-800 text-white">
                  Explore Community
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="saved">
          {savedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No saved posts yet</p>
              <Link href="/">
                <Button className="bg-amber-900 hover:bg-amber-800 text-white">
                  Explore Community
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 