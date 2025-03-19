"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfileTabs } from "@/components/user/UserProfileTabs"
import { formatDistanceToNow } from "date-fns"
import { getMockUserData } from "@/data/mockUserData"
import { BadgeCheck, Calendar, Edit, MapPin, Settings, Share2 } from "lucide-react"
import { UserProfile } from "@/types/user"

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading user data
    const loadUserData = async () => {
      setLoading(true)
      try {
        // For demo purposes, we're using mock data
        // In a real app, this would be an API call
        const userData = await getMockUserData() as unknown as UserProfile
        setUser(userData)
      } catch (error) {
        console.error("Failed to load user data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

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

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      {/* Cover Image & Profile Section */}
      <div className="relative">
        <div className="h-60 w-full overflow-hidden rounded-lg bg-gray-100">
          {user.coverImage ? (
            <Image
              src={user.coverImage}
              alt="Profile cover"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-amber-100 to-amber-300" />
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 -mt-12 px-4 md:px-6">
          {/* Profile Image */}
          <div className="relative z-10 flex-shrink-0">
            <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white">
              <Image
                src={user.profileImage || "/images/default-avatar.png"}
                alt={user.displayName}
                width={128}
                height={128}
                className="object-cover h-full w-full"
              />
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="flex flex-col md:flex-row justify-between w-full pt-4 md:pt-12">
            <div>
              <div className="flex items-center mb-1">
                <h1 className="text-2xl font-bold mr-2">{user.displayName}</h1>
                {user.verifiedStatus && (
                  <BadgeCheck className="h-5 w-5 text-amber-500" />
                )}
              </div>
              <p className="text-gray-600 mb-2">@{user.username}</p>
              
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-gray-500 mb-4">
                {user.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Joined {formatDistanceToNow(new Date(user.joinDate), { addSuffix: true })}</span>
                </div>
              </div>

              <div className="flex gap-4 text-sm mb-4">
                <div>
                  <span className="font-semibold">{user.followingCount}</span> Following
                </div>
                <div>
                  <span className="font-semibold">{user.followerCount}</span> Followers
                </div>
              </div>

              {user.bio && (
                <p className="text-gray-700 mb-6 max-w-xl">{user.bio}</p>
              )}
            </div>

            <div className="flex items-start gap-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm" asChild>
                <Link href="/my-page/edit">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/my-page/settings">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Posts & Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold">{user.stats.posts}</p>
                <p className="text-sm text-gray-500">Posts</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{user.stats.reviews}</p>
                <p className="text-sm text-gray-500">Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold">{user.stats.comments}</p>
                <p className="text-sm text-gray-500">Comments</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{user.stats.likes}</p>
                <p className="text-sm text-gray-500">Likes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Recognition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold">{user.stats.badges}</p>
                <p className="text-sm text-gray-500">Badges</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{user.stats.contributions}</p>
                <p className="text-sm text-gray-500">Contributions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Activity Tabs */}
      <div className="mt-8">
        <Tabs defaultValue="content">
          <TabsList className="mb-4">
            <TabsTrigger value="content">Content</TabsTrigger>
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

          <TabsContent value="badges" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {user.badges.length > 0 ? (
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
                            {badge.name?.charAt(0) || '?'}
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
              
              {user.badges.length > 8 && (
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
  )
} 