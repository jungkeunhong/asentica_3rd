"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Heart, MessageSquare, Clock, Tag as TagIcon } from "lucide-react"

import { getMockUserData } from "@/data/mockUserData"

// Mock saved items data - in a real app this would come from Supabase
const mockSavedContent = [
  {
    id: "saved-1",
    type: "post",
    title: "The Ultimate Guide to Treating Hyperpigmentation",
    excerpt: "A comprehensive guide to different types of hyperpigmentation and the most effective ingredients and treatments for each type.",
    author: "DermaExpert",
    authorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80",
    savedAt: "2023-06-10T18:32:00Z",
    likes: 342,
    comments: 56,
    url: "/community/post/123",
    tags: [
      { id: "tag-7", name: "Hyperpigmentation" },
      { id: "tag-8", name: "Melasma" },
      { id: "tag-9", name: "Dark Spots" }
    ]
  },
  {
    id: "saved-2",
    type: "product",
    title: "Glow Essence Peptide Serum",
    excerpt: "Hydrating serum with 3 types of peptides and hyaluronic acid",
    brand: "SkinGlow",
    image: "https://images.unsplash.com/photo-1556228578-6d035ef0c37f?auto=format&fit=crop&w=300&h=300&q=80",
    savedAt: "2023-06-08T14:22:00Z",
    rating: 4.7,
    reviewCount: 128,
    price: "$49.99",
    url: "/products/456",
    tags: [
      { id: "tag-12", name: "Serums" },
      { id: "tag-13", name: "Peptides" },
      { id: "tag-14", name: "Hydration" }
    ]
  },
  {
    id: "saved-3",
    type: "post",
    title: "Japanese vs. Korean Sunscreens: Comprehensive Comparison",
    excerpt: "Detailed comparison of popular Japanese and Korean sunscreens, focusing on formulation, texture, finish, and protection level.",
    author: "SPF_Enthusiast",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&h=256&q=80",
    savedAt: "2023-06-03T14:09:00Z",
    likes: 287,
    comments: 93,
    url: "/community/post/789",
    tags: [
      { id: "tag-15", name: "Sunscreen" },
      { id: "tag-16", name: "Korean Beauty" },
      { id: "tag-17", name: "Japanese Beauty" }
    ]
  },
  {
    id: "saved-4",
    type: "routine",
    title: "Summer Minimalist Skincare Routine",
    excerpt: "A simple 5-step morning routine for hot and humid summer days",
    author: "MinimalistGlow",
    authorImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=256&h=256&q=80",
    savedAt: "2023-05-28T11:47:00Z",
    likes: 196,
    saves: 78,
    url: "/routines/101",
    tags: [
      { id: "tag-18", name: "Summer Routine" },
      { id: "tag-19", name: "Minimalist" },
      { id: "tag-20", name: "Oily Skin" }
    ]
  },
  {
    id: "saved-5",
    type: "product",
    title: "Ultra Gentle Cleansing Balm",
    excerpt: "Oil-based cleansing balm that melts away makeup and sunscreen",
    brand: "SkinSoothe",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=300&h=300&q=80",
    savedAt: "2023-05-22T19:15:00Z",
    rating: 4.5,
    reviewCount: 213,
    price: "$24.99",
    url: "/products/789",
    tags: [
      { id: "tag-21", name: "Cleansers" },
      { id: "tag-22", name: "Sensitive Skin" },
      { id: "tag-23", name: "Makeup Removal" }
    ]
  }
];

type SavedItemType = "all" | "posts" | "products" | "routines";

const SavedContentPage = () => {
  const [filter, setFilter] = useState<SavedItemType>("all");
  
  // Filter saved content based on selected filter
  const filteredContent = filter === "all" 
    ? mockSavedContent 
    : mockSavedContent.filter(item => item.type === filter.slice(0, -1)); // Remove 's' from filter to match type
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Link href="/my-page" className="inline-flex items-center text-gray-600 hover:text-amber-700 mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Back to profile</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold">Saved Content</h1>
        <p className="text-gray-600 mt-1">Content you&apos;ve saved for later</p>
      </div>
      
      <Tabs value={filter} onValueChange={(value) => setFilter(value as SavedItemType)} className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="routines">Routines</TabsTrigger>
        </TabsList>
        
        <TabsContent value={filter} className="space-y-4">
          {filteredContent.length > 0 ? (
            filteredContent.map(item => (
              <Card key={item.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Product image for product type */}
                  {item.type === "product" && item.image && (
                    <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        {/* Content type badge */}
                        <Badge className={`mb-2 ${
                          item.type === "post" 
                            ? "bg-blue-100 text-blue-800" 
                            : item.type === "product" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-purple-100 text-purple-800"
                        }`}>
                          {item.type === "post" ? "Article" : item.type === "product" ? "Product" : "Routine"}
                        </Badge>
                        
                        {/* Title with link */}
                        <Link href={item.url}>
                          <h3 className="text-lg font-medium hover:text-amber-700">{item.title}</h3>
                        </Link>
                        
                        {/* Author or brand */}
                        <p className="text-sm text-gray-600 mt-1">
                          {item.type === "product" ? `By ${item.brand}` : `By ${item.author}`}
                        </p>
                      </div>
                      
                      {/* Saved time */}
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {new Date(item.savedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                    </div>
                    
                    {/* Excerpt */}
                    <p className="text-gray-700 text-sm mt-2 line-clamp-2">{item.excerpt}</p>
                    
                    {/* Product rating and price */}
                    {item.type === "product" && (
                      <div className="flex items-center mt-2 gap-3">
                        <span className="text-sm font-medium flex items-center">
                          <span className="text-amber-500">★</span> {item.rating} ({item.reviewCount})
                        </span>
                        <span className="text-sm font-medium">{item.price}</span>
                      </div>
                    )}
                    
                    {/* Post stats */}
                    {item.type === "post" && (
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" /> {item.likes}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" /> {item.comments}
                        </span>
                      </div>
                    )}
                    
                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        <TagIcon className="h-4 w-4 text-gray-400 mr-1" />
                        {item.tags.map(tag => (
                          <Link href={`/tags/${tag.name.toLowerCase().replace(/\s+/g, '-')}`} key={tag.id}>
                            <Badge variant="outline" className="bg-gray-50 hover:bg-gray-100 cursor-pointer">
                              {tag.name}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-3">You haven&apos;t saved any {filter === "all" ? "content" : filter} yet.</p>
              <Link href="/community">
                <Button className="bg-amber-500 hover:bg-amber-600">Explore Community</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SavedContentPage; 