'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PostDraft } from '@/types/community';

const DRAFT_STORAGE_KEY = 'community_post_draft';

// Simple debounce function with proper typing
function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function usePostDraft() {
  const [draft, setDraft] = useState<PostDraft>({
    id: '',
    title: '',
    content: '',
    format: 'discussion',
    tags: [],
    images: [],
  });
  
  // Ref to store the latest draft for the debounced function
  const draftRef = useRef(draft);
  
  // Update ref when draft changes
  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

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
  
  // Debounced function to save to localStorage
  const debouncedSave = useCallback(
    debounce((draftToSave: PostDraft) => {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftToSave));
    }, 500),
    []
  );

  // Update draft with partial data
  const updateDraft = useCallback((updates: Partial<PostDraft>) => {
    setDraft(prev => {
      const updated = { ...prev, ...updates };
      // Save to localStorage with debounce
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  // Save draft explicitly (returns promise for UI feedback)
  const saveDraft = useCallback(async (): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftRef.current));
      // Simulate async operation for UI feedback
      setTimeout(resolve, 300);
    });
  }, []);

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setDraft({
      id: uuidv4(),
      title: '',
      content: '',
      format: 'discussion',
      tags: [],
      images: [],
    });
  }, []);

  // Publish draft (in a real app, this would send to an API)
  const publishDraft = useCallback(async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        // Simulate API call
        console.log('Publishing draft:', draftRef.current);
        
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
  }, [clearDraft]);

  return {
    draft,
    updateDraft,
    saveDraft,
    clearDraft,
    publishDraft,
  };
} 