"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Bookmark, Trash2 } from "lucide-react"
import Link from "next/link"
import { getMockUserData } from "@/data/mockUserData"

// Define proper types for saved content
interface Tag {
  id: string;
  name: string;
}

interface ContentDetails {
  title: string;
  excerpt?: string;
  tags?: Tag[];
}

interface SavedContentItem {
  id: string;
  type: 'post' | 'product' | 'review' | 'routine';
  contentId: string;
  savedAt: string;
  content: ContentDetails;
}

export default function SavedContent() {
  const [savedContent, setSavedContent] = useState<SavedContentItem[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // In a real app, fetch saved content from API
    // For now, use mock data
    const userData = getMockUserData()
    
    // Transform the data to match our interface if needed
    const formattedContent = (userData.savedContent || []).map((item): SavedContentItem => ({
      id: item.id,
      type: item.type as 'post' | 'product' | 'review' | 'routine',
      contentId: item.id,
      savedAt: item.date,
      content: {
        title: item.title,
        excerpt: item.excerpt,
        tags: item.tags || []
      }
    }));
    
    setSavedContent(formattedContent)
    setLoading(false)
  }, [])
  
  const filteredContent = savedContent.filter(item => {
    if (activeTab === "all") return true
    return item.type === activeTab
  })
  
  const handleRemoveItem = (id: string) => {
    setSavedContent(prev => prev.filter(item => item.id !== id))
  }
  
  if (loading) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Saved Content</h1>
        <p className="text-gray-500 mt-1">Your bookmarked posts, products, and reviews</p>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="post">Posts</TabsTrigger>
          <TabsTrigger value="product">Products</TabsTrigger>
          <TabsTrigger value="review">Reviews</TabsTrigger>
          <TabsTrigger value="routine">Routines</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {filteredContent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map(item => (
                <SavedItem 
                  key={item.id} 
                  item={item} 
                  onRemove={() => handleRemoveItem(item.id)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <Bookmark className="mx-auto h-10 w-10 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-700">No saved items found</h3>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">
                Save posts, products, and reviews to access them quickly here
              </p>
              <Button asChild className="mt-6">
                <Link href="/community">
                  Browse Community
                </Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface SavedItemProps {
  item: SavedContentItem;
  onRemove: () => void;
}

function SavedItem({ item, onRemove }: SavedItemProps) {
  // Get the appropriate route based on content type
  const getItemRoute = () => {
    switch (item.type) {
      case "post":
        return `/community/post/${item.contentId}`
      case "product":
        return `/products/${item.contentId}`
      case "review":
        return `/reviews/${item.contentId}`
      case "routine":
        return `/routines/${item.contentId}`
      default:
        return "#"
    }
  }
  
  // Get icon based on content type
  const getTypeLabel = () => {
    switch (item.type) {
      case "post":
        return "Post"
      case "product":
        return "Product"
      case "review":
        return "Review"
      case "routine":
        return "Routine"
      default:
        return ""
    }
  }
  
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="p-5 flex-1">
        {/* Save date */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">
            Saved {new Date(item.savedAt).toLocaleDateString()}
          </span>
          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
            {getTypeLabel()}
          </span>
        </div>
        
        {/* Content title */}
        <h3 className="font-medium mb-2 line-clamp-2">
          <Link href={getItemRoute()} className="hover:text-amber-700 transition-colors">
            {item.content.title}
          </Link>
        </h3>
        
        {/* Content excerpt */}
        {item.content.excerpt && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {item.content.excerpt}
          </p>
        )}
        
        {/* Tags */}
        {item.content.tags && item.content.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.content.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag.id} 
                className="px-2 py-0.5 bg-gray-100 text-xs rounded-full"
              >
                {tag.name}
              </span>
            ))}
            {item.content.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{item.content.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-gray-100 flex justify-between">
        <Button asChild variant="link" size="sm" className="h-8 px-2">
          <Link href={getItemRoute()}>
            View {item.type}
          </Link>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={e => {
            e.preventDefault()
            onRemove()
          }}
        >
          <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
        </Button>
      </div>
    </Card>
  )
} 