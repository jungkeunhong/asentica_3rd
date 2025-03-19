'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Pencil, Bookmark, UserCircle, Settings, FileText, Award } from 'lucide-react';
import { ProfileHeader } from '@/components/user/ProfileHeader';
import { GlowStats } from '@/components/user/GlowStats';
import { ActivityFeed } from '@/components/user/ActivityFeed';
import { mockUserProfile, mockUserActivities, mockSavedContent, mockUserDrafts } from '@/data/mockUserData';
import { ProfileSection } from '@/types/user';

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<ProfileSection>('posts');
  
  // Simulate loading the user profile
  // In a real implementation, you would fetch this from an API
  const userProfile = mockUserProfile;
  const recentActivities = mockUserActivities;
  const savedContent = mockSavedContent;
  const drafts = mockUserDrafts;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* User Profile Header */}
      <ProfileHeader 
        userProfile={userProfile}
        isOwnProfile={true}
      />
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="space-y-6">
          {/* Glow Stats */}
          <GlowStats stats={userProfile.glowStats} showComparison={true} />
          
          {/* User Badges */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Award className="h-5 w-5 mr-2 text-amber-500" />
                Badges & Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {userProfile.badges.slice(0, 4).map((badge) => (
                  <div key={badge.id} className="flex items-center space-x-2">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
                      <Image 
                        src={badge.iconUrl} 
                        alt={badge.name} 
                        width={40} 
                        height={40} 
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{badge.name}</p>
                      <p className="text-xs text-gray-500 truncate">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {userProfile.badges.length > 4 && (
                <div className="mt-4 text-center">
                  <Link 
                    href="/my-page/badges" 
                    className="text-sm text-amber-700 hover:text-amber-800 hover:underline"
                  >
                    View all badges ({userProfile.badges.length})
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Quick Links */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                <Link 
                  href="/community/create" 
                  className="flex items-center p-2 rounded-md hover:bg-gray-50 text-gray-700 hover:text-amber-700 transition-colors"
                >
                  <Pencil className="h-4 w-4 mr-3" />
                  <span>Create New Post</span>
                </Link>
                <Link 
                  href="/my-page/saved" 
                  className="flex items-center p-2 rounded-md hover:bg-gray-50 text-gray-700 hover:text-amber-700 transition-colors"
                >
                  <Bookmark className="h-4 w-4 mr-3" />
                  <span>Saved Content</span>
                </Link>
                <Link 
                  href="/my-page/profile" 
                  className="flex items-center p-2 rounded-md hover:bg-gray-50 text-gray-700 hover:text-amber-700 transition-colors"
                >
                  <UserCircle className="h-4 w-4 mr-3" />
                  <span>Edit Profile</span>
                </Link>
                <Link 
                  href="/my-page/settings" 
                  className="flex items-center p-2 rounded-md hover:bg-gray-50 text-gray-700 hover:text-amber-700 transition-colors"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  <span>Settings</span>
                </Link>
              </nav>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs for different sections */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ProfileSection)}>
            <TabsList className="w-full border-b justify-start mb-0 rounded-none bg-transparent">
              <TabsTrigger 
                value="posts" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent"
              >
                Saved
              </TabsTrigger>
              <TabsTrigger 
                value="drafts" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent"
              >
                Drafts
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent"
              >
                Reviews
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="pt-4">
              <ActivityFeed activities={recentActivities} maxItems={10} />
            </TabsContent>
            
            <TabsContent value="saved" className="pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Saved Content</CardTitle>
                  <CardDescription>Content you've saved for later</CardDescription>
                </CardHeader>
                <CardContent>
                  {savedContent.length > 0 ? (
                    <div className="space-y-4">
                      {savedContent.map((item) => (
                        <div key={item.id} className="border-b border-gray-100 pb-4">
                          <h3 className="font-medium">
                            <Link 
                              href={`/community/post/${item.contentId}`}
                              className="text-amber-700 hover:text-amber-800 hover:underline"
                            >
                              {item.content?.title}
                            </Link>
                          </h3>
                          {item.content?.excerpt && (
                            <p className="text-sm text-gray-600 mt-1">{item.content.excerpt}</p>
                          )}
                          {item.content?.tags && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.content.tags.map((tag) => (
                                <span key={tag.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      You haven't saved any content yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="drafts" className="pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-amber-500" />
                    Drafts
                  </CardTitle>
                  <CardDescription>Continue where you left off</CardDescription>
                </CardHeader>
                <CardContent>
                  {drafts.length > 0 ? (
                    <div className="space-y-4">
                      {drafts.map((draft) => (
                        <div key={draft.id} className="border-b border-gray-100 pb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">
                                <Link 
                                  href={`/community/create?draft=${draft.id}`}
                                  className="text-amber-700 hover:text-amber-800 hover:underline"
                                >
                                  {draft.title || 'Untitled Draft'}
                                </Link>
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                Last edited: {new Date(draft.lastEditedAt).toLocaleDateString()}
                              </p>
                              {draft.tags && draft.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {draft.tags.map((tag) => (
                                    <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              asChild
                            >
                              <Link href={`/community/create?draft=${draft.id}`}>
                                Continue
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      You have no drafts
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Your Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6 text-gray-500">
                    You haven't written any reviews yet
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 