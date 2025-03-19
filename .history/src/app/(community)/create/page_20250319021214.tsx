'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, MapPin, Tags, X, Link2, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TagSelector from '../../../components/community/TagSelector';
import { usePostDraft } from '../../../hooks/usePostDraft';
import { postsApi } from '@/lib/supabase';
import { PostFormat } from '@/types/community';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Location {
  id: string;
  name: string;
  address: string;
}

export default function CreatePostPage() {
  const router = useRouter();
  const { draft, updateDraft, saveDraft, publishDraft } = usePostDraft();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<PostFormat>('discussion');
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Handle title change
  const handleTitleChange = (title: string) => {
    updateDraft({ title });
  };

  // Handle post type change
  const handleTypeChange = (type: PostFormat) => {
    setSelectedType(type);
    updateDraft({ format: type });
  };

  // Handle tags change
  const handleTagsChange = (tags: string[]) => {
    updateDraft({ tags });
    setShowTagSelector(false);
  };

  // URL 삽입 핸들러
  const handleUrlInsert = () => {
    const url = prompt('Enter URL:');
    if (url && contentRef.current) {
      const start = contentRef.current.selectionStart;
      const end = contentRef.current.selectionEnd;
      const currentContent = draft.content || '';
      const newContent = currentContent.substring(0, start) + url + currentContent.substring(end);
      updateDraft({ content: newContent });
      
      // 커서 위치 조정
      setTimeout(() => {
        contentRef.current?.setSelectionRange(start + url.length, start + url.length);
        contentRef.current?.focus();
      }, 0);
    }
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // TODO: 이미지 업로드 로직 구현
        console.log('Image upload:', file);
      }
    };
    input.click();
  };

  // 비디오 업로드 핸들러
  const handleVideoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // TODO: 비디오 업로드 로직 구현
        console.log('Video upload:', file);
      }
    };
    input.click();
  };

  // 위치 검색 핸들러
  const handleLocationSearch = async (query: string) => {
    setLocationSearch(query);
    if (query.length >= 2) {
      // TODO: 실제 위치 검색 API 연동
      const mockLocations: Location[] = [
        { id: '1', name: query + ' City', address: '123 Main St' },
        { id: '2', name: query + ' Town', address: '456 Oak Ave' },
        { id: '3', name: query + ' Village', address: '789 Pine Rd' },
      ];
      setLocations(mockLocations);
    } else {
      setLocations([]);
    }
  };

  // 위치 선택 핸들러
  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    updateDraft({ location: location.name });
    setShowLocationDialog(false);
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
            <Button 
              variant="outline" 
              size="sm" 
              className={`rounded-full whitespace-nowrap transition-colors ${
                selectedType === 'discussion' ? 'bg-black text-white hover:bg-black/90' : ''
              }`}
              onClick={() => handleTypeChange('discussion')}
            >
              Discussion
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className={`rounded-full whitespace-nowrap transition-colors ${
                selectedType === 'question' ? 'bg-black text-white hover:bg-black/90' : ''
              }`}
              onClick={() => handleTypeChange('question')}
            >
              Question
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className={`rounded-full whitespace-nowrap transition-colors ${
                selectedType === 'review' ? 'bg-black text-white hover:bg-black/90' : ''
              }`}
              onClick={() => handleTypeChange('review')}
            >
              Review
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className={`rounded-full whitespace-nowrap transition-colors ${
                selectedType === 'beforeAfter' ? 'bg-black text-white hover:bg-black/90' : ''
              }`}
              onClick={() => handleTypeChange('beforeAfter')}
            >
              Before & After
            </Button>
          </div>
        </div>
        
        {/* Caption/Content Input */}
        <div className="p-4 space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full text-[28px] font-medium placeholder:text-gray-400 resize-none border-none focus:outline-none"
            value={draft.title || ''}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
          <textarea
            ref={contentRef}
            placeholder="body text (optional)"
            className="w-full text-[16px] text-gray-600 min-h-[150px] resize-none border-none focus:outline-none"
            value={draft.content || ''}
            onChange={(e) => updateDraft({ content: e.target.value })}
          />
        </div>

        {/* Attachment Options */}
        <div className="px-4 py-2 flex gap-4 border-t border-b">
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={handleUrlInsert}
          >
            <Link2 className="h-6 w-6 text-gray-600" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={handleImageUpload}
          >
            <Image className="h-6 w-6 text-gray-600" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={handleVideoUpload}
          >
            <Video className="h-6 w-6 text-gray-600" />
          </button>
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

        {/* Location Dialog */}
        <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add location</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Search for a location..."
                value={locationSearch}
                onChange={(e) => handleLocationSearch(e.target.value)}
              />
              <div className="space-y-2">
                {locations.map((location) => (
                  <button
                    key={location.id}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded-md"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm text-gray-500">{location.address}</div>
                  </button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      
      {/* Fixed Footer - Options */}
      <footer className="border-t">
        <div className="divide-y">
          <button 
            className="flex items-center p-4 w-full text-left"
            onClick={() => setShowLocationDialog(true)}
          >
            <MapPin className="h-6 w-6 mr-3" />
            <span className="text-base">Add location</span>
            {selectedLocation && (
              <span className="ml-2 text-sm text-gray-500">
                {selectedLocation.name}
              </span>
            )}
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
        </div>
      </footer>
    </div>
  );
} 