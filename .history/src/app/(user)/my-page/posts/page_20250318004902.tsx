'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ActivityFeed } from '@/components/user/ActivityFeed';
import { mockUserActivities } from '@/data/mockUserData';
import { ActivityType } from '@/types/user';

type PostFilter = 'all' | ActivityType;

export default function UserPostsPage() {
  const [filter, setFilter] = useState<PostFilter>('all');
  
  // Filter activities to show only posts if needed
  const filteredActivities = filter === 'all' 
    ? mockUserActivities 
    : mockUserActivities.filter(activity => activity.type === filter);
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href="/my-page" className="flex items-center text-amber-700 hover:text-amber-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Posts & Activity</h1>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={filter} onValueChange={(value) => setFilter(value as PostFilter)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activity</SelectItem>
              <SelectItem value="post_created">Posts</SelectItem>
              <SelectItem value="comment_created">Comments</SelectItem>
              <SelectItem value="review_created">Reviews</SelectItem>
              <SelectItem value="post_liked">Likes</SelectItem>
              <SelectItem value="post_saved">Saved Items</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredActivities.length > 0 ? (
        <Card>
          <CardContent className="p-6">
            <ActivityFeed 
              activities={filteredActivities} 
              maxItems={50} 
              showTitle={false}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Activities Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              You haven&apos;t {filter === 'post_created' ? 'created any posts' : 
                filter === 'comment_created' ? 'made any comments' :
                filter === 'review_created' ? 'written any reviews' :
                filter === 'post_liked' ? 'liked any posts' :
                filter === 'post_saved' ? 'saved any items' :
                'performed any activities'} yet.
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