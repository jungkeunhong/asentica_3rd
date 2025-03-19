'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter, TrendingUp, Clock, UserCircle } from 'lucide-react';
import PostCard from './PostCard';
import { mockCommunityPosts } from '@/data/mockCommunityPosts';
import { CommunityPost, FeedType } from '@/types/community';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';

export default function CommunityFeed() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [feedType, setFeedType] = useState<FeedType>('trending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Fetch posts based on feed type
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Sort posts based on feed type
        let sortedPosts: CommunityPost[] = [];
        
        switch (feedType) {
          case 'trending':
            sortedPosts = [...mockCommunityPosts].sort((a, b) => b.upvoteCount - a.upvoteCount);
            break;
          case 'latest':
            sortedPosts = [...mockCommunityPosts].sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            break;
          case 'for-you':
            // In a real app, this would use user preferences or behavior
            sortedPosts = [...mockCommunityPosts].filter(post => 
              post.tags.some(tag => ['Retinol', 'Vitamin C', 'Hyperpigmentation'].includes(tag.name))
            );
            break;
          default:
            sortedPosts = [...mockCommunityPosts];
        }
        
        setPosts(sortedPosts);
        setHasMore(false); // For mock data, we don't have pagination
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [feedType]);

  // Handle feed type change
  const handleFeedTypeChange = (value: string) => {
    setFeedType(value as FeedType);
  };

  // Handle load more
  const handleLoadMore = () => {
    // In a real app, this would fetch the next page of posts
    console.log('Loading more posts...');
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, index) => (
      <div 
        key={`skeleton-${index}`} 
        className="bg-gray-100 rounded-lg p-6 h-64 animate-pulse"
      >
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="flex justify-between mt-6">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Community</h1>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <Button className="bg-amber-900 hover:bg-amber-800 text-white flex items-center gap-2">
            <PlusCircle size={16} />
            <span className="hidden sm:inline">New Post</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="trending" onValueChange={handleFeedTypeChange}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span>Trending</span>
          </TabsTrigger>
          <TabsTrigger value="latest" className="flex items-center gap-2">
            <Clock size={16} />
            <span>Latest</span>
          </TabsTrigger>
          <TabsTrigger value="for-you" className="flex items-center gap-2">
            <UserCircle size={16} />
            <span>For You</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="trending" className="mt-0">
          {renderFeedContent()}
        </TabsContent>
        <TabsContent value="latest" className="mt-0">
          {renderFeedContent()}
        </TabsContent>
        <TabsContent value="for-you" className="mt-0">
          {renderFeedContent()}
        </TabsContent>
      </Tabs>
    </div>
  );

  // Helper function to render feed content
  function renderFeedContent() {
    if (error) {
      return <ErrorState message={error.message} />;
    }

    if (!loading && posts.length === 0) {
      return <EmptyState feedType={feedType} />;
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? renderSkeletons() : posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        
        {hasMore && !loading && (
          <div className="flex justify-center mt-8">
            <Button 
              variant="outline" 
              onClick={handleLoadMore}
              className="px-8"
            >
              Load More
            </Button>
          </div>
        )}
      </>
    );
  }
} 