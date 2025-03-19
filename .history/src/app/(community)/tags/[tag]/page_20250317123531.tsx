'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Heart, Users, TrendingUp, Filter, 
  Clock, ChevronDown, Info, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TagCloudItem, CommunityPost, Author, SortOption } from '@/types/community';
import PostCard from '@/components/community/PostCard';
import CommunityFeedSkeleton from '@/components/community/CommunityFeedSkeleton';
import EmptyState from '@/components/community/EmptyState';
import { mockPopularTags, mockTrendingTags, mockTagCategories } from '../mock-data';

interface TagPageProps {
  params: {
    tag: string;
  }
}

export default function TagPage({ params }: TagPageProps) {
  const router = useRouter();
  const tagName = decodeURIComponent(params.tag);
  
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [tagData, setTagData] = useState<TagCloudItem | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [relatedTags, setRelatedTags] = useState<TagCloudItem[]>([]);
  const [experts, setExperts] = useState<Author[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('trending');

  // Fetch tag data and related posts
  useEffect(() => {
    const fetchTagData = async () => {
      setIsLoading(true);
      
      try {
        // Find tag in mock data
        const allTags = [...mockPopularTags, ...mockTrendingTags];
        const foundTag = allTags.find(t => 
          t.name.toLowerCase() === tagName.toLowerCase()
        );
        
        // Find category tags
        const categoryWithTag = mockTagCategories.find(category => 
          category.tags.some(t => t.name.toLowerCase() === tagName.toLowerCase())
        );
        
        // Get related tags from the same category
        const relatedFromCategory = categoryWithTag 
          ? categoryWithTag.tags
              .filter(t => t.name.toLowerCase() !== tagName.toLowerCase())
              .slice(0, 6)
          : [];
          
        // Combine with trending tags if needed
        const combinedRelated = relatedFromCategory.length >= 6 
          ? relatedFromCategory 
          : [
              ...relatedFromCategory, 
              ...mockTrendingTags
                .filter(t => t.name.toLowerCase() !== tagName.toLowerCase())
                .slice(0, 6 - relatedFromCategory.length)
            ];
        
        // Mock experts
        const mockExperts: Author[] = [
          {
            id: 'e1',
            username: 'drderm',
            avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
            isVerified: true,
            glow: 4850
          },
          {
            id: 'e2',
            username: 'skinexpert',
            avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
            isVerified: true,
            glow: 3620
          },
          {
            id: 'e3',
            username: 'beautyscience',
            avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
            isVerified: true,
            glow: 2540
          },
        ];
        
        // Mock empty results for now
        setPosts([]);
        setTagData(foundTag || { 
          id: '0', 
          name: tagName, 
          count: Math.floor(Math.random() * 300) + 20 
        });
        setRelatedTags(combinedRelated);
        setExperts(mockExperts);
      } catch (error) {
        console.error('Error fetching tag data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTagData();
  }, [tagName]);

  // Toggle follow status
  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  // Handle sort change
  const handleSortChange = (value: SortOption) => {
    setSortOption(value);
    // In a real app, refetch posts with the new sort option
  };

  // If we're still loading the tag
  if (isLoading || !tagData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse bg-gray-200 h-10 w-48 mb-8 rounded-md" />
        <CommunityFeedSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4"
          onClick={() => router.push('/tags')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Topics
        </Button>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1 flex items-center">
              #{tagData.name}
              <span className="text-base font-normal text-gray-500 ml-3">
                {tagData.count} posts
              </span>
            </h1>
            
            <p className="text-gray-600 max-w-2xl">
              {tagData.description || `Explore posts, discussions, and content related to ${tagData.name} from our community.`}
            </p>
          </div>
          
          <Button 
            onClick={toggleFollow}
            className={isFollowing ? "bg-amber-50 text-amber-900 hover:bg-amber-100" : ""}
            variant={isFollowing ? "outline" : "default"}
          >
            {isFollowing ? (
              <>
                <Heart className="h-4 w-4 mr-2 fill-amber-900" />
                Following
              </>
            ) : (
              <>
                <Heart className="h-4 w-4 mr-2" />
                Follow
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Sort Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Sort by:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    {sortOption === 'trending' && <TrendingUp className="h-4 w-4 mr-2" />}
                    {sortOption === 'latest' && <Clock className="h-4 w-4 mr-2" />}
                    {sortOption === 'popular' && <Star className="h-4 w-4 mr-2" />}
                    {sortOption === 'trending' && 'Trending'}
                    {sortOption === 'latest' && 'Newest'}
                    {sortOption === 'popular' && 'Top'}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleSortChange('trending')}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange('latest')}>
                    <Clock className="h-4 w-4 mr-2" />
                    Newest
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange('popular')}>
                    <Star className="h-4 w-4 mr-2" />
                    Top All-Time
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          
          {/* Posts */}
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No posts yet"
              description={`Be the first to post about #${tagData.name}`}
              action={
                <Button asChild>
                  <Link href="/create">
                    Create Post
                  </Link>
                </Button>
              }
            />
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* About This Tag */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <h3 className="text-md font-semibold mb-3 flex items-center">
              <Info className="h-4 w-4 mr-2 text-amber-700" />
              About #{tagData.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              {tagData.description || `Posts related to ${tagData.name} in our community. Follow this tag to stay updated.`}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Created 2020
              </span>
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {Math.floor(Math.random() * 500) + 50} followers
              </span>
            </div>
          </div>
          
          {/* Related Tags */}
          {relatedTags.length > 0 && (
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <h3 className="text-md font-semibold mb-3">Related Tags</h3>
              <div className="flex flex-wrap gap-2">
                {relatedTags.map(tag => (
                  <Link
                    key={tag.id}
                    href={`/tags/${encodeURIComponent(tag.name)}`}
                    className="px-3 py-1.5 bg-amber-50 text-amber-900 rounded-full text-sm hover:bg-amber-100 transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Expert Contributors */}
          {experts.length > 0 && (
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <h3 className="text-md font-semibold mb-3">Expert Contributors</h3>
              <div className="space-y-3">
                {experts.map(expert => (
                  <Link
                    key={expert.id}
                    href={`/profile/${expert.username}`}
                    className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <img 
                      src={expert.avatarUrl} 
                      alt={expert.username}
                      className="h-10 w-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <div className="font-medium flex items-center">
                        @{expert.username}
                        {expert.isVerified && (
                          <svg className="w-4 h-4 ml-1 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                          </svg>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {expert.glow?.toLocaleString()} glow
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 