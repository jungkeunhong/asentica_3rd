'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Filter, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockSavedContent } from '@/data/mockUserData';
import { SavedContent } from '@/types/user';

type ContentFilter = 'all' | 'posts' | 'reviews';

export default function SavedContentPage() {
  const [filter, setFilter] = useState<ContentFilter>('all');
  
  // Filter saved content based on type
  const filteredContent = filter === 'all' 
    ? mockSavedContent 
    : mockSavedContent.filter(item => 
        (filter === 'posts' && (item.contentType === 'post' || item.contentType === 'comment')) ||
        (filter === 'reviews' && item.contentType === 'review')
      );
  
  // Function to render different content types
  const renderContent = (item: SavedContent) => {
    const content = item.content;
    
    if (!content) {
      return <div className="italic text-gray-500">Content unavailable</div>;
    }
    
    switch (item.contentType) {
      case 'post':
        return (
          <div>
            <h3 className="font-medium">
              <Link 
                href={`/community/post/${item.contentId}`}
                className="text-amber-700 hover:text-amber-800 hover:underline"
              >
                {content.title}
              </Link>
            </h3>
            {content.excerpt && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{content.excerpt}</p>
            )}
            {content.tags && (
              <div className="flex flex-wrap gap-1 mt-2">
                {content.tags.map((tag) => (
                  <span key={tag.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
        
      case 'review':
        return (
          <div>
            <h3 className="font-medium">
              <Link 
                href={`/reviews/${item.contentId}`}
                className="text-amber-700 hover:text-amber-800 hover:underline"
              >
                {content.title}
              </Link>
            </h3>
            {content.excerpt && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{content.excerpt}</p>
            )}
            {content.tags && (
              <div className="flex flex-wrap gap-1 mt-2">
                {content.tags.map((tag) => (
                  <span key={tag.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
        
      case 'comment':
        return (
          <div>
            <h3 className="font-medium">
              Comment on{" "}
              <Link 
                href={`/community/post/${item.contentId}`}
                className="text-amber-700 hover:text-amber-800 hover:underline"
              >
                {content.title || "a post"}
              </Link>
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{content.content}</p>
          </div>
        );
        
      default:
        return <div className="italic text-gray-500">Unsupported content type</div>;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href="/my-page" className="flex items-center text-amber-700 hover:text-amber-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Saved Content</h1>
        
        <Tabs value={filter} onValueChange={(value) => setFilter(value as ContentFilter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {filteredContent.length > 0 ? (
        <div className="space-y-4">
          {filteredContent.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {renderContent(item)}
                    <div className="mt-2 text-xs text-gray-500">
                      Saved {formatDistanceToNow(new Date(item.savedAt), { addSuffix: true })}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-500">
                    <XCircle className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Saved Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              You haven&apos;t saved any {filter === 'all' ? 'content' : filter} yet.
            </p>
            
            <Button asChild>
              <Link href="/community">
                Browse Community
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 