'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostEditor from '../../../components/community/PostEditor';
import PostFormats from '../../../components/community/PostFormats';
import TagSelector from '../../../components/community/TagSelector';
import { usePostDraft } from '../../../hooks/usePostDraft';
import { PostFormat } from '@/types/community';
import { postsApi } from '@/lib/supabase';

export default function CreatePostPage() {
  const router = useRouter();
  const { draft, updateDraft, saveDraft, publishDraft } = usePostDraft();
  const [selectedFormat, setSelectedFormat] = useState<PostFormat>('discussion');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);
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
  };

  // Handle save draft
  const handleSaveDraft = async () => {
    await saveDraft();
    // Show success notification
    setShowSaveSuccess(true);
    // Hide after 3 seconds
    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 3000);
  };

  // Handle publish post
  const handlePublish = async () => {
    setIsSubmitting(true);
    setPublishError(null);
    
    try {
      // 로컬 저장
      await publishDraft();
      
      // Ensure that the post has required fields
      if (!draft.title?.trim() || !draft.content?.trim()) {
        throw new Error('Please provide both title and content for your post');
      }
      
      // Supabase에 저장
      try {
        const result = await postsApi.createPost(draft);
        
        if (!result) {
          throw new Error('Failed to save post to database. Please try again.');
        }
        
        // 성공 메시지 표시
        setShowPublishSuccess(true);
        
        // 일정 시간 후 커뮤니티 페이지로 이동
        setTimeout(() => {
          router.push('/community');
        }, 2000);
      } catch (apiError) {
        // Handle specific API errors
        const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
        
        if (errorMessage.includes('User must be logged in')) {
          throw new Error('You must be logged in to publish a post. Please sign in and try again.');
        } else {
          console.error('API Error:', apiError);
          throw new Error(`Failed to save post: ${errorMessage}`);
        }
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      setPublishError(`Error publishing post: ${errorMessage}`);
      
      // In case of error, don't clear the draft so user can try again
      saveDraft();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to discard your post?')) {
      router.push('/community');
    }
  };

  // Toggle preview mode
  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Success Modal for Publishing */}
      {showPublishSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <div className="flex items-center mb-4 text-green-600">
              <CheckCircle className="h-8 w-8 mr-3" />
              <h3 className="text-xl font-bold">Post Published!</h3>
            </div>
            <p className="mb-4">Your post has been published successfully to the community.</p>
            <p className="text-sm text-gray-500">Redirecting to community page...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-4"
            onClick={handleCancel}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <h1 className="text-2xl font-bold">Create Post</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            
            {/* Save Success Notification */}
            {showSaveSuccess && (
              <div className="absolute top-full right-0 mt-2 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md shadow-sm flex items-center whitespace-nowrap z-10">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Draft saved successfully
              </div>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={togglePreview}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
          
          <Button 
            className="bg-amber-900 hover:bg-amber-800"
            size="sm"
            onClick={handlePublish}
            disabled={isSubmitting || !draft.title || !draft.content}
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>
      
      {/* Error Message */}
      {publishError && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {publishError}
        </div>
      )}
      
      {/* Format Selection */}
      <div className="mb-6">
        <h2 className="text-sm font-medium mb-2 text-gray-500">Select Post Format</h2>
        <Tabs 
          defaultValue="discussion" 
          value={selectedFormat}
          onValueChange={(value) => handleFormatChange(value as PostFormat)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="discussion" className="text-sm">
              Discussion
            </TabsTrigger>
            <TabsTrigger value="question" className="text-sm">
              Question
            </TabsTrigger>
            <TabsTrigger value="review" className="text-sm">
              Review
            </TabsTrigger>
            <TabsTrigger value="beforeAfter" className="text-sm">
              Before & After
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Post Format Template */}
          <PostFormats 
            format={selectedFormat} 
            draft={draft}
            onTitleChange={handleTitleChange}
            isPreviewMode={isPreviewMode}
          />
          
          {/* Editor */}
          <div className="mt-6">
            <PostEditor 
              content={draft.content || ''}
              onChange={handleContentChange}
              isPreviewMode={isPreviewMode}
            />
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="bg-gray-50 p-4 rounded-lg h-fit">
          <h2 className="font-medium mb-4">Publishing Options</h2>
          
          {/* Tags */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2 text-gray-500">Tags</h3>
            <TagSelector 
              selectedTags={draft.tags || []}
              onChange={handleTagsChange}
            />
            <p className="text-xs text-gray-500 mt-2">
              Add up to 5 tags to help others find your post
            </p>
          </div>
          
          {/* Guidance */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Tips for a Great Post</h3>
            <ul className="text-xs text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="bg-amber-100 text-amber-800 rounded-full h-4 w-4 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                <span>Be specific and descriptive in your title</span>
              </li>
              <li className="flex items-start">
                <span className="bg-amber-100 text-amber-800 rounded-full h-4 w-4 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                <span>Include relevant details and context</span>
              </li>
              <li className="flex items-start">
                <span className="bg-amber-100 text-amber-800 rounded-full h-4 w-4 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                <span>Use formatting to organize your content</span>
              </li>
              <li className="flex items-start">
                <span className="bg-amber-100 text-amber-800 rounded-full h-4 w-4 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                <span>Add images to illustrate your points</span>
              </li>
              <li className="flex items-start">
                <span className="bg-amber-100 text-amber-800 rounded-full h-4 w-4 flex items-center justify-center text-xs mr-2 mt-0.5">5</span>
                <span>Be respectful and follow community guidelines</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 