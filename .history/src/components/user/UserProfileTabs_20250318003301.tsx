"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDistanceToNow } from "date-fns"
import { Post, Review, Comment, Like } from "@/types/user"
import { PenLine, MessageSquare, Heart, Star } from "lucide-react"

// This component accepts the profile activity data and displays it in tabs
interface UserProfileTabsProps {
  posts: Post[]
  reviews: Review[]
  comments: Comment[]
  likes: Like[]
}

export function UserProfileTabs({ posts, reviews, comments, likes }: UserProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("posts")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="comments">Comments</TabsTrigger>
        <TabsTrigger value="likes">Likes</TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-medium text-lg mb-2">{post.title}</h3>
              {post.excerpt && <p className="text-gray-600 mb-3">{post.excerpt}</p>}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    {post.likes}
                  </span>
                  <span className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {post.comments}
                  </span>
                </div>
                <span>{formatDistanceToNow(new Date(post.date), { addSuffix: true })}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <PenLine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No posts yet</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto mb-4">
              Share your skincare journey, tips, and experiences with the community
            </p>
            <Button asChild>
              <Link href="/create">Create a Post</Link>
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="reviews" className="space-y-4">
        {reviews && reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center mb-2">
                <h3 className="font-medium text-lg">{review.title || review.productName}</h3>
              </div>
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    {review.likes}
                  </span>
                  <span className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {review.comments}
                  </span>
                </div>
                <span>{formatDistanceToNow(new Date(review.date), { addSuffix: true })}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No reviews yet</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto mb-4">
              Share your thoughts on products you've tried
            </p>
            <Button asChild>
              <Link href="/write-review">Write a Review</Link>
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="comments" className="space-y-4">
        {comments && comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="bg-white rounded-lg shadow p-4">
              <div className="mb-2">
                <p className="text-sm text-gray-500">
                  On <span className="font-medium text-gray-700">{comment.postTitle}</span>
                </p>
              </div>
              <p className="text-gray-700 mb-3">{comment.content}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  {comment.likes}
                </span>
                <span>{formatDistanceToNow(new Date(comment.date), { addSuffix: true })}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No comments yet</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              Join conversations and share your thoughts on community posts
            </p>
            <Button asChild className="mt-4">
              <Link href="/community">Explore Community</Link>
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="likes" className="space-y-4">
        {likes && likes.length > 0 ? (
          likes.map(like => (
            <div key={like.id} className="bg-white rounded-lg shadow p-4">
              <div className="mb-2">
                <p className="text-sm text-gray-500">
                  You liked 
                  <span className="font-medium text-gray-700 mx-1">
                    {like.targetType === 'post' ? 'a post' : 
                     like.targetType === 'review' ? 'a review' : 'a comment'}
                  </span>
                  {like.targetTitle && (
                    <>: "{like.targetTitle}"</>
                  )}
                </p>
              </div>
              <div className="text-right text-xs text-gray-500">
                {formatDistanceToNow(new Date(like.date), { addSuffix: true })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No likes yet</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              Show appreciation for content by liking posts, reviews, and comments
            </p>
            <Button asChild className="mt-4">
              <Link href="/community">Explore Community</Link>
            </Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
} 