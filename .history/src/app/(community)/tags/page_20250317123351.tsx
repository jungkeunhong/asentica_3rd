'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TagCloud } from '@/components/community/TagCloud';
import { CategoryList } from '@/components/community/CategoryList';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, Star, Clock, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockTagCategories, mockPopularTags, mockTrendingTags } from './mock-data';
import { TagCloudItem } from '@/types/community';

export default function TagsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Main categories with icons
  const mainCategories = [
    { id: 'skincare', name: 'Skincare', icon: '✨' },
    { id: 'treatments', name: 'Treatments', icon: '💉' },
    { id: 'makeup', name: 'Makeup', icon: '💄' },
    { id: 'procedures', name: 'Procedures', icon: '🔬' },
    { id: 'conditions', name: 'Conditions', icon: '🩹' },
    { id: 'wellness', name: 'Wellness', icon: '🧘' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Browse by Topic</h1>
      
      {/* Search */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
        <Input
          type="text"
          placeholder="Search for topics, tags or categories..."
          className="pl-10 py-6"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Main Categories */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4">Top Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mainCategories.map(category => (
            <Link 
              key={category.id}
              href={`/tags/${category.id}`}
              className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center"
            >
              <span className="text-3xl mb-2">{category.icon}</span>
              <span className="font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Popular Tags */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Star className="h-5 w-5 mr-1.5 text-amber-700" />
            Popular Tags
          </h2>
          <Button variant="link" size="sm" asChild>
            <Link href="/tags?sort=popular">
              View All
            </Link>
          </Button>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <TagCloud tags={mockPopularTags} />
        </div>
      </section>
      
      {/* Trending Tags */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <TrendingUp className="h-5 w-5 mr-1.5 text-amber-700" />
            Trending Now
          </h2>
          <Button variant="link" size="sm" asChild>
            <Link href="/tags?sort=trending">
              View All
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockTrendingTags.slice(0, 6).map((tag: TagCloudItem) => (
            <Link
              key={tag.id}
              href={`/tags/${encodeURIComponent(tag.name)}`}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center justify-between"
            >
              <div className="flex items-center">
                <span className="text-amber-900 bg-amber-50 rounded-full p-2 mr-3">
                  <Hash className="h-4 w-4" />
                </span>
                <div>
                  <div className="font-medium">{tag.name}</div>
                  <div className="text-xs text-gray-500">{tag.count} posts</div>
                </div>
              </div>
              <span className="text-sm text-amber-700 font-medium flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> {Math.floor(Math.random() * 200) + 5}%
              </span>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Browse All Categories */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Clock className="h-5 w-5 mr-1.5 text-amber-700" />
            All Categories
          </h2>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <CategoryList categories={mockTagCategories} />
        </div>
      </section>
    </div>
  );
} 