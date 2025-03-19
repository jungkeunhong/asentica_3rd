'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { TagCategory } from '@/types/community';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CategoryListProps {
  categories: TagCategory[];
  className?: string;
}

export function CategoryList({ categories, className }: CategoryListProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  // Filter categories and tags based on search query
  const filteredCategories = searchQuery
    ? categories.map(category => ({
        ...category,
        tags: category.tags.filter(tag => 
          tag.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.tags.length > 0)
    : categories;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
        <Input
          type="text"
          placeholder="Search categories or tags..."
          className="pl-9 bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="space-y-1">
        {filteredCategories.map(category => (
          <div key={category.id} className="rounded-md overflow-hidden">
            <div 
              className="flex items-center justify-between bg-gray-50 px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleCategory(category.id)}
            >
              <div className="flex items-center gap-2">
                {category.icon && (
                  <span className="text-amber-900">{category.icon}</span>
                )}
                <span className="font-medium">{category.name}</span>
                {category.count !== undefined && (
                  <span className="text-xs text-gray-500 ml-1">({category.count})</span>
                )}
              </div>
              
              {expandedCategories.includes(category.id) ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </div>
            
            {expandedCategories.includes(category.id) && (
              <div className="pl-6 pr-3 py-2 bg-white border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  {category.tags.map(tag => (
                    <Link
                      key={tag.id}
                      href={`/tags/${encodeURIComponent(tag.name)}`}
                      className="flex items-center justify-between text-sm hover:text-amber-800 transition-colors py-1"
                    >
                      <span>{tag.name}</span>
                      {tag.count !== undefined && (
                        <span className="text-xs text-gray-500">({tag.count})</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 