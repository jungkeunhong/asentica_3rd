'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PostDraft } from '@/types/community';

const DRAFT_STORAGE_KEY = 'community_post_draft';

export function usePostDraft() {
  const [draft, setDraft] = useState<PostDraft>({
    id: '',
    title: '',
    content: '',
    format: 'discussion',
    tags: [],
    images: [],
  });

  // Load draft from localStorage on initial render
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setDraft(parsedDraft);
      } catch (error) {
        console.error('Error parsing saved draft:', error);
        // Clear corrupted draft
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    } else {
      // Initialize with a new ID if no saved draft
      setDraft(prev => ({ ...prev, id: uuidv4() }));
    }
  }, []);

  // Update draft with partial data
  const updateDraft = (updates: Partial<PostDraft>) => {
    setDraft(prev => {
      const updated = { ...prev, ...updates };
      // Save to localStorage
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Save draft explicitly (returns promise for UI feedback)
  const saveDraft = async (): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      // Simulate async operation for UI feedback
      setTimeout(resolve, 300);
    });
  };

  // Clear draft from localStorage
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setDraft({
      id: uuidv4(),
      title: '',
      content: '',
      format: 'discussion',
      tags: [],
      images: [],
    });
  };

  // Publish draft (in a real app, this would send to an API)
  const publishDraft = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        // Simulate API call
        console.log('Publishing draft:', draft);
        
        // In a real app, you would send the draft to your API here
        // const response = await fetch('/api/posts', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(draft),
        // });
        
        // Clear the draft after successful publish
        clearDraft();
        
        // Simulate network delay
        setTimeout(resolve, 800);
      } catch (error) {
        console.error('Error publishing draft:', error);
        reject(error);
      }
    });
  };

  return {
    draft,
    updateDraft,
    saveDraft,
    clearDraft,
    publishDraft,
  };
} 