'use client';

import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Popular tags for suggestions
const POPULAR_TAGS = [
  'skincare',
  'makeup',
  'haircare',
  'wellness',
  'beauty',
  'routine',
  'product',
  'review',
  'tips',
  'natural',
  'organic',
  'vegan',
  'sensitive',
  'acne',
  'anti-aging',
  'hydration',
  'spf',
  'cleansing',
  'moisturizer',
  'serum'
];

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

export default function TagSelector({ 
  selectedTags = [], 
  onChange, 
  maxTags = 5 
}: TagSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = POPULAR_TAGS.filter(tag => 
        tag.toLowerCase().includes(inputValue.toLowerCase()) && 
        !selectedTags.includes(tag)
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, selectedTags]);

  // Add a tag
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    
    // Validate tag
    if (!trimmedTag || selectedTags.includes(trimmedTag)) {
      return;
    }
    
    // Check max tags
    if (selectedTags.length >= maxTags) {
      return;
    }
    
    // Add tag and clear input
    const newTags = [...selectedTags, trimmedTag];
    onChange(newTags);
    setInputValue('');
    setShowSuggestions(false);
  };

  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    const newTags = selectedTags.filter(tag => tag !== tagToRemove);
    onChange(newTags);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle input keydown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (tag: string) => {
    addTag(tag);
  };

  return (
    <div className="w-full">
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map(tag => (
          <div 
            key={tag}
            className="bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-xs flex items-center"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-amber-800 hover:text-amber-900"
              aria-label={`Remove ${tag} tag`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      
      {/* Tag Input */}
      <div className="relative">
        <div className="flex">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={
              selectedTags.length >= maxTags 
                ? `Maximum ${maxTags} tags` 
                : "Add a tag..."
            }
            disabled={selectedTags.length >= maxTags}
            className="w-full"
          />
          {inputValue && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => addTag(inputValue)}
              className="ml-2"
              disabled={selectedTags.length >= maxTags}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Tag Suggestions */}
        {showSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-sm">
            <ul className="py-1">
              {suggestions.map(tag => (
                <li 
                  key={tag}
                  className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(tag)}
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Tag Count */}
      <div className="mt-1 text-xs text-gray-500">
        {selectedTags.length} of {maxTags} tags used
      </div>
    </div>
  );
} 