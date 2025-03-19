'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, Link as LinkIcon, CheckCircle, Settings, UserPlus, UserCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { mockCommunityPosts } from '@/data/mockCommunityPosts';
import { CommunityPost, Author } from '@/types/community';
import PostCard from '@/components/community/PostCard';

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const [user, setUser] = useState<Author | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [savedPosts, setSavedPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  // 사용자 데이터 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // 실제 앱에서는 API 호출을 통해 데이터를 가져옵니다
        // 목업 데이터에서 사용자 찾기
        const decodedUsername = decodeURIComponent(params.username);
        
        // 첫 번째 포스트의 작성자를 사용자로 설정 (데모용)
        const firstPost = mockCommunityPosts[0];
        if (firstPost) {
          const mockUser: Author = {
            ...firstPost.author,
            username: decodedUsername
          };
          setUser(mockUser);
          
          // 사용자가 작성한 포스트 필터링 (데모용)
          const userPosts = mockCommunityPosts.filter((post, index) => index < 3);
          setPosts(userPosts);
          
          // 저장한 포스트 필터링 (데모용)
          const userSavedPosts = mockCommunityPosts.filter(post => post.isSaved);
          setSavedPosts(userSavedPosts);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [params.username]);

  // 팔로우 처리
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-40 bg-gray-200 rounded-lg mb-6"></div>
          <div className="flex items-center mb-6">
            <div className="h-24 w-24 bg-gray-200 rounded-full mr-4"></div>
            <div className="flex-1">
              <div className="h-6 w-1/3 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded mb-6 w-2/3"></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
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
          <p className="mb-6">The user you&apos;re looking for doesn&apos;t exist or has been removed.</p>
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
      {/* 커버 이미지 */}
      <div className="relative h-48 md:h-64 w-full rounded-lg overflow-hidden mb-6">
        <Image
          src="https://images.unsplash.com/photo-1596178060810-72f53ce9a65c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80"
          alt="Cover"
          fill
          className="object-cover"
        />
      </div>

      {/* 프로필 정보 */}
      <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 md:-mt-20 mb-8 relative z-10">
        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white rounded-full mb-4 md:mb-0 md:mr-6">
          <AvatarImage src={user.avatarUrl} alt={user.username} />
          <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center mb-2">
            <h1 className="text-2xl font-bold mr-2">{user.username}</h1>
            {user.isVerified && (
              <Badge className="bg-amber-100 text-amber-900 border-amber-200 mb-2 md:mb-0">
                <CheckCircle size={14} className="mr-1" /> Verified
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center">
              <MapPin size={16} className="mr-1" /> New York, USA
            </span>
            <span className="flex items-center">
              <Calendar size={16} className="mr-1" /> Joined {formatDistanceToNow(new Date('2023-01-15'), { addSuffix: true })}
            </span>
            <span className="flex items-center">
              <LinkIcon size={16} className="mr-1" /> <a href="#" className="text-amber-900 hover:underline">beautyenthusiast.com</a>
            </span>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          {user.username === 'CurrentUser' ? (
            <Button variant="outline" className="flex items-center gap-1">
              <Settings size={16} className="mr-1" /> Edit Profile
            </Button>
          ) : (
            <Button 
              onClick={handleFollow}
              className={isFollowing ? "bg-white text-amber-900 border border-amber-900" : "bg-amber-900 text-white hover:bg-amber-800"}
            >
              {isFollowing ? (
                <>
                  <UserCheck size={16} className="mr-1" /> Following
                </>
              ) : (
                <>
                  <UserPlus size={16} className="mr-1" /> Follow
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* 사용자 소개 */}
      <div className="mb-8">
        <p className="text-gray-700">
          Beauty enthusiast and skincare expert. I love sharing my experiences with different treatments and products. 
          Always on the lookout for the latest innovations in beauty and wellness.
        </p>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-amber-900">{posts.length}</div>
          <div className="text-sm text-gray-600">Posts</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-amber-900">1.2K</div>
          <div className="text-sm text-gray-600">Followers</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-amber-900">284</div>
          <div className="text-sm text-gray-600">Following</div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-0">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No posts yet</p>
              <Button className="bg-amber-900 hover:bg-amber-800 text-white">
                Create Your First Post
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-0">
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