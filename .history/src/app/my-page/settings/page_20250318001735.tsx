"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { ArrowLeft, Bell, BellOff, Eye, EyeOff, Lock, Mail, Shield, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    postReplies: true,
    mentions: true,
    newFollowers: true,
    productUpdates: false,
    marketingEmails: false
  })
  
  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public", // public, followers, private
    showEmail: false,
    showLocation: true,
    allowFollowing: true,
    allowTagging: true
  })
  
  // Handle notification toggle
  const handleNotificationToggle = (setting: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }
  
  // Handle privacy option change
  const handlePrivacyChange = (setting: keyof typeof privacy, value: any) => {
    setPrivacy(prev => ({
      ...prev,
      [setting]: value
    }))
  }
  
  // Handle save settings
  const handleSaveSettings = async () => {
    setSaving(true)
    
    // In a real app, we would send the updated settings to the API
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSaving(false)
    alert("Settings saved successfully!")
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/my-page">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Profile
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Account Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-1">
              <a href="#notifications" className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-amber-50 text-amber-700">
                <Bell className="mr-3 h-5 w-5" />
                <span>Notifications</span>
              </a>
              <a href="#privacy" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                <Eye className="mr-3 h-5 w-5" />
                <span>Privacy</span>
              </a>
              <a href="#security" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                <Shield className="mr-3 h-5 w-5" />
                <span>Security</span>
              </a>
              <a href="#account" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                <Lock className="mr-3 h-5 w-5" />
                <span>Account</span>
              </a>
            </nav>
          </Card>
        </div>
        
        {/* Settings content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notification settings */}
          <Card className="p-6" id="notifications">
            <div className="flex items-center mb-4">
              <Bell className="h-5 w-5 mr-2 text-amber-500" />
              <h2 className="text-lg font-medium">Notification Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
                </div>
                <Switch 
                  checked={notifications.emailNotifications}
                  onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Notify me about:</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="postReplies" className="cursor-pointer">Replies to my posts</Label>
                  <Switch 
                    id="postReplies"
                    checked={notifications.postReplies}
                    onCheckedChange={() => handleNotificationToggle('postReplies')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="mentions" className="cursor-pointer">Mentions and tags</Label>
                  <Switch 
                    id="mentions"
                    checked={notifications.mentions}
                    onCheckedChange={() => handleNotificationToggle('mentions')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="newFollowers" className="cursor-pointer">New followers</Label>
                  <Switch 
                    id="newFollowers"
                    checked={notifications.newFollowers}
                    onCheckedChange={() => handleNotificationToggle('newFollowers')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="productUpdates" className="cursor-pointer">Product and feature updates</Label>
                  <Switch 
                    id="productUpdates"
                    checked={notifications.productUpdates}
                    onCheckedChange={() => handleNotificationToggle('productUpdates')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketingEmails" className="cursor-pointer">Marketing emails</Label>
                  <Switch 
                    id="marketingEmails"
                    checked={notifications.marketingEmails}
                    onCheckedChange={() => handleNotificationToggle('marketingEmails')}
                  />
                </div>
              </div>
            </div>
          </Card>
          
          {/* Privacy settings */}
          <Card className="p-6" id="privacy">
            <div className="flex items-center mb-4">
              <Eye className="h-5 w-5 mr-2 text-amber-500" />
              <h2 className="text-lg font-medium">Privacy Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Profile Visibility</h3>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="profileVisibility"
                      value="public"
                      checked={privacy.profileVisibility === "public"}
                      onChange={() => handlePrivacyChange('profileVisibility', 'public')}
                      className="h-4 w-4 text-amber-500"
                    />
                    <span>Public</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="profileVisibility"
                      value="followers"
                      checked={privacy.profileVisibility === "followers"}
                      onChange={() => handlePrivacyChange('profileVisibility', 'followers')}
                      className="h-4 w-4 text-amber-500"
                    />
                    <span>Followers Only</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="profileVisibility"
                      value="private"
                      checked={privacy.profileVisibility === "private"}
                      onChange={() => handlePrivacyChange('profileVisibility', 'private')}
                      className="h-4 w-4 text-amber-500"
                    />
                    <span>Private</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {privacy.profileVisibility === "public" 
                    ? "Anyone can view your profile" 
                    : privacy.profileVisibility === "followers" 
                      ? "Only your followers can view your profile" 
                      : "Your profile is private"}
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Information Visibility</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showEmail" className="cursor-pointer">Show email address on profile</Label>
                  <Switch 
                    id="showEmail"
                    checked={privacy.showEmail}
                    onCheckedChange={(checked) => handlePrivacyChange('showEmail', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showLocation" className="cursor-pointer">Show location on profile</Label>
                  <Switch 
                    id="showLocation"
                    checked={privacy.showLocation}
                    onCheckedChange={(checked) => handlePrivacyChange('showLocation', checked)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Social Interactions</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="allowFollowing" className="cursor-pointer">Allow others to follow me</Label>
                  <Switch 
                    id="allowFollowing"
                    checked={privacy.allowFollowing}
                    onCheckedChange={(checked) => handlePrivacyChange('allowFollowing', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="allowTagging" className="cursor-pointer">Allow others to tag me in posts</Label>
                  <Switch 
                    id="allowTagging"
                    checked={privacy.allowTagging}
                    onCheckedChange={(checked) => handlePrivacyChange('allowTagging', checked)}
                  />
                </div>
              </div>
            </div>
          </Card>
          
          {/* Security settings */}
          <Card className="p-6" id="security">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 mr-2 text-amber-500" />
              <h2 className="text-lg font-medium">Security Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Change Password</h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword"
                      type="password"
                      placeholder="Enter your current password"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword"
                      type="password"
                      placeholder="Enter your new password"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your new password"
                    />
                  </div>
                  
                  <Button className="mt-2">
                    Update Password
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline">
                  Set up 2FA
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Account settings */}
          <Card className="p-6" id="account">
            <div className="flex items-center mb-4">
              <Lock className="h-5 w-5 mr-2 text-amber-500" />
              <h2 className="text-lg font-medium">Account Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Email Address</h3>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    value="user@example.com"
                    readOnly
                  />
                </div>
                <Button variant="outline" className="mt-2">
                  Change Email
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-red-600">Danger Zone</h3>
                <p className="text-sm text-gray-500">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="destructive" className="mt-2">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end gap-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/my-page">Cancel</Link>
        </Button>
        <Button onClick={handleSaveSettings} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
} 