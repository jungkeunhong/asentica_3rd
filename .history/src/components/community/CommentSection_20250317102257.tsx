'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MessageCircle, 
  ChevronDown, 
  CheckCircle, 
  MoreHorizontal,
  ThumbsUp,
  Reply,
  Edit,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Comment, CommentSortOption, Author } from '@/types/community';
import { motion, AnimatePresence } from 'framer-motion';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  currentUser?: Author | null;
  onAddComment: (content: string, parentId?: string | null) => Promise<void>;
}

export default function CommentSection({ 
  postId, 
  comments: initialComments, 
  currentUser, 
  onAddComment 
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortOption, setSortOption] = useState<CommentSortOption>('top');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<string[]>([]);
  const [likedComments, setLikedComments] = useState<string[]>([]);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  // Sort comments based on selected option
  const sortedComments = [...comments].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'top':
        return b.likeCount - a.likeCount;
      case 'controversial':
        // Simplified controversial sorting without downvotes
        return Math.abs(a.likeCount - 5) - Math.abs(b.likeCount - 5);
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Filter top-level comments (those without parent comments)
  const topLevelComments = sortedComments.filter(comment => !comment.parentId);

  // Handle comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await onAddComment(commentText, null);
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle reply submission
  const handleSubmitReply = async (parentId: string) => {
    if (!replyText.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await onAddComment(replyText, parentId);
      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error posting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle reply form
  const toggleReplyForm = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setEditingComment(null);
  };

  // Toggle edit form
  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditText(comment.content);
    setReplyingTo(null);
  };

  // Toggle replies visibility
  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => 
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  // Handle like comment
  const handleLikeComment = (commentId: string) => {
    const isLiked = likedComments.includes(commentId);
    
    setLikedComments(prev => 
      isLiked
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
    
    setComments(prev => 
      prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likeCount: isLiked ? comment.likeCount - 1 : comment.likeCount + 1
          };
        }
        
        // Check in replies
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  likeCount: isLiked ? reply.likeCount - 1 : reply.likeCount + 1
                };
              }
              return reply;
            })
          };
        }
        
        return comment;
      })
    );
  };

  // Navigate to user profile
  const navigateToProfile = (username: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/profile/${encodeURIComponent(username)}`);
  };

  // Render a single comment
  const renderComment = (comment: Comment, isReply = false) => {
    const isLiked = likedComments.includes(comment.id);
    const showReplyForm = replyingTo === comment.id;
    const hasReplies = comment.replies && comment.replies.length > 0;
    const areRepliesExpanded = expandedReplies.includes(comment.id);
    
    return (
      <motion.div 
        key={comment.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`${isReply ? 'ml-8 mt-4' : 'border-b pb-6 mb-6'}`}
      >
        <div className="flex items-start">
          <div 
            className="flex-shrink-0 cursor-pointer"
            onClick={(e) => navigateToProfile(comment.author.username, e)}
          >
            <Avatar className="h-8 w-8 mr-3">
              <AvatarImage src={comment.author.avatarUrl} alt={comment.author.username} />
              <AvatarFallback>{comment.author.username.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center flex-wrap">
              <div 
                className="flex items-center cursor-pointer hover:underline mr-2"
                onClick={(e) => navigateToProfile(comment.author.username, e)}
              >
                <span className="font-medium text-sm">{comment.author.username}</span>
                {comment.author.isVerified && (
                  <CheckCircle size={12} className="text-amber-900 ml-1" />
                )}
              </div>
              
              {comment.author.glow && (
                <span className="text-xs bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded mr-2">
                  {comment.author.glow} glow
                </span>
              )}
              
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                {comment.isEdited && <span className="ml-1">(edited)</span>}
              </span>
            </div>
            
            {editingComment === comment.id ? (
              <div className="mt-2">
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="min-h-[100px] mb-2"
                  placeholder="Edit your comment..."
                />
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="bg-amber-900 hover:bg-amber-800 text-white"
                    onClick={() => {
                      // Handle edit submission
                      setEditingComment(null);
                    }}
                  >
                    Save
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setEditingComment(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
            )}
            
            <div className="flex items-center mt-2 gap-2">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`h-6 px-2 ${isLiked ? 'text-amber-900' : 'text-gray-500'}`}
                  onClick={() => handleLikeComment(comment.id)}
                >
                  <ThumbsUp className={`h-4 w-4 mr-1 ${isLiked ? 'fill-amber-900' : ''}`} />
                  <span>{comment.likeCount}</span>
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs text-gray-500 hover:text-amber-900"
                onClick={() => toggleReplyForm(comment.id)}
              >
                <Reply size={14} className="mr-1" />
                Reply
              </Button>
              
              {currentUser?.id === comment.author.id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs text-gray-500"
                    >
                      <MoreHorizontal size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditComment(comment)}>
                      <Edit size={14} className="mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 size={14} className="mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              {!currentUser?.id && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs text-gray-500"
                  onClick={() => {
                    // Handle report
                  }}
                >
                  <AlertTriangle size={14} className="mr-1" />
                  Report
                </Button>
              )}
            </div>
            
            {/* Reply form */}
            <AnimatePresence>
              {showReplyForm && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3"
                >
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="min-h-[80px] mb-2"
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-amber-900 hover:bg-amber-800 text-white"
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={isSubmitting || !replyText.trim()}
                    >
                      {isSubmitting ? 'Posting...' : 'Post Reply'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setReplyingTo(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Replies */}
        {hasReplies && !areRepliesExpanded && (
          <div className="mt-3 ml-11">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-amber-900 flex items-center p-0 h-auto"
              onClick={() => toggleReplies(comment.id)}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>Show {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}</span>
            </Button>
          </div>
        )}
        
        {hasReplies && areRepliesExpanded && (
          <div className="mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-2 text-amber-900"
              onClick={() => toggleReplies(comment.id)}
            >
              <span>Hide replies</span>
            </Button>
            
            <div className="space-y-3">
              {comment.replies!.map(reply => renderComment(reply, true))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  // Focus on comment input when component mounts
  useEffect(() => {
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, []);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Comments ({comments.length})</h2>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-sm">
              Sort by: {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
              <ChevronDown size={14} className="ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortOption('top')}>
              Top
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption('newest')}>
              Newest
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption('controversial')}>
              Controversial
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Comment form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <Textarea
          ref={commentInputRef}
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="mb-3 min-h-[100px]"
        />
        <Button 
          type="submit" 
          className="bg-amber-900 hover:bg-amber-800 text-white"
          disabled={isSubmitting || !commentText.trim()}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </form>
      
      {/* Comments list */}
      <div className="space-y-0">
        {topLevelComments.length > 0 ? (
          topLevelComments.map(comment => renderComment(comment))
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
} 