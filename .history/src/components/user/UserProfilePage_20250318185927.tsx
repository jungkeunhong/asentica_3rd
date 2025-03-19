"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileHeader } from "@/components/user/ProfileHeader"
import { GlowStatsDisplay } from "@/components/user/GlowStatsDisplay"
import { ActivityFeed } from "@/components/user/ActivityFeed"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Settings, Bookmark, FileEdit } from "lucide-react"
import Image from "next/image"
import { UserProfile, UserGlowStats } from "@/types/user"

// Define custom interfaces for our components
interface PostCardProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    author: {
      name: string;
      avatar: string;
    };
    createdAt: string;
    commentCount: number;
    upvoteCount: number;
    tags: Array<{ id: string; name: string }>;
  };
}

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    content: string;
    date: string;
    product: {
      id: string;
      name: string;
      brand: string;
    };
    author: {
      name: string;
      avatar: string;
    };
  };
}

// Create simple placeholder components if originals are not available
const PostCard = ({ post }: PostCardProps) => (
  <Card className="p-4">
    <h3 className="font-medium">{post.title}</h3>
    <p className="text-sm text-gray-600 mt-2">{post.excerpt}</p>
    <div className="flex justify-between mt-3 text-xs text-gray-500">
      <span>By {post.author.name}</span>
      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
    </div>
  </Card>
);

const ReviewCard = ({ review }: ReviewCardProps) => (
  <Card className="p-4">
    <div className="flex justify-between">
      <h3 className="font-medium">{review.product.name}</h3>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < review.rating ? "text-amber-500" : "text-gray-300"}>★</span>
        ))}
      </div>
    </div>
    <p className="text-sm text-gray-600 mt-2">{review.content}</p>
    <div className="flex justify-between mt-3 text-xs text-gray-500">
      <span>By {review.author.name}</span>
      <span>{new Date(review.date).toLocaleDateString()}</span>
    </div>
  </Card>
);

// Extended UserProfile interface to include the properties we need
interface ExtendedUserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  profileImage: string;
  coverImage?: string;
  joinDate: string;
  location?: string;
  verifiedStatus: boolean;
  followingCount: number;
  followerCount: number;
  website?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    [key: string]: string | undefined;
  };
  skinProfile?: {
    skinType?: string;
    skinTone?: string;
    concerns?: string[];
    favoriteIngredients?: string[];
  };
  badges: Array<{
    id: string;
    name: string;
    description: string;
    image?: string;
    earnedDate?: string;
  }>;
  glowStats?: {
    total: number;
    level: number;
    nextLevelAt: number;
    progress: number;
    breakdown: {
      posts: number;
      comments: number;
      reviews: number;
      helpfulVotes: number;
      verifiedPurchases: number;
    };
  };
  activity?: {
    posts?: Array<{
      id: string;
      title: string;
      excerpt?: string;
      date: string;
      likes: number;
      comments: number;
    }>;
    reviews?: Array<{
      id: string;
      productId: string;
      productName: string;
      brand?: string;
      rating: number;
      excerpt?: string;
      date: string;
      likes?: number;
      comments?: number;
    }>;
    comments?: Array<{
      id: string;
      postId: string;
      postTitle: string;
      postUrl: string;
      content: string;
      date: string;
      likes: number;
    }>;
    likes?: Array<{
      id: string;
      contentId: string;
      contentTitle: string;
      contentUrl: string;
      date: string;
    }>;
  };
}

interface UserProfilePageProps {
  userData: ExtendedUserProfile;
  isCurrentUser?: boolean;
}

export function UserProfilePage({ userData, isCurrentUser = false }: UserProfilePageProps) {
  const [activeTab, setActiveTab] = useState("posts")
  
  // Get activity items based on user activity
  const userActivities = [
    ...(userData.activity?.posts?.map(post => ({
      id: post.id,
      type: "post" as const,
      date: post.date,
      title: post.title
    })) || []),
    ...(userData.activity?.reviews?.map(review => ({
      id: review.id,
      type: "review" as const,
      date: review.date,
      productId: review.productId,
      productName: review.productName
    })) || []),
    ...(userData.activity?.comments?.map(comment => ({
      id: comment.id,
      type: "comment" as const,
      date: comment.date,
      link: comment.postUrl,
      targetTitle: comment.postTitle
    })) || []),
    ...(userData.activity?.likes?.map(like => ({
      id: like.id,
      type: "like" as const,
      date: like.date,
      link: like.contentUrl,
      targetTitle: like.contentTitle
    })) || [])
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader 
        user={userData as unknown as UserProfile} 
        isCurrentUser={isCurrentUser}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Sidebar */}
        <div className="space-y-6">
          {userData.glowStats && (
            <GlowStatsDisplay stats={userData.glowStats as unknown as UserGlowStats} />
          )}
          
          {isCurrentUser && (
            <div className="flex flex-col space-y-3">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/my-page/saved">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Saved Content
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/my-page/edit">
                  <FileEdit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/my-page/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </div>
          )}
          
          {userData.badges && userData.badges.length > 0 && (
            <Card className="p-4">
              <h3 className="font-medium mb-3">Recent Badges</h3>
              <div className="flex flex-wrap gap-2">
                {userData.badges.slice(0, 5).map(badge => (
                  <div 
                    key={badge.id} 
                    className="flex items-center space-x-2 bg-amber-50 p-2 rounded-md"
                    title={badge.description}
                  >
                    <Image 
                      src={badge.image || "/images/default-badge.png"} 
                      alt={badge.name} 
                      width={20} 
                      height={20}
                      className="h-5 w-5" 
                    />
                    <span className="text-xs font-medium">{badge.name}</span>
                  </div>
                ))}
                {userData.badges.length > 5 && (
                  <Link 
                    href="/my-page/badges" 
                    className="text-xs text-amber-700 hover:text-amber-800 hover:underline flex items-center"
                  >
                    +{userData.badges.length - 5} more
                  </Link>
                )}
              </div>
            </Card>
          )}
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="posts">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="space-y-4">
              {userData.activity?.posts && userData.activity.posts.length > 0 ? (
                userData.activity.posts.map(post => (
                  <PostCard 
                    key={post.id}
                    post={{
                      id: post.id,
                      title: post.title,
                      excerpt: post.excerpt || "",
                      author: {
                        name: userData.displayName,
                        avatar: userData.profileImage
                      },
                      createdAt: post.date,
                      commentCount: post.comments,
                      upvoteCount: post.likes,
                      tags: []
                    }}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-700">No posts yet</h3>
                  {isCurrentUser && (
                    <p className="mt-2 text-gray-500">
                      Share your skincare journey - create your first post!
                    </p>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="reviews" className="space-y-4">
              {userData.activity?.reviews && userData.activity.reviews.length > 0 ? (
                userData.activity.reviews.map(review => (
                  <ReviewCard 
                    key={review.id}
                    review={{
                      id: review.id,
                      rating: review.rating,
                      content: review.excerpt || "",
                      date: review.date,
                      product: {
                        id: review.productId,
                        name: review.productName,
                        brand: review.brand || ""
                      },
                      author: {
                        name: userData.displayName,
                        avatar: userData.profileImage
                      }
                    }}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-700">No reviews yet</h3>
                  {isCurrentUser && (
                    <p className="mt-2 text-gray-500">
                      Help others by reviewing products you&apos;ve tried!
                    </p>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="activity">
              <ActivityFeed activities={userActivities} />
            </TabsContent>
            
            <TabsContent value="about">
              <Card className="p-6">
                <h3 className="font-medium mb-4">About {userData.displayName}</h3>
                
                <div className="space-y-4">
                  {userData.bio && (
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Bio</h4>
                      <p>{userData.bio}</p>
                    </div>
                  )}
                  
                  {userData.skinProfile && (
                    <div className="space-y-3">
                      <h4 className="text-sm text-gray-500">Skin Profile</h4>
                      
                      {userData.skinProfile.skinType && (
                        <div>
                          <span className="text-xs text-gray-500">Skin Type:</span>
                          <p className="font-medium">{userData.skinProfile.skinType}</p>
                        </div>
                      )}
                      
                      {userData.skinProfile.skinTone && (
                        <div>
                          <span className="text-xs text-gray-500">Skin Tone:</span>
                          <p className="font-medium">{userData.skinProfile.skinTone}</p>
                        </div>
                      )}
                      
                      {userData.skinProfile.concerns && userData.skinProfile.concerns.length > 0 && (
                        <div>
                          <span className="text-xs text-gray-500">Skin Concerns:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {userData.skinProfile.concerns.map((concern, index) => (
                              <span 
                                key={index} 
                                className="px-2 py-1 bg-gray-100 text-xs rounded-full"
                              >
                                {concern}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {userData.skinProfile.favoriteIngredients && userData.skinProfile.favoriteIngredients.length > 0 && (
                        <div>
                          <span className="text-xs text-gray-500">Favorite Ingredients:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {userData.skinProfile.favoriteIngredients.map((ingredient, index) => (
                              <span 
                                key={index} 
                                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                              >
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 