"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Heart, Star, RefreshCw } from "lucide-react"
import { UserActivity, Post, Review, Comment, Like } from "@/types/user"

type ActivityType = "all" | "post" | "review" | "comment" | "like"

export default function ActivityPage() {
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ActivityType>("all")

  useEffect(() => {
    // Simulate loading activities from an API
    const loadActivities = async () => {
      setLoading(true)
      try {
        // In a real app, we would fetch from an API
        // For now, we'll use mock data
        const mockPosts: Post[] = [
          {
            id: "post-1",
            title: "My Morning Skincare Routine",
            excerpt: "I've been using this routine for 3 months and my skin has never looked better...",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            likes: 24,
            comments: 5,
            image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2tpbmNhcmV8ZW58MHx8MHx8fDA%3D"
          },
          {
            id: "post-2",
            title: "How I Cleared My Acne",
            excerpt: "After struggling with acne for years, here's what finally worked for me...",
            date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
            likes: 56,
            comments: 12,
            image: "https://images.unsplash.com/photo-1570554520913-968097bbbab1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNraW5jYXJlfGVufDB8fDB8fHww"
          }
        ]
        
        const mockReviews: Review[] = [
          {
            id: "review-1",
            title: "Cetaphil Gentle Skin Cleanser Review",
            productName: "Cetaphil Gentle Skin Cleanser",
            rating: 4,
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            likes: 18,
            comments: 3,
            image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNraW5jYXJlJTIwcHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D"
          }
        ]
        
        const mockComments: Comment[] = [
          {
            id: "comment-1",
            content: "I've been using this product for a month now and I love it! Thanks for the recommendation.",
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            likes: 5,
            postId: "post-external-1",
            postTitle: "Best Drugstore Moisturizers for Dry Skin"
          },
          {
            id: "comment-2",
            content: "Have you tried incorporating niacinamide into your routine? It might help with the redness.",
            date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            likes: 2,
            postId: "post-external-2",
            postTitle: "Help with Rosacea Flare Ups"
          }
        ]
        
        const mockLikes: Like[] = [
          {
            id: "like-1",
            targetId: "post-external-3",
            targetType: "post",
            targetTitle: "Tretinoin: Benefits and How to Use It",
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: "like-2",
            targetId: "review-external-1",
            targetType: "review",
            targetTitle: "Review: The Ordinary Niacinamide 10% + Zinc 1%",
            date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
        
        // Create activity objects for each content type
        const postActivities = mockPosts.map(post => ({
          id: `activity-post-${post.id}`,
          type: "post" as const,
          date: post.date,
          content: post
        }))
        
        const reviewActivities = mockReviews.map(review => ({
          id: `activity-review-${review.id}`,
          type: "review" as const,
          date: review.date,
          content: review
        }))
        
        const commentActivities = mockComments.map(comment => ({
          id: `activity-comment-${comment.id}`,
          type: "comment" as const,
          date: comment.date,
          content: comment
        }))
        
        const likeActivities = mockLikes.map(like => ({
          id: `activity-like-${like.id}`,
          type: "like" as const,
          date: like.date,
          content: like
        }))
        
        // Combine all activities and sort by date (newest first)
        const allActivities = [
          ...postActivities,
          ...reviewActivities,
          ...commentActivities,
          ...likeActivities
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        
        setActivities(allActivities)
      } catch (error) {
        console.error("Failed to load activities:", error)
      } finally {
        setLoading(false)
      }
    }

    loadActivities()
  }, [])

  const filteredActivities = activeTab === "all" 
    ? activities 
    : activities.filter(activity => activity.type === activeTab)

  const renderActivityContent = (activity: UserActivity) => {
    switch (activity.type) {
      case "post": {
        const post = activity.content as Post
        return (
          <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {post.image && (
                  <div className="md:w-1/3 relative">
                    <div className="aspect-video md:h-full relative">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                <div className={`p-6 ${post.image ? 'md:w-2/3' : 'w-full'}`}>
                  <div className="flex items-center mb-2">
                    <span className="text-xs font-medium text-amber-600 uppercase tracking-wider mr-2">Post</span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="flex items-center mr-4">
                      <Heart className="h-4 w-4 mr-1" />
                      {post.likes}
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }
      case "review": {
        const review = activity.content as Review
        return (
          <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {review.image && (
                  <div className="md:w-1/3 relative">
                    <div className="aspect-video md:h-full relative">
                      <Image
                        src={review.image}
                        alt={review.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                <div className={`p-6 ${review.image ? 'md:w-2/3' : 'w-full'}`}>
                  <div className="flex items-center mb-2">
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wider mr-2">Review</span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium mb-1">{review.title}</h3>
                  <p className="text-gray-600 mb-2">{review.productName}</p>
                  <div className="flex items-center mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "text-amber-500 fill-amber-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="flex items-center mr-4">
                      <Heart className="h-4 w-4 mr-1" />
                      {review.likes}
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {review.comments}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }
      case "comment": {
        const comment = activity.content as Comment
        return (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-2">
                <span className="text-xs font-medium text-green-600 uppercase tracking-wider mr-2">Comment</span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                On <Link href={`/post/${comment.postId}`} className="font-medium text-gray-700 hover:text-amber-600">{comment.postTitle}</Link>
              </p>
              <p className="text-gray-700 mb-3">&quot;{comment.content}&quot;</p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  {comment.likes}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      }
      case "like": {
        const like = activity.content as Like
        return (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-2">
                <span className="text-xs font-medium text-red-600 uppercase tracking-wider mr-2">Like</span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(like.date), { addSuffix: true })}
                </span>
              </div>
              <p className="text-gray-700">
                You liked a {like.targetType}: <Link href={`/${like.targetType}/${like.targetId}`} className="font-medium hover:text-amber-600">{like.targetTitle}</Link>
              </p>
            </CardContent>
          </Card>
        )
      }
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 sm:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Activity</h1>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ActivityType)}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Activity</TabsTrigger>
          <TabsTrigger value="post">Posts</TabsTrigger>
          <TabsTrigger value="review">Reviews</TabsTrigger>
          <TabsTrigger value="comment">Comments</TabsTrigger>
          <TabsTrigger value="like">Likes</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <div key={activity.id}>
                {renderActivityContent(activity)}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-lg font-medium">No activity yet</p>
              <p className="mt-2 text-sm text-gray-500">
                Your recent activity will appear here.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="post" className="space-y-4">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <div key={activity.id}>
                {renderActivityContent(activity)}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-lg font-medium">No posts yet</p>
              <p className="mt-2 text-sm text-gray-500">
                Your posts will appear here after you create them.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/create">Create a Post</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <div key={activity.id}>
                {renderActivityContent(activity)}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-lg font-medium">No reviews yet</p>
              <p className="mt-2 text-sm text-gray-500">
                Your product reviews will appear here.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="comment" className="space-y-4">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <div key={activity.id}>
                {renderActivityContent(activity)}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-lg font-medium">No comments yet</p>
              <p className="mt-2 text-sm text-gray-500">
                Your comments on posts and reviews will appear here.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/community">Browse Community</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="like" className="space-y-4">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <div key={activity.id}>
                {renderActivityContent(activity)}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-lg font-medium">No likes yet</p>
              <p className="mt-2 text-sm text-gray-500">
                Content you like will appear here.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/community">Browse Community</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 