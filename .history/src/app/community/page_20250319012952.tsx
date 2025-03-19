'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Tag, TagsIcon, TrendingUp, Filter } from 'lucide-react';
import PostCard from '@/components/community/PostCard';
import { TagCloud } from '@/components/community/TagCloud';
import CommunityFeedSkeleton from '@/components/community/CommunityFeedSkeleton';
import { mockCommunityPosts } from '@/data/mockCommunityPosts';
import { SortOption, FilterOption, TagCloudItem, CommunityPost } from '@/types/community';
import { mockPopularTags } from '@/data/mockTags';
import { postsApi } from '@/lib/supabase';
import { MainLayout } from '@/components/layouts/MainLayout';
import Navbar from '@/components/Navbar';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<string>('latest');
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showTagsFilter, setShowTagsFilter] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 게시물 조회
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // 데이터베이스에서 게시물 조회
        const data = await postsApi.getPosts({
          sortBy: sortOption,
          filterBy: filterOption === 'all' ? null : filterOption,
          tagName: selectedTag,
        });
        
        if (data && data.length > 0) {
          // 타입 변환 (백엔드 스키마와 프론트엔드 타입이 다를 수 있음)
          setPosts(data as unknown as CommunityPost[]);
        } else {
          // 데이터가 없거나 빈 배열이면 목업 데이터 사용
          setPosts(getFilteredMockPosts());
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('게시물을 불러오는 중 오류가 발생했습니다.');
        // 에러 발생 시 기존 목업 데이터로 폴백
        setPosts(getFilteredMockPosts());
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption, filterOption, selectedTag]);
  
  // 목업 데이터 필터링 (실제 API 연동 전까지 사용)
  const getFilteredMockPosts = () => {
    let filteredPosts = [...mockCommunityPosts];
    
    // 정렬
    if (sortOption === 'latest') {
      filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOption === 'popular') {
      filteredPosts.sort((a, b) => b.upvoteCount - a.upvoteCount);
    }
    
    // 태그 필터링
    if (selectedTag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags.some(tag => tag.name.toLowerCase() === selectedTag.toLowerCase())
      );
    }
    
    // 종류별 필터링
    if (filterOption === 'questions') {
      filteredPosts = filteredPosts.filter(post => post.title.includes('?'));
    } else if (filterOption === 'experiences') {
      filteredPosts = filteredPosts.filter(post => !post.title.includes('?'));
    } else if (filterOption === 'beforeAfter') {
      filteredPosts = filteredPosts.filter(post => post.beforeAfterImages && post.beforeAfterImages.length > 0);
    }
    
    return filteredPosts;
  };
  
  // 탭 변경 처리
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSortOption(value as SortOption);
  };
  
  // 필터 변경 처리
  const handleFilterChange = (value: FilterOption) => {
    setFilterOption(value);
  };
  
  // 태그 선택 처리
  const handleTagSelect = (tagName: string) => {
    setSelectedTag(tagName === selectedTag ? null : tagName);
    setShowTagsFilter(false);
  };
  
  const popularTags: TagCloudItem[] = mockPopularTags.map((tag) => ({
    ...tag,
    size: tag.count && tag.count > 50 ? 'xl' : 
          tag.count && tag.count > 30 ? 'lg' : 
          tag.count && tag.count > 20 ? 'md' : 
          tag.count && tag.count > 10 ? 'sm' : 'xs'
  }));
  
  return (
    <MainLayout>
      <Navbar />
      <div className="container mx-auto px-4 py-6">        
        {/* 탭과 필터 그룹 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-row gap-4 w-full sm:w-auto">
            <Tabs defaultValue="latest" value={activeTab} onValueChange={handleTabChange} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="latest" className="flex items-center gap-1">Latest</TabsTrigger>
                <TabsTrigger value="popular" className="flex items-center gap-1"><TrendingUp size={14} />Popular</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="relative">
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => setShowTagsFilter(!showTagsFilter)}>
                <TagsIcon size={14} />{selectedTag ? `#${selectedTag}` : "Tags"}{selectedTag && <span className="ml-1 cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedTag(null); }}>✕</span>}
              </Button>
            </div>
            
            <Button variant="outline" size="sm" className={`flex items-center gap-1 ${filterOption !== 'all' ? 'bg-primary/10 text-primary' : ''}`} onClick={() => handleFilterChange(filterOption === 'all' ? 'questions' : 'all')}>
              <Filter size={14} />Filter
            </Button>
            
            <Link href="/create">
              <Button 
                className={`flex items-center gap-2 rounded-md bg-white ${filterOption !== 'all' ? 'bg-primary/10 text-primary' : ''} h-10`}
              >
                <span className="text-2xl font-light text-black">+</span>
              </Button>
            </Link>
          </div>
        </div>
        
        {/* 선택된 필터 표시 */}
        {selectedTag && (
          <div className="mb-4 p-2 bg-accent rounded flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-primary" />
              <span>Showing posts tagged with: <strong>#{selectedTag}</strong></span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={() => setSelectedTag(null)}
            >
              ✕
            </Button>
          </div>
        )}
        
        {/* 게시물 목록 */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <CommunityFeedSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-md">
            <p className="text-destructive font-medium">{error}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Please try again later or check your connection.
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center border border-border rounded-md">
            <Tag className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
            <h3 className="font-semibold text-lg mb-1">No posts found</h3>
            <p className="text-muted-foreground mb-4">
              {selectedTag 
                ? `There are no posts tagged with #${selectedTag} yet` 
                : "No posts match your current filters"}
            </p>
            <div className="flex justify-center gap-2">
              {selectedTag && (
                <Button variant="outline" onClick={() => setSelectedTag(null)}>
                  Clear Tag Filter
                </Button>
              )}
              <Link href="/community/create">
                <Button>Create a Post</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
        
        {/* 인기 태그 클라우드 */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Popular Topics</h2>
            <Link href="/tags" className="text-primary text-sm hover:underline">
              View all
            </Link>
          </div>
          <div className="p-4 bg-card border border-border rounded-lg">
            <TagCloud 
              tags={popularTags} 
              onTagSelect={handleTagSelect} 
              selectedTag={selectedTag}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 