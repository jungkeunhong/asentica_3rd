'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Image as ImageIcon, User, MapPin, Music, Tags, Share2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostEditor from '../../../components/community/PostEditor';
import PostFormats from '../../../components/community/PostFormats';
import TagSelector from '../../../components/community/TagSelector';
import { usePostDraft } from '../../../hooks/usePostDraft';
import { PostFormat } from '@/types/community';
import { postsApi } from '@/lib/supabase';
import Link from 'next/link';

export default function CreatePostPage() {
  const router = useRouter();
  const { draft, updateDraft, saveDraft, publishDraft } = usePostDraft();
  const [selectedFormat, setSelectedFormat] = useState<PostFormat>('discussion');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // Handle format change
  const handleFormatChange = (format: PostFormat) => {
    setSelectedFormat(format);
    updateDraft({ format });
  };

  // Handle title change
  const handleTitleChange = (title: string) => {
    updateDraft({ title });
  };

  // Handle content change
  const handleContentChange = (content: string) => {
    updateDraft({ content });
  };

  // Handle tags change
  const handleTagsChange = (tags: string[]) => {
    updateDraft({ tags });
    setShowTagSelector(false);
  };

  // Handle publish post
  const handlePublish = async () => {
    if (!draft.title?.trim()) {
      setPublishError('Please add a caption to your post');
      return;
    }
    
    setIsSubmitting(true);
    setPublishError(null);
    
    try {
      // 로컬 저장
      await publishDraft();
      
      // Supabase에 저장
      try {
        const result = await postsApi.createPost(draft);
        
        if (!result) {
          throw new Error('Failed to save post to database. Please try again.');
        }
        
        // 성공 시 커뮤니티 페이지로 이동
        router.push('/community');
      } catch (apiError) {
        // Handle specific API errors
        const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
        
        if (errorMessage.includes('User must be logged in')) {
          throw new Error('You must be logged in to publish a post.');
        } else {
          console.error('API Error:', apiError);
          throw new Error(`Failed to save post: ${errorMessage}`);
        }
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      setPublishError(`Error: ${errorMessage}`);
      
      // In case of error, don't clear the draft so user can try again
      saveDraft();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save draft when component unmounts
  useEffect(() => {
    return () => {
      saveDraft();
    };
  }, [saveDraft]);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Fixed Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 mr-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">New post</h1>
        </div>
        
        <Button 
          variant="ghost"
          size="sm"
          onClick={handlePublish}
          disabled={isSubmitting}
          className="text-blue-500 font-semibold"
        >
          {isSubmitting ? 'Sharing...' : 'Share'}
        </Button>
      </header>
      
      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        {/* Error Message */}
        {publishError && (
          <div className="m-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {publishError}
          </div>
        )}
        
        {/* Post Type Selection */}
        <div className="px-4 py-3 border-b">
          <div className="flex overflow-x-auto gap-2 no-scrollbar">
            <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">
              Poll
            </Button>
            <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">
              Prompt
            </Button>
            <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">
              Question
            </Button>
            <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">
              Review
            </Button>
            <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">
              Before & After
            </Button>
          </div>
        </div>
        
        {/* Caption/Content Input */}
        <div className="p-4">
          <textarea
            placeholder="Add a caption..."
            className="w-full min-h-[150px] text-base resize-none border-none focus:outline-none"
            value={draft.title || ''}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
        </div>
        
        {/* Tags */}
        {draft.tags && draft.tags.length > 0 && (
          <div className="px-4 mb-3 flex flex-wrap gap-1">
            {draft.tags.map((tag, index) => (
              <div key={index} className="bg-blue-50 text-blue-600 rounded-full px-2 py-0.5 text-sm flex items-center">
                #{tag}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => {
                    const newTags = [...draft.tags || []];
                    newTags.splice(index, 1);
                    updateDraft({ tags: newTags });
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {/* Tag Selector Modal */}
        {showTagSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-25 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold">Select Tags</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-1"
                  onClick={() => setShowTagSelector(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-4">
                <TagSelector 
                  selectedTags={draft.tags || []}
                  onChange={handleTagsChange}
                />
              </div>
              <div className="p-4 border-t flex justify-end">
                <Button onClick={() => setShowTagSelector(false)}>Done</Button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Fixed Footer - Options */}
      <footer className="border-t">
        <div className="divide-y">
          <button 
            className="flex items-center p-4 w-full text-left"
            onClick={() => setShowTagSelector(true)}
          >
            <User className="h-6 w-6 mr-3" />
            <span className="text-base">Tag people</span>
            <span className="ml-auto">›</span>
          </button>
          
          <button className="flex items-center p-4 w-full text-left">
            <MapPin className="h-6 w-6 mr-3" />
            <span className="text-base">Add location</span>
            <span className="ml-auto">›</span>
          </button>
          
          <button className="flex items-center p-4 w-full text-left">
            <Music className="h-6 w-6 mr-3" />
            <span className="text-base">Add music</span>
            <span className="ml-auto">›</span>
          </button>
          
          <button 
            className="flex items-center p-4 w-full text-left"
            onClick={() => setShowTagSelector(true)}
          >
            <Tags className="h-6 w-6 mr-3" />
            <span className="text-base">Add tags</span>
            <span className="ml-auto">›</span>
          </button>
          
          <button className="flex items-center p-4 w-full text-left">
            <Share2 className="h-6 w-6 mr-3" />
            <span className="text-base">Also share on...</span>
            <span className="ml-auto">›</span>
          </button>
        </div>
      </footer>
    </div>
  );
} 