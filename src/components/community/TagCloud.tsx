'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TagCloudItem } from '@/types/community';
import { cn } from '@/lib/utils';

interface TagCloudProps {
  tags: TagCloudItem[];
  className?: string;
  maxTags?: number;
  onTagSelect?: (tagName: string) => void;
  selectedTag?: string | null;
}

export function TagCloud({ 
  tags, 
  className, 
  maxTags = 30,
  onTagSelect,
  selectedTag = null
}: TagCloudProps) {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  // Calculate tag sizes based on weight
  const processedTags = useMemo(() => {
    // Sort by weight (popularity)
    const sortedTags = [...tags].sort((a, b) => 
      (b.weight || b.count || 0) - (a.weight || a.count || 0)
    ).slice(0, maxTags);
    
    // Find max and min weights
    const maxWeight = Math.max(...sortedTags.map(tag => tag.weight || tag.count || 1));
    const minWeight = Math.min(...sortedTags.map(tag => tag.weight || tag.count || 1));
    
    // Assign size based on normalized weight
    return sortedTags.map(tag => {
      const weight = tag.weight || tag.count || 1;
      // Normalize weight to a value between 0 and 1
      const normalizedWeight = maxWeight === minWeight 
        ? 0.5 
        : (weight - minWeight) / (maxWeight - minWeight);
      
      // Convert normalized weight to one of five sizes
      let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
      if (normalizedWeight < 0.2) size = 'xs';
      else if (normalizedWeight < 0.4) size = 'sm';
      else if (normalizedWeight < 0.6) size = 'md';
      else if (normalizedWeight < 0.8) size = 'lg';
      else size = 'xl';
      
      return { ...tag, size, normalizedWeight };
    });
  }, [tags, maxTags]);

  const handleTagClick = (tag: TagCloudItem) => {
    if (onTagSelect) {
      onTagSelect(tag.name);
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {processedTags.map((tag) => {
        const isSelected = selectedTag === tag.name;
        const isHovered = hoveredTag === tag.id;
        
        // Determine size class based on tag's calculated size
        const sizeClasses = {
          xs: "text-xs px-2 py-0.5",
          sm: "text-sm px-2 py-0.5",
          md: "text-base px-2.5 py-1",
          lg: "text-lg px-3 py-1.5",
          xl: "text-xl px-4 py-2"
        };
        
        return onTagSelect ? (
          <button
            key={tag.id}
            onClick={() => handleTagClick(tag)}
            onMouseEnter={() => setHoveredTag(tag.id)}
            onMouseLeave={() => setHoveredTag(null)}
            className={cn(
              "rounded-full transition-all duration-200 font-medium",
              sizeClasses[tag.size || 'md'],
              isSelected 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              isHovered && !isSelected && "bg-secondary/80",
              "cursor-pointer"
            )}
          >
            #{tag.name} 
            {tag.count && <span className="ml-1 opacity-70">({tag.count})</span>}
          </button>
        ) : (
          <Link
            key={tag.id}
            href={`/community/tags/${tag.name}`}
            onMouseEnter={() => setHoveredTag(tag.id)}
            onMouseLeave={() => setHoveredTag(null)}
            className={cn(
              "rounded-full transition-all duration-200 font-medium",
              sizeClasses[tag.size || 'md'],
              "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              isHovered && "bg-secondary/80"
            )}
          >
            #{tag.name} 
            {tag.count && <span className="ml-1 opacity-70">({tag.count})</span>}
          </Link>
        );
      })}
    </div>
  );
} 