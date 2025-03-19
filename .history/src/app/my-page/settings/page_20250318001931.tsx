"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Shield, User } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  // State for notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weeklyDigest: false,
    newFollowers: true,
    comments: true,
    mentions: true,
    productUpdates: false,
  })

  // State for privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    activityVisibility: "followers",
    followersVisibility: "public",
    searchable: true,
    showOnlineStatus: true,
  })

  // Function to handle notification toggle
  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    })
  }

  // Function to handle privacy settings change
  const handlePrivacyChange = <T>(key: keyof typeof privacy, value: T) => {
    setPrivacy({
      ...privacy,
      [key]: value,
    })
  }

  // Function to handle settings save
  const handleSaveSettings = () => {
    toast.success("Settings saved successfully")
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 p-2 bg-amber-50 text-amber-700 rounded-md cursor-pointer">
                <Bell size={20} />
                <span className="font-medium">Notifications</span>
              </div>
              <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <Shield size={20} />
                <span>Privacy & Security</span>
              </div>
              <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <User size={20} />
                <span>Account</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive updates via email</p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={notifications.email}
                    onCheckedChange={() => handleNotificationToggle("email")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive on-site notifications</p>
                  </div>
                  <Switch 
                    id="push-notifications" 
                    checked={notifications.push}
                    onCheckedChange={() => handleNotificationToggle("push")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-digest">Weekly Digest</Label>
                    <p className="text-sm text-gray-500">Get a summary of your weekly activity</p>
                  </div>
                  <Switch 
                    id="weekly-digest" 
                    checked={notifications.weeklyDigest}
                    onCheckedChange={() => handleNotificationToggle("weeklyDigest")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="new-followers">New Followers</Label>
                    <p className="text-sm text-gray-500">Be notified when someone follows you</p>
                  </div>
                  <Switch 
                    id="new-followers" 
                    checked={notifications.newFollowers}
                    onCheckedChange={() => handleNotificationToggle("newFollowers")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="comments">Comments</Label>
                    <p className="text-sm text-gray-500">Be notified about new comments on your content</p>
                  </div>
                  <Switch 
                    id="comments" 
                    checked={notifications.comments}
                    onCheckedChange={() => handleNotificationToggle("comments")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="mentions">Mentions</Label>
                    <p className="text-sm text-gray-500">Be notified when you're mentioned</p>
                  </div>
                  <Switch 
                    id="mentions" 
                    checked={notifications.mentions}
                    onCheckedChange={() => handleNotificationToggle("mentions")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="product-updates">Product Updates</Label>
                    <p className="text-sm text-gray-500">Get updates about new features</p>
                  </div>
                  <Switch 
                    id="product-updates" 
                    checked={notifications.productUpdates}
                    onCheckedChange={() => handleNotificationToggle("productUpdates")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control your profile visibility and privacy options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <select 
                    id="profile-visibility"
                    className="w-full p-2 mt-1 border rounded-md"
                    value={privacy.profileVisibility}
                    onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="followers">Followers Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="activity-visibility">Activity Visibility</Label>
                  <select 
                    id="activity-visibility"
                    className="w-full p-2 mt-1 border rounded-md"
                    value={privacy.activityVisibility}
                    onChange={(e) => handlePrivacyChange("activityVisibility", e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="followers">Followers Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="followers-visibility">Followers Visibility</Label>
                  <select 
                    id="followers-visibility"
                    className="w-full p-2 mt-1 border rounded-md"
                    value={privacy.followersVisibility}
                    onChange={(e) => handlePrivacyChange("followersVisibility", e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="followers">Followers Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="searchable">Profile Searchable</Label>
                    <p className="text-sm text-gray-500">Allow others to find you in search</p>
                  </div>
                  <Switch 
                    id="searchable" 
                    checked={privacy.searchable}
                    onCheckedChange={() => handlePrivacyChange("searchable", !privacy.searchable)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="online-status">Show Online Status</Label>
                    <p className="text-sm text-gray-500">Display when you are active</p>
                  </div>
                  <Switch 
                    id="online-status" 
                    checked={privacy.showOnlineStatus}
                    onCheckedChange={() => handlePrivacyChange("showOnlineStatus", !privacy.showOnlineStatus)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and protection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter your current password"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter your new password"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your new password"
                    className="mt-1"
                  />
                </div>
                <Button className="mt-2">Change Password</Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <select 
                    id="language"
                    className="w-full p-2 mt-1 border rounded-md"
                  >
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="space-y-4 w-full">
                <Button variant="outline" className="w-full text-red-500 border-red-200 hover:bg-red-50">
                  Delete Account
                </Button>
                <Button onClick={handleSaveSettings} className="w-full">
                  Save All Settings
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
} 