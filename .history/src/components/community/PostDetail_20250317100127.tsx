'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  CheckCircle, 
  Clock, 
  Eye, 
  ThumbsUp, 
  ThumbsDown,
  Shield,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow, format } from 'date-fns';
import { CommunityPost, Author } from '@/types/community';
import ShareModal from '@/components/shared/ShareModal';
import CommentSection from '@/components/community/CommentSection';
import { motion } from 'framer-motion';

interface PostDetailProps {
  post: CommunityPost;
  relatedPosts: CommunityPost[];
  currentUser?: Author | null;
  onAddComment: (content: string, parentId?: string | null) => Promise<void>;
}

export default function PostDetail({ 
  post, 
  relatedPosts, 
  currentUser,
  onAddComment
}: PostDetailProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likeCount, setLikeCount] = useState(post.upvoteCount);
  const [dislikeCount, setDislikeCount] = useState(post.downvoteCount || 0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeBeforeAfterTab, setActiveBeforeAfterTab] = useState<'before' | 'after' | 'comparison'>('comparison');

  // Handle like
  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
      
      // If post was disliked, remove the dislike
      if (isDisliked) {
        setDislikeCount(prev => prev - 1);
        setIsDisliked(false);
      }
    }
  };

  // Handle dislike
  const handleDislike = () => {
    if (isDisliked) {
      setDislikeCount(prev => prev - 1);
      setIsDisliked(false);
    } else {
      setDislikeCount(prev => prev + 1);
      setIsDisliked(true);
      
      // If post was liked, remove the like
      if (isLiked) {
        setLikeCount(prev => prev - 1);
        setIsLiked(false);
      }
    }
  };

  // Handle save
  const handleSave = () => {
    setIsSaved(!isSaved);
    
    // Update localStorage (temporary implementation)
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
    
    if (!isSaved) {
      // Save post
      if (!savedPosts.includes(post.id)) {
        savedPosts.push(post.id);
      }
    } else {
      // Unsave post
      const index = savedPosts.indexOf(post.id);
      if (index > -1) {
        savedPosts.splice(index, 1);
      }
    }
    
    localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
  };

  // Handle share
  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  // Navigate to author profile
  const navigateToProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/profile/${encodeURIComponent(post.author.username)}`);
  };

  // Generate share URL
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/posts/${post.id}`
    : '';

  // Filter author's other posts
  const authorOtherPosts = relatedPosts.filter(p => 
    p.author.id === post.author.id && p.id !== post.id
  ).slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="pl-0 text-amber-900 hover:text-amber-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Community
          </Button>
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Post header */}
        <div className="p-6 border-b">
          <div className="flex items-center mb-4">
            <div 
              className="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
              onClick={navigateToProfile}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={post.author.avatarUrl} alt={post.author.username} />
                <AvatarFallback>{post.author.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <span className="font-medium mr-1">{post.author.username}</span>
                  {post.author.isVerified && (
                    <CheckCircle size={14} className="text-amber-900" />
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-amber-900">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
            {post.readingTime && (
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>{post.readingTime} min read</span>
              </div>
            )}
            
            {post.viewCount && (
              <div className="flex items-center">
                <Eye size={14} className="mr-1" />
                <span>{post.viewCount.toLocaleString()} views</span>
              </div>
            )}
            
            {post.isFactChecked && (
              <div className="flex items-center text-green-600">
                <Shield size={14} className="mr-1" />
                <span>Fact checked</span>
                {post.factCheckScore && (
                  <span className="ml-1">({post.factCheckScore}%)</span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
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

        {/* Post image (if available) */}
        {post.imageUrl && (
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Before/After images (if available) */}
        {post.beforeAfterImages && post.beforeAfterImages.length > 0 && (
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Before & After</h2>
            
            <Tabs 
              defaultValue="comparison" 
              value={activeBeforeAfterTab}
              onValueChange={(value) => setActiveBeforeAfterTab(value as 'before' | 'after' | 'comparison')}
              className="mb-6"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="comparison" className="text-amber-900 data-[state=active]:bg-amber-50">
                  Comparison
                </TabsTrigger>
                <TabsTrigger value="before" className="text-amber-900 data-[state=active]:bg-amber-50">
                  Before
                </TabsTrigger>
                <TabsTrigger value="after" className="text-amber-900 data-[state=active]:bg-amber-50">
                  After
                </TabsTrigger>
              </TabsList>
              
              {post.beforeAfterImages.map((image, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <TabsContent value="comparison" className="m-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative h-64 w-full rounded-lg overflow-hidden">
                        <Image
                          src={image.before}
                          alt="Before"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-1">
                          Before
                        </div>
                      </div>
                      <div className="relative h-64 w-full rounded-lg overflow-hidden">
                        <Image
                          src={image.after}
                          alt="After"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-1">
                          After
                        </div>
                      </div>
                    </div>
                    {image.caption && (
                      <p className="text-sm text-gray-500 mt-2 text-center">{image.caption}</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="before" className="m-0">
                    <div className="relative h-80 w-full rounded-lg overflow-hidden">
                      <Image
                        src={image.before}
                        alt="Before"
                        fill
                        className="object-contain"
                      />
                    </div>
                    {image.caption && (
                      <p className="text-sm text-gray-500 mt-2 text-center">{image.caption} (Before)</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="after" className="m-0">
                    <div className="relative h-80 w-full rounded-lg overflow-hidden">
                      <Image
                        src={image.after}
                        alt="After"
                        fill
                        className="object-contain"
                      />
                    </div>
                    {image.caption && (
                      <p className="text-sm text-gray-500 mt-2 text-center">{image.caption} (After)</p>
                    )}
                  </TabsContent>
                </div>
              ))}
            </Tabs>
          </div>
        )}

        {/* Post content */}
        <div className="p-6">
          <div 
            className="prose max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Action buttons */}
          <div className="flex items-center justify-between border-t border-b py-4 my-6">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLike}
                className={`flex items-center gap-1 ${isLiked ? 'text-amber-900' : 'text-gray-600'}`}
              >
                <ThumbsUp size={20} className={isLiked ? 'fill-amber-900' : ''} />
                <span>{likeCount}</span>
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDislike}
                className={`flex items-center gap-1 ${isDisliked ? 'text-gray-900' : 'text-gray-600'}`}
              >
                <ThumbsDown size={20} className={isDisliked ? 'fill-gray-900' : ''} />
                <span>{dislikeCount}</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-1 text-gray-600"
              >
                <MessageCircle size={20} />
                <span>{post.commentCount}</span>
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSave}
                className={`flex items-center gap-1 ${isSaved ? 'text-amber-900' : 'text-gray-600'}`}
              >
                <Bookmark size={20} className={isSaved ? 'fill-amber-900' : ''} />
                <span>Save</span>
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleShare}
                className="flex items-center gap-1 text-gray-600"
              >
                <Share2 size={20} />
                <span>Share</span>
              </Button>
            </div>
          </div>

          {/* Author's other posts */}
          {authorOtherPosts.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">More from {post.author.username}</h2>
                <Link 
                  href={`/profile/${encodeURIComponent(post.author.username)}`}
                  className="text-amber-900 hover:underline flex items-center text-sm"
                >
                  View all posts
                  <ChevronRight size={16} />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {authorOtherPosts.map(relatedPost => (
                  <motion.div
                    key={relatedPost.id}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link href={`/posts/${relatedPost.id}`} className="block">
                      <div className="bg-gray-50 rounded-lg overflow-hidden border hover:shadow-md transition-shadow">
                        {relatedPost.imageUrl && (
                          <div className="relative h-32 w-full">
                            <Image
                              src={relatedPost.imageUrl}
                              alt={relatedPost.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="p-3">
                          <h3 className="font-medium text-sm line-clamp-2 mb-1">{relatedPost.title}</h3>
                          <p className="text-xs text-gray-500">
                            {format(new Date(relatedPost.createdAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Comments section */}
          <CommentSection 
            postId={post.id}
            comments={[]} // This would be populated from the API
            currentUser={currentUser}
            onAddComment={onAddComment}
          />
        </div>
      </article>

      {/* Share modal */}
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        url={shareUrl}
        title={post.title}
      />
    </div>
  );
} 