'use client';

import { useState, useRef } from 'react';
import { Upload, X, Camera, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ imageUrl, onImageChange, disabled = false }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error state
    setError(null);

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    // Simulate upload
    setIsUploading(true);
    
    // In a real app, you would upload to a server/cloud storage
    // For demo purposes, we'll use a local URL
    const reader = new FileReader();
    reader.onload = (event) => {
      // Simulate network delay
      setTimeout(() => {
        if (event.target?.result) {
          onImageChange(event.target.result as string);
        }
        setIsUploading(false);
      }, 1000);
    };
    reader.readAsDataURL(file);
  };

  // Handle image removal
  const handleRemoveImage = () => {
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle URL input
  const handleUrlInput = () => {
    const url = prompt('Enter image URL:');
    if (url && url.trim()) {
      setIsUploading(true);
      
      // Create a new image to test the URL
      const img = new Image();
      img.onload = () => {
        onImageChange(url);
        setIsUploading(false);
      };
      img.onerror = () => {
        setError('Invalid image URL or image could not be loaded');
        setIsUploading(false);
      };
      img.src = url;
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      {imageUrl ? (
        <div className="relative">
          <img 
            src={imageUrl} 
            alt="Uploaded image" 
            className="w-full h-48 object-cover rounded-md"
          />
          {!disabled && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-opacity"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
          onClick={triggerFileInput}
        >
          <input
            type="file"
            id="image-upload"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
            aria-label="Upload image from device"
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700 mb-2"></div>
              <span className="text-sm text-gray-500">Uploading...</span>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center">
                <UploadCloud className="h-10 w-10 text-amber-700 mb-2" />
                <span className="text-sm font-medium text-amber-900 mb-1">
                  Click to upload image
                </span>
                <span className="text-xs text-gray-500">
                  or drag and drop
                </span>
                <span className="text-xs text-gray-400 mt-2">
                  JPEG, PNG, GIF, WEBP (max 5MB)
                </span>
              </div>
            </>
          )}
          
          {error && (
            <p className="text-red-500 text-xs mt-2">{error}</p>
          )}
        </div>
      )}
    </div>
  );
} 