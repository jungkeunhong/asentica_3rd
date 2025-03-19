'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Tag, TagsIcon, TrendingUp, Filter } from 'lucide-react';
import PostCard from '@/components/community/PostCard';
import CreatePostButton from '@/components/community/CreatePostButton';
import { TagCloud } from '@/components/community/TagCloud';
import { mockCommunityPosts } from '@/data/mockCommunityPosts';
import { SortOption, FilterOption, TagCloudItem } from '@/types/community';
import { mockPopularTags } from './tags/mock-data';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<string>('latest');
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showTagsFilter, setShowTagsFilter] = useState(false);

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (value: SortOption) => {
    setSortOption(value);
    setActiveTab(value);
  };

  // 필터 옵션 변경 핸들러
  const handleFilterChange = (value: FilterOption) => {
    setFilterOption(value);
  };

  // 태그 선택 핸들러
  const handleTagSelect = (tagName: string) => {
    if (selectedTag === tagName) {
      setSelectedTag(null); // 같은 태그를 다시 클릭하면 필터 해제
    } else {
      setSelectedTag(tagName); // 다른 태그 선택
    }
  };

  // 태그 필터 토글
  const toggleTagsFilter = () => {
    setShowTagsFilter(!showTagsFilter);
  };

  // 포스트 정렬 및 필터링
  const getFilteredPosts = () => {
    let filteredPosts = [...mockCommunityPosts];

    // 필터 적용
    if (filterOption === 'saved') {
      filteredPosts = filteredPosts.filter(post => post.isSaved);
    }

    // 태그 필터 적용
    if (selectedTag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags.some(tag => tag.name.toLowerCase() === selectedTag.toLowerCase())
      );
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

  // 상위 10개 인기 태그만 표시
  const topTags = mockPopularTags.slice(0, 10);

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
            aria-label="Filter posts"
          >
            <option value="all">All Posts</option>
            <option value="following">Following</option>
            <option value="saved">Saved</option>
          </select>
          
          {/* 태그 필터 버튼 */}
          <Button 
            variant="outline" 
            onClick={toggleTagsFilter}
            className="flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            {selectedTag ? `Tag: #${selectedTag}` : 'Filter by Tags'}
          </Button>
          
          {/* 모든 태그 보기 버튼 */}
          <Button asChild variant="outline">
            <Link href="/tags" className="flex items-center">
              <TagsIcon className="h-4 w-4 mr-2" />
              Browse Topics
            </Link>
          </Button>
          
          {/* 포스트 작성 버튼 */}
          <CreatePostButton />
        </div>
      </div>

      {/* 태그 필터 섹션 */}
      {showTagsFilter && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Popular Tags</h3>
            <Button asChild variant="link" size="sm" className="text-amber-700">
              <Link href="/tags">View All Tags</Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {topTags.map((tag: TagCloudItem) => (
              <button
                key={tag.id}
                onClick={() => handleTagSelect(tag.name)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors flex items-center ${
                  selectedTag === tag.name 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                }`}
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag.name}
                {tag.count && <span className="ml-1 text-xs opacity-70">({tag.count})</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 선택된 태그 표시 */}
      {selectedTag && !showTagsFilter && (
        <div className="mb-6">
          <div className="inline-flex items-center p-2 pl-3 bg-amber-50 rounded-full">
            <span className="mr-2 text-sm text-amber-800">
              Filtering by tag: <span className="font-medium">#{selectedTag}</span>
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 rounded-full"
              onClick={() => setSelectedTag(null)}
            >
              ×
            </Button>
          </div>
        </div>
      )}

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
      
      {/* 인기 태그 및 주제 섹션 */}
      <div className="mt-12 border-t pt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-amber-700" />
            Popular Topics
          </h2>
          <Button asChild variant="link" className="text-amber-700">
            <Link href="/tags">Browse All Topics</Link>
          </Button>
        </div>
        
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <TagCloud tags={mockPopularTags.slice(0, 20)} maxTags={20} />
        </div>
      </div>
    </div>
  );
} 