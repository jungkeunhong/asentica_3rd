"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Cog, PenSquare, Bookmark, Calendar, Star, Clock, Heart } from "lucide-react"

import { getMockUserData } from "@/data/mockUserData"
import { ProfileSection } from "@/types/user"

const UserProfilePage = () => {
  const userData = getMockUserData()
  const [activeTab, setActiveTab] = useState<ProfileSection>("posts")
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
        <div className="relative">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-md">
            <img 
              src={userData.profileImage} 
              alt={userData.displayName} 
                className="object-cover"
              />
          </Avatar>
          {userData.verifiedStatus && (
            <Badge className="absolute bottom-0 right-0 bg-amber-500 text-white">
              Verified
            </Badge>
          )}
            </div>
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{userData.displayName}</h1>
              <p className="text-gray-600">@{userData.username}</p>
              <p className="mt-2 max-w-2xl">{userData.bio}</p>
            </div>
            
            <div className="flex gap-2">
              <Link href="/my-page/settings">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Cog className="h-4 w-4" />
                  <span>Settings</span>
                </Button>
              </Link>
              <Link href="/my-page/edit">
                <Button variant="default" size="sm" className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600">
                  <PenSquare className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {userData.location && (
              <span className="text-gray-600">📍 {userData.location}</span>
            )}
            <span className="text-gray-600">
              🗓️ Joined {new Date(userData.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <span className="text-gray-600">
              Following: <strong>{userData.followingCount}</strong>
            </span>
            <span className="text-gray-600">
              Followers: <strong>{userData.followerCount}</strong>
            </span>
          </div>
        </div>
      </div>
      
      {/* Glow Stats */}
      <Card className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
        <h2 className="text-xl font-semibold mb-4 text-amber-800">Your Glow Stats</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-sm">
            <div className="mb-1 flex items-center justify-center h-10 w-10 rounded-full bg-amber-100">
              <PenSquare className="h-5 w-5 text-amber-800" />
            </div>
            <span className="text-2xl font-bold text-amber-800">{userData.stats.postsCount}</span>
            <span className="text-sm text-gray-600">Posts</span>
              </div>
          
          <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-sm">
            <div className="mb-1 flex items-center justify-center h-10 w-10 rounded-full bg-amber-100">
              <Star className="h-5 w-5 text-amber-800" />
            </div>
            <span className="text-2xl font-bold text-amber-800">{userData.stats.reviewsCount}</span>
            <span className="text-sm text-gray-600">Reviews</span>
              </div>
          
          <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-sm">
            <div className="mb-1 flex items-center justify-center h-10 w-10 rounded-full bg-amber-100">
              <Heart className="h-5 w-5 text-amber-800" />
            </div>
            <span className="text-2xl font-bold text-amber-800">{userData.stats.upvotesReceived}</span>
            <span className="text-sm text-gray-600">Likes Received</span>
              </div>
          
          <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-sm">
            <div className="mb-1 flex items-center justify-center h-10 w-10 rounded-full bg-amber-100">
              <Clock className="h-5 w-5 text-amber-800" />
                </div>
            <span className="text-2xl font-bold text-amber-800">{userData.stats.streakDays}</span>
            <span className="text-sm text-gray-600">Day Streak</span>
          </div>
        </div>
      </Card>
      
      {/* Activity Feed and Saved Content Tabs */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Activity</h2>
        <Link href="/my-page/saved">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Bookmark className="h-4 w-4" />
            <span>Saved</span>
          </Button>
        </Link>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ProfileSection)} className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="space-y-4">
          {userData.activity.posts.length > 0 ? (
            userData.activity.posts.map((post) => (
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
                        💬 {post.comments}
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
          {userData.activity.reviews.length > 0 ? (
            userData.activity.reviews.map((review) => (
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
          {userData.activity.comments.length > 0 ? (
            userData.activity.comments.map((comment) => (
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
          {userData.activity.likes.length > 0 ? (
            userData.activity.likes.map((like) => (
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
    </div>
  )
} 

export default UserProfilePage 