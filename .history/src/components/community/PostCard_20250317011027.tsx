'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Bookmark, Share2, CheckCircle } from 'lucide-react';
import { CommunityPost } from '@/types/community';
import { formatDistanceToNow } from 'date-fns';
import ShareModal from '@/components/shared/ShareModal';

interface PostCardProps {
  post: CommunityPost;
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likeCount, setLikeCount] = useState(post.upvoteCount);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Format date
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  // Handle like
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  // Handle save
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 실제 앱에서는 여기서 API 호출을 통해 서버에 저장 상태를 업데이트합니다
    setIsSaved(!isSaved);
    
    // 로컬 스토리지에 저장 상태 업데이트 (임시 구현)
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
    
    if (!isSaved) {
      // 저장하기
      if (!savedPosts.includes(post.id)) {
        savedPosts.push(post.id);
      }
    } else {
      // 저장 취소하기
      const index = savedPosts.indexOf(post.id);
      if (index > -1) {
        savedPosts.splice(index, 1);
      }
    }
    
    localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
  };

  // Handle share
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareModalOpen(true);
  };

  // 공유 모달 닫기
  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  // 현재 URL 생성 (실제 앱에서는 동적으로 생성)
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/post/${post.id}`
    : '';

  return (
    <Link href={`/post/${post.id}`} className="block">
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 h-full">
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
              <Link 
                href={`/profile/${encodeURIComponent(post.author.username)}`}
                className="flex items-center hover:opacity-80 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
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
                    <CheckCircle size={14} className="text-amber-900" />
                  )}
                </div>
              </Link>
              <span className="text-xs text-gray-500 ml-2">{formattedDate}</span>
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
          {/* Like Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLike}
            className={`flex items-center gap-1 text-xs ${isLiked ? 'text-amber-900' : 'text-gray-600'}`}
          >
            <Heart size={16} className={isLiked ? 'fill-amber-900' : ''} />
            <span>{likeCount}</span>
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
            <Bookmark size={16} className={isSaved ? 'fill-amber-900' : ''} />
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

        {/* 공유 모달 */}
        <ShareModal 
          isOpen={isShareModalOpen} 
          onClose={closeShareModal} 
          url={shareUrl}
          title={post.title}
        />
      </Card>
    </Link>
  );
} 