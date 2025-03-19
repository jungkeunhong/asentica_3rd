'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PostDraft, PostFormat } from '@/types/community';
import { ImageUpload } from './ImageUpload';
import Image from 'next/image';

interface PostFormatsProps {
  format: PostFormat;
  draft: PostDraft;
  onTitleChange: (title: string) => void;
  isPreviewMode: boolean;
}

export default function PostFormats({ 
  format, 
  draft, 
  onTitleChange,
  isPreviewMode 
}: PostFormatsProps) {
  const [beforeImage, setBeforeImage] = useState<string>(draft.beforeImage || '');
  const [afterImage, setAfterImage] = useState<string>(draft.afterImage || '');

  const handleBeforeImageChange = (imageUrl: string) => {
    setBeforeImage(imageUrl);
  };

  const handleAfterImageChange = (imageUrl: string) => {
    setAfterImage(imageUrl);
  };

  // Render title input for all formats
  const renderTitleInput = () => (
    <div className="mb-4">
      <Label htmlFor="post-title" className="text-sm font-medium mb-1 block">
        {format === 'question' ? 'Question Title' : 'Post Title'}
      </Label>
      <Input
        id="post-title"
        placeholder={
          format === 'question' 
            ? "What&apos;s your question?" 
            : format === 'review' 
              ? "What are you reviewing?" 
              : "Give your post a title"
        }
        value={draft.title || ''}
        onChange={(e) => onTitleChange(e.target.value)}
        className="w-full"
        disabled={isPreviewMode}
      />
      {format === 'question' && (
        <p className="text-xs text-gray-500 mt-1">
          Be specific and imagine you&apos;re asking another person
        </p>
      )}
    </div>
  );

  // Render format-specific fields
  const renderFormatFields = () => {
    switch (format) {
      case 'question':
        return (
          <div className="mb-4">
            <Label htmlFor="question-details" className="text-sm font-medium mb-1 block">
              Question Details (Optional)
            </Label>
            <Textarea
              id="question-details"
              placeholder="Add any details or context that will help others understand your question"
              className="w-full h-24"
              disabled={isPreviewMode}
            />
          </div>
        );
        
      case 'review':
        return (
          <div className="mb-4">
            <Label htmlFor="review-rating" className="text-sm font-medium mb-1 block">
              Rating
            </Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-2xl ${
                    (draft.rating || 0) >= star ? 'text-amber-500' : 'text-gray-300'
                  }`}
                  onClick={() => {
                    if (!isPreviewMode) {
                      // In a real implementation, you would update the draft with the rating
                    }
                  }}
                  disabled={isPreviewMode}
                >
                  ★
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {draft.rating ? `${draft.rating}/5` : 'Select a rating'}
              </span>
            </div>
          </div>
        );
        
      case 'beforeAfter':
        return (
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">
              Before & After Images
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-2">Before</p>
                <ImageUpload 
                  imageUrl={beforeImage}
                  onImageChange={handleBeforeImageChange}
                  disabled={isPreviewMode}
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">After</p>
                <ImageUpload 
                  imageUrl={afterImage}
                  onImageChange={handleAfterImageChange}
                  disabled={isPreviewMode}
                />
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Preview mode rendering
  if (isPreviewMode) {
    return (
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">{draft.title || 'Untitled Post'}</h1>
        
        {format === 'beforeAfter' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Before</p>
              {beforeImage ? (
                <div className="relative w-full h-48">
                  <Image 
                    src={beforeImage} 
                    alt="Before" 
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">After</p>
              {afterImage ? (
                <div className="relative w-full h-48">
                  <Image
                    src={afterImage} 
                    alt="After" 
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {format === 'review' && draft.rating && (
          <div className="mb-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-2xl ${
                    (draft.rating || 0) >= star ? 'text-amber-500' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
              <span className="ml-2 text-sm text-gray-500">{draft.rating}/5</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Edit mode rendering
  return (
    <div>
      {renderTitleInput()}
      {renderFormatFields()}
    </div>
  );
} 