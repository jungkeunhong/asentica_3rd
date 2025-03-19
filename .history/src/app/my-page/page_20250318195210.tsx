"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfileTabs } from "@/components/user/UserProfileTabs"
import { formatDistanceToNow } from "date-fns"
import { getMockUserData } from "@/data/mockUserData"
import { UserProfile, GlowStats as GlowStatsType } from "@/types/user"
import { ProfileHeader } from "@/components/user/ProfileHeader"
import { GlowStats } from "@/components/user/GlowStats"
import { ActivityFeed } from "@/components/user/ActivityFeed"

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [shareSuccess, setShareSuccess] = useState<string | null>(null)

  useEffect(() => {
    // Simulate loading user data
    const loadUserData = async () => {
      setLoading(true)
      try {
        // For demo purposes, we're using mock data
        // In a real app, this would be an API call
        const userData = getMockUserData() as UserProfile
        setUser(userData)
      } catch (error) {
        console.error("Failed to load user data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  // Show temporary success message then fade out
  useEffect(() => {
    if (shareSuccess) {
      const timer = setTimeout(() => {
        setShareSuccess(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [shareSuccess])

  const handleShare = async () => {
    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user?.displayName}'s Profile | Asentica`,
          text: `Check out ${user?.displayName}'s profile on Asentica!`,
          url: window.location.href
        })
        setShareSuccess("Profile shared successfully!")
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        setShareSuccess("Link copied to clipboard!")
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">User not found</h1>
        <p className="mb-4">We couldn&apos;t find the user profile you&apos;re looking for.</p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    )
  }

  // Convert user activities to ActivityItem format for ActivityFeed
  const activityItems = [
    ...(user.recentActivity?.posts || []).map(post => ({
      id: post.id,
      type: 'post' as const,
      date: post.date,
      title: post.title
    })),
    ...(user.recentActivity?.reviews || []).map(review => ({
      id: review.id,
      type: 'review' as const,
      date: review.date,
      productName: review.productName,
      productId: review.id
    })),
    ...(user.recentActivity?.comments || []).map(comment => ({
      id: comment.id,
      type: 'comment' as const,
      date: comment.date,
      targetTitle: comment.postTitle,
      link: `/community/post/${comment.postId}`
    })),
    ...(user.recentActivity?.likes || []).map(like => ({
      id: like.id,
      type: 'like' as const,
      date: like.date,
      targetTitle: like.targetTitle,
      link: `/community/${like.targetType}/${like.targetId}`
    })),
    ...(user.badges || []).map(badge => ({
      id: badge.id,
      type: 'badge' as const,
      date: badge.earnedDate,
      badgeName: badge.name
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Convert UserStats to GlowStats format for the GlowStats component
  const glowStats: GlowStatsType = {
    total: user.stats.posts + user.stats.reviews + user.stats.comments + user.stats.likes + user.stats.contributions,
    level: Math.floor((user.stats.posts + user.stats.reviews) / 10) + 1,
    nextLevelAt: (Math.floor((user.stats.posts + user.stats.reviews) / 10) + 1) * 100,
    progress: 75, // Just a sample percentage
    breakdown: {
      posts: user.stats.posts,
      comments: user.stats.comments,
      reviews: user.stats.reviews,
      helpfulVotes: user.stats.likes,
      verifiedPurchases: user.stats.contributions
    },
    rank: "Top Contributor"
  };

  return (
    <div className="container mx-auto pt-4 px-4 sm:px-6">
      {/* Profile Header Section */}
      <div className="mb-8 relative">
        <ProfileHeader user={user} isCurrentUser={true} />
        
        {/* Share success notification */}
        {shareSuccess && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow-md z-50 animate-fade-in-out">
            {shareSuccess}
          </div>
        )}
        
        {/* Overlay a Share button on the ProfileHeader */}
        <div className="absolute top-4 right-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/80 hover:bg-white"
            onClick={handleShare}
          >
            <span className="mr-2">Share</span>
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Sidebar - GlowStats */}
        <div className="lg:col-span-1">
          <GlowStats stats={glowStats} />
        </div>

        {/* Main content area */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="content">
            <TabsList className="mb-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-6">
              <UserProfileTabs 
                posts={user.recentActivity?.posts || []}
                reviews={user.recentActivity?.reviews || []}
                comments={user.recentActivity?.comments || []}
                likes={user.recentActivity?.likes || []}
              />
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <ActivityFeed activities={activityItems} limit={10} />
            </TabsContent>

            <TabsContent value="badges" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {user.badges && user.badges.length > 0 ? (
                  user.badges.slice(0, 8).map((badge) => (
                    <Link 
                      key={badge.id} 
                      href="/my-page/badges"
                      className="block"
                    >
                      <Card className="h-full hover:shadow-md transition-shadow">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                            badge.name?.includes("Expert") 
                              ? "bg-amber-100" 
                              : badge.name?.includes("Community") 
                                ? "bg-blue-100" 
                                : "bg-green-100"
                          }`}>
                            <span className={`text-2xl ${
                              badge.name?.includes("Expert") 
                                ? "text-amber-600" 
                                : badge.name?.includes("Community") 
                                  ? "text-blue-600" 
                                  : "text-green-600"
                            }`}>
                              {badge.name && badge.name.length > 0 ? badge.name.charAt(0) : '?'}
                            </span>
                          </div>
                          <h3 className="font-medium mb-1">{badge.name || 'Unknown Badge'}</h3>
                          <p className="text-sm text-gray-500">{badge.description || ''}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-lg mb-2">No badges yet</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Earn badges by being active in the community
                    </p>
                    <Button variant="outline">Browse Community</Button>
                  </div>
                )}
                
                {user.badges && user.badges.length > 8 && (
                  <div className="col-span-full mt-4 text-center">
                    <Button asChild variant="outline">
                      <Link href="/my-page/badges">View All Badges</Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="saved" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.savedContent && user.savedContent.length > 0 ? (
                  user.savedContent.slice(0, 6).map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-video relative bg-gray-100">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </p>
                        <h3 className="font-medium mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.excerpt}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                          </span>
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/content/${item.id}`}>View</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-lg mb-2">No saved content</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Save posts, products and reviews to find them later
                    </p>
                    <Button variant="outline">Browse Community</Button>
                  </div>
                )}
                
                {user.savedContent && user.savedContent.length > 6 && (
                  <div className="col-span-full mt-4 text-center">
                    <Button asChild variant="outline">
                      <Link href="/my-page/saved">View All Saved</Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 