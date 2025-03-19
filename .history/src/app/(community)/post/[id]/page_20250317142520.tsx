'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, MessageCircle, Bookmark, Share2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { mockCommunityPosts } from '@/data/mockCommunityPosts';
import { CommunityPost, Comment } from '@/types/community';
import ShareModal from '@/components/shared/ShareModal';

interface PostDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const postId = unwrappedParams.id;
  
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // 프로필 페이지로 이동
  const navigateToProfile = (username: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/profile/${encodeURIComponent(username)}`);
  };

  // 포스트 데이터 가져오기
  useEffect(() => {
    // 실제 앱에서는 API 호출을 통해 데이터를 가져옵니다
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        // 목업 데이터에서 ID로 포스트 찾기
        const foundPost = mockCommunityPosts.find(p => p.id === postId);
        
        if (foundPost) {
          setPost(foundPost);
          setLikeCount(foundPost.upvoteCount);
          setIsSaved(foundPost.isSaved);
          
          // 목업 댓글 데이터 생성
          const mockComments: Comment[] = [
            {
              id: '1',
              content: "Thanks for sharing your experience! I've been considering this treatment for a while.",
              author: {
                id: 'user7',
                username: 'BeautyEnthusiast',
                avatarUrl: 'https://randomuser.me/api/portraits/women/33.jpg',
                isVerified: false
              },
              createdAt: '2023-09-16T10:30:00.000Z',
              upvoteCount: 5
            },
            {
              id: '2',
              content: 'I had a similar experience at a different medspa. The results were great but it took a bit longer to see them.',
              author: {
                id: 'user8',
                username: 'SkincarePro',
                avatarUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
                isVerified: true
              },
              createdAt: '2023-09-17T14:15:00.000Z',
              upvoteCount: 3
            }
          ];
          
          setComments(mockComments);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  // 좋아요 처리
  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  // 저장 처리
  const handleSave = () => {
    setIsSaved(!isSaved);
    
    // 로컬 스토리지에 저장 상태 업데이트 (임시 구현)
    if (post) {
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
    }
  };

  // 공유 처리
  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  // 댓글 제출 처리
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    setIsSubmittingComment(true);
    
    try {
      // 실제 앱에서는 API 호출을 통해 댓글을 저장합니다
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 새 댓글 추가
      const newComment: Comment = {
        id: `temp-${Date.now()}`,
        content: commentText,
        author: {
          id: 'current-user',
          username: 'CurrentUser',
          avatarUrl: 'https://randomuser.me/api/portraits/women/17.jpg',
          isVerified: false
        },
        createdAt: new Date().toISOString(),
        upvoteCount: 0
      };
      
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-1/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-amber-900 mb-4">Post Not Found</h1>
          <p className="mb-6">The post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/community">
            <Button className="bg-amber-900 hover:bg-amber-800 text-white">
              Back to Community
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 현재 URL 생성
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/post/${post.id}`
    : '';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 뒤로 가기 버튼 */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="pl-0 text-amber-900 hover:text-amber-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Community
          </Button>
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* 포스트 이미지 */}
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

        {/* 포스트 내용 */}
        <div className="p-6">
          {/* 작성자 정보 */}
          <div className="flex items-center mb-4">
            <div 
              className="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
              onClick={(e) => navigateToProfile(post.author.username, e)}
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

          {/* 포스트 제목 */}
          <h1 className="text-2xl font-bold mb-4 text-amber-900">{post.title}</h1>

          {/* 태그 */}
          <div className="flex flex-wrap gap-2 mb-6">
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

          {/* 포스트 본문 */}
          <div 
            className="prose max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* 액션 버튼 */}
          <div className="flex items-center justify-between border-t border-b py-4 my-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLike}
              className={`flex items-center gap-1 ${isLiked ? 'text-amber-900' : 'text-gray-600'}`}
            >
              <Heart size={20} className={isLiked ? 'fill-amber-900' : ''} />
              <span>{likeCount}</span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-1 text-gray-600"
            >
              <MessageCircle size={20} />
              <span>{comments.length}</span>
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

          {/* 댓글 섹션 */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-6">Comments ({comments.length})</h2>
            
            {/* 댓글 작성 폼 */}
            <form onSubmit={handleSubmitComment} className="mb-8">
              <Textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="mb-3 min-h-[100px]"
              />
              <Button 
                type="submit" 
                className="bg-amber-900 hover:bg-amber-800 text-white"
                disabled={isSubmittingComment || !commentText.trim()}
              >
                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
              </Button>
            </form>
            
            {/* 댓글 목록 */}
            <div className="space-y-6">
              {comments.map(comment => (
                <div key={comment.id} className="border-b pb-6">
                  <div className="flex items-start">
                    <div 
                      className="flex items-start hover:opacity-80 transition-opacity cursor-pointer"
                      onClick={(e) => navigateToProfile(comment.author.username, e)}
                    >
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={comment.author.avatarUrl} alt={comment.author.username} />
                        <AvatarFallback>{comment.author.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span className="font-medium text-sm mr-1">{comment.author.username}</span>
                          {comment.author.isVerified && (
                            <CheckCircle size={12} className="text-amber-900" />
                          )}
                          <span className="text-xs text-gray-500 ml-2">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-2 ml-11">{comment.content}</p>
                  
                  <div className="flex items-center mt-2 ml-11">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs text-gray-500"
                    >
                      <Heart size={14} className="mr-1" />
                      <span>{comment.upvoteCount}</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs text-gray-500"
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>

      {/* 공유 모달 */}
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        url={shareUrl}
        title={post.title}
      />
    </div>
  );
} 