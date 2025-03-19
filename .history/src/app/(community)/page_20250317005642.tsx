'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostCard from '@/components/community/PostCard';
import { mockCommunityPosts } from '@/data/mockCommunityPosts';
import { SortOption, FilterOption } from '@/types/community';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<string>('latest');
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [filterOption, setFilterOption] = useState<FilterOption>('all');

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (value: SortOption) => {
    setSortOption(value);
    setActiveTab(value);
  };

  // 필터 옵션 변경 핸들러
  const handleFilterChange = (value: FilterOption) => {
    setFilterOption(value);
  };

  // 포스트 정렬 및 필터링
  const getFilteredPosts = () => {
    let filteredPosts = [...mockCommunityPosts];

    // 필터 적용
    if (filterOption === 'saved') {
      filteredPosts = filteredPosts.filter(post => post.isSaved);
    }

    // 정렬 적용
    if (sortOption === 'latest') {
      filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOption === 'popular') {
      filteredPosts.sort((a, b) => b.upvoteCount - a.upvoteCount);
    } else if (sortOption === 'trending') {
      // 트렌딩은 댓글 수와 좋아요 수를 모두 고려
      filteredPosts.sort((a, b) => (b.upvoteCount + b.commentCount * 2) - (a.upvoteCount + a.commentCount * 2));
    }

    return filteredPosts;
  };

  const filteredPosts = getFilteredPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-2xl font-bold text-amber-900 mb-4 md:mb-0">Community</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 필터 선택 */}
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={filterOption}
            onChange={(e) => handleFilterChange(e.target.value as FilterOption)}
          >
            <option value="all">All Posts</option>
            <option value="following">Following</option>
            <option value="saved">Saved</option>
          </select>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <Tabs defaultValue="latest" value={activeTab} onValueChange={(value) => handleSortChange(value as SortOption)} className="mb-8">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="latest" className="space-y-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="space-y-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 