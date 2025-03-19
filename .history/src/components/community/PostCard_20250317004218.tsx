'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageCircle, Bookmark, Share2, CheckCircle } from 'lucide-react';
import { CommunityPost } from '@/types/community';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: CommunityPost;
}

export default function PostCard({ post }: PostCardProps) {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [upvoteCount, setUpvoteCount] = useState(post.upvoteCount);

  // Format date
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  // Handle upvote
  const handleUpvote = () => {
    if (isUpvoted) {
      setUpvoteCount(prev => prev - 1);
    } else {
      setUpvoteCount(prev => prev + 1);
    }
    setIsUpvoted(!isUpvoted);
  };

  // Handle save
  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  // Handle share
  const handleShare = () => {
    // In a real app, this would open a share dialog
    alert(`Sharing post: ${post.title}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-0">
        {/* Post Image (if available) */}
        {post.imageUrl && (
          <div className="relative h-48 w-full">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Post Content */}
        <div className="p-5">
          {/* Author Info */}
          <div className="flex items-center mb-3">
            <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
              <Image
                src={post.author.avatarUrl}
                alt={post.author.username}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium mr-1">{post.author.username}</span>
              {post.author.isVerified && (
                <CheckCircle size={14} className="text-blue-500" />
              )}
              <span className="text-xs text-gray-500 ml-2">{formattedDate}</span>
            </div>
          </div>

          {/* Post Title */}
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h3>

          {/* Post Excerpt */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">{post.excerpt}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map(tag => (
              <Badge 
                key={tag.id} 
                variant="outline"
                className="text-xs bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-3 bg-gray-50 border-t">
        {/* Upvote Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleUpvote}
          className={`flex items-center gap-1 text-xs ${isUpvoted ? 'text-amber-600' : 'text-gray-600'}`}
        >
          <ThumbsUp size={16} className={isUpvoted ? 'fill-amber-600' : ''} />
          <span>{upvoteCount}</span>
        </Button>

        {/* Comment Button */}
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-1 text-xs text-gray-600"
        >
          <MessageCircle size={16} />
          <span>{post.commentCount}</span>
        </Button>

        {/* Save Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSave}
          className={`flex items-center gap-1 text-xs ${isSaved ? 'text-amber-900' : 'text-gray-600'}`}
        >
          <Bookmark size={16} className={isSaved ? 'fill-amber-600' : ''} />
        </Button>

        {/* Share Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleShare}
          className="flex items-center gap-1 text-xs text-gray-600"
        >
          <Share2 size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
} 