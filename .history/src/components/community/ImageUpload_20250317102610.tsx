'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ imageUrl, onImageChange, disabled = false }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center h-48 flex flex-col items-center justify-center">
          <input
            type="file"
            id="image-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
          />
          <label 
            htmlFor="image-upload"
            className={`cursor-pointer flex flex-col items-center ${disabled ? 'opacity-50' : ''}`}
          >
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500 mb-1">
              {isUploading ? 'Uploading...' : 'Upload image'}
            </span>
            <span className="text-xs text-gray-400">
              JPEG, PNG, GIF, WEBP (max 5MB)
            </span>
          </label>
          {error && (
            <p className="text-red-500 text-xs mt-2">{error}</p>
          )}
        </div>
      )}
    </div>
  );
} 