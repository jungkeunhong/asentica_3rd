"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Star, Heart, MessageSquare } from "lucide-react"
import { ProfileSection } from "@/types/user"

interface Post {
  id: string
  title: string
  excerpt?: string
  date: string
  likes: number
  comments: number
}

interface Review {
  id: string
  productId: string
  productName: string
  rating: number
  excerpt?: string
  date: string
}

interface Comment {
  id: string
  postId: string
  postTitle: string
  postUrl: string
  content: string
  date: string
  likes: number
}

interface Like {
  id: string
  contentId: string
  contentTitle: string
  contentUrl: string
  authorName: string
  date: string
}

interface UserProfileTabsProps {
  posts: Post[]
  reviews: Review[]
  comments: Comment[]
  likes: Like[]
  defaultTab?: ProfileSection
  className?: string
}

export const UserProfileTabs = ({
  posts,
  reviews,
  comments,
  likes,
  defaultTab = "posts",
  className = ""
}: UserProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState<ProfileSection>(defaultTab)
  
  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ProfileSection)} className={`mb-8 ${className}`}>
      <TabsList className="mb-4">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="comments">Comments</TabsTrigger>
        <TabsTrigger value="likes">Likes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="posts" className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id} className="p-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString("en-US", { 
                      year: "numeric", 
                      month: "short", 
                      day: "numeric" 
                    })}
                  </p>
                  <Link href={`/community/post/${post.id}`}>
                    <h3 className="text-lg font-medium hover:text-amber-600">{post.title}</h3>
                  </Link>
                  <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" /> {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>You haven&apos;t created any posts yet.</p>
            <Link href="/create">
              <Button className="mt-2 bg-amber-500 hover:bg-amber-600">Create Your First Post</Button>
            </Link>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="reviews" className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id} className="p-4">
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 text-amber-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString("en-US", { 
                      year: "numeric", 
                      month: "short", 
                      day: "numeric" 
                    })}
                  </p>
                  <Link href={`/products/${review.productId}`}>
                    <h3 className="text-lg font-medium hover:text-amber-600">{review.productName}</h3>
                  </Link>
                  <div className="flex items-center gap-1 my-1">
                    {Array.from({length: 5}).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 line-clamp-2">{review.excerpt}</p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>You haven&apos;t written any reviews yet.</p>
            <Link href="/products">
              <Button className="mt-2 bg-amber-500 hover:bg-amber-600">Browse Products</Button>
            </Link>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="comments" className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 text-gray-400 flex items-center justify-center">💬</div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-sm text-gray-500">
                      {new Date(comment.date).toLocaleDateString("en-US", { 
                        year: "numeric", 
                        month: "short", 
                        day: "numeric" 
                      })}
                    </p>
                    <p className="text-xs text-gray-400">
                      on <Link href={comment.postUrl} className="hover:text-amber-600">{comment.postTitle}</Link>
                    </p>
                  </div>
                  <p className="text-gray-600">{comment.content}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" /> {comment.likes}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>You haven&apos;t made any comments yet.</p>
            <Link href="/community">
              <Button className="mt-2 bg-amber-500 hover:bg-amber-600">Explore Community</Button>
            </Link>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="likes" className="space-y-4">
        {likes.length > 0 ? (
          likes.map((like) => (
            <Card key={like.id} className="p-4">
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-rose-500 mt-1 fill-rose-500" />
                <div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-sm text-gray-500">
                      {new Date(like.date).toLocaleDateString("en-US", { 
                        year: "numeric", 
                        month: "short", 
                        day: "numeric" 
                      })}
                    </p>
                    <p className="text-sm text-gray-500">
                      You liked
                    </p>
                  </div>
                  <Link href={like.contentUrl}>
                    <h3 className="text-lg font-medium hover:text-amber-600">{like.contentTitle}</h3>
                  </Link>
                  <p className="text-sm text-gray-400">
                    by {like.authorName}
                  </p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>You haven&apos;t liked any content yet.</p>
            <Link href="/community">
              <Button className="mt-2 bg-amber-500 hover:bg-amber-600">Explore Community</Button>
            </Link>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
} 