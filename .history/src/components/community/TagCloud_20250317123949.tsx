'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TagCloudItem } from '@/types/community';
import { cn } from '@/lib/utils';

interface TagCloudProps {
  tags: TagCloudItem[];
  className?: string;
  maxTags?: number;
}

export function TagCloud({ tags, className, maxTags = 30 }: TagCloudProps) {
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
      const normalizedWeight = (weight - minWeight) / (maxWeight - minWeight);
      
      let size: TagCloudItem['size'] = 'md';
      
      if (normalizedWeight < 0.2) size = 'xs';
      else if (normalizedWeight < 0.4) size = 'sm';
      else if (normalizedWeight < 0.6) size = 'md';
      else if (normalizedWeight < 0.8) size = 'lg';
      else size = 'xl';
      
      return {
        ...tag,
        size
      };
    });
  }, [tags, maxTags]);

  // Size to tailwind class mapping
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {processedTags.map(tag => (
        <Link 
          key={tag.id} 
          href={`/tags/${encodeURIComponent(tag.name)}`}
          className={cn(
            sizeClasses[tag.size || 'md'],
            "px-3 py-1.5 bg-amber-50 text-amber-900 rounded-full transition-all duration-200",
            "hover:bg-amber-100 hover:scale-105",
            tag.color && `bg-opacity-20 bg-${tag.color}-100 text-${tag.color}-800 hover:bg-${tag.color}-200`,
            hoveredTag && hoveredTag !== tag.id && "opacity-70"
          )}
          onMouseEnter={() => setHoveredTag(tag.id)}
          onMouseLeave={() => setHoveredTag(null)}
        >
          {tag.name}
          {tag.count !== undefined && (
            <span className="ml-1.5 text-amber-600 text-opacity-80 text-xs font-medium">
              {tag.count}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
} 