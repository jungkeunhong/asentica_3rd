'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, Shield, Eye, Lock, UserCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { mockUserProfile } from '@/data/mockUserData';

export default function SettingsPage() {
  // Privacy settings
  const [privacyLevel, setPrivacyLevel] = useState<'public' | 'private' | 'friends'>(
    mockUserProfile.privacyLevel
  );
  const [isAnonymous, setIsAnonymous] = useState(mockUserProfile.isAnonymous);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState({
    newComments: true,
    replies: true,
    mentions: true,
    productUpdates: false,
    newsletter: true,
  });
  
  const [pushNotifications, setPushNotifications] = useState({
    newComments: true,
    replies: true,
    mentions: true,
    productUpdates: true,
    newFollowers: true,
  });
  
  // Account settings
  const handleDeactivateAccount = () => {
    // This would typically show a confirmation dialog and then call an API
    alert('This would deactivate your account after confirmation');
  };
  
  const handleDeleteAccount = () => {
    // This would typically show a confirmation dialog and then call an API
    alert('This would permanently delete your account after confirmation');
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href="/my-page" className="flex items-center text-amber-700 hover:text-amber-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
      <Tabs defaultValue="privacy">
        <TabsList className="mb-6">
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" />
            Account
          </TabsTrigger>
        </TabsList>
        
        {/* Privacy Tab */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control who can see your profile and activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Profile Visibility</h3>
                <RadioGroup 
                  value={privacyLevel} 
                  onValueChange={(value) => setPrivacyLevel(value as 'public' | 'private' | 'friends')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public">
                      <div className="font-medium">Public</div>
                      <div className="text-sm text-gray-500">Anyone can view your profile and posts</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="friends" id="friends" />
                    <Label htmlFor="friends">
                      <div className="font-medium">Friends Only</div>
                      <div className="text-sm text-gray-500">Only people you follow can view your profile</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private">
                      <div className="font-medium">Private</div>
                      <div className="text-sm text-gray-500">Only you can view your profile details</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Anonymous Mode</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="anonymous-mode" className="block font-medium">
                      Post Anonymously
                    </Label>
                    <p className="text-sm text-gray-500">
                      Your username will be hidden when you post or comment
                    </p>
                  </div>
                  <Switch 
                    id="anonymous-mode" 
                    checked={isAnonymous} 
                    onCheckedChange={setIsAnonymous} 
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Content Visibility</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-votes" className="block">
                      Show what posts I&apos;ve voted on
                    </Label>
                    <Switch id="show-votes" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-saved" className="block">
                      Show saved content on my profile
                    </Label>
                    <Switch id="show-saved" />
                  </div>
                </div>
              </div>
              
              <Button className="w-full">Save Privacy Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Email Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-comments">
                      New comments on your posts
                    </Label>
                    <Switch 
                      id="email-comments" 
                      checked={emailNotifications.newComments} 
                      onCheckedChange={(checked) => 
                        setEmailNotifications({...emailNotifications, newComments: checked})
                      } 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-replies">
                      Replies to your comments
                    </Label>
                    <Switch 
                      id="email-replies" 
                      checked={emailNotifications.replies} 
                      onCheckedChange={(checked) => 
                        setEmailNotifications({...emailNotifications, replies: checked})
                      } 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-mentions">
                      Mentions and tags
                    </Label>
                    <Switch 
                      id="email-mentions" 
                      checked={emailNotifications.mentions} 
                      onCheckedChange={(checked) => 
                        setEmailNotifications({...emailNotifications, mentions: checked})
                      } 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-product-updates">
                      Product updates and announcements
                    </Label>
                    <Switch 
                      id="email-product-updates" 
                      checked={emailNotifications.productUpdates} 
                      onCheckedChange={(checked) => 
                        setEmailNotifications({...emailNotifications, productUpdates: checked})
                      } 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-newsletter">
                      Weekly newsletter and digests
                    </Label>
                    <Switch 
                      id="email-newsletter" 
                      checked={emailNotifications.newsletter} 
                      onCheckedChange={(checked) => 
                        setEmailNotifications({...emailNotifications, newsletter: checked})
                      } 
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Push Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-comments">
                      New comments on your posts
                    </Label>
                    <Switch 
                      id="push-comments" 
                      checked={pushNotifications.newComments} 
                      onCheckedChange={(checked) => 
                        setPushNotifications({...pushNotifications, newComments: checked})
                      } 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-replies">
                      Replies to your comments
                    </Label>
                    <Switch 
                      id="push-replies" 
                      checked={pushNotifications.replies} 
                      onCheckedChange={(checked) => 
                        setPushNotifications({...pushNotifications, replies: checked})
                      } 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-mentions">
                      Mentions and tags
                    </Label>
                    <Switch 
                      id="push-mentions" 
                      checked={pushNotifications.mentions} 
                      onCheckedChange={(checked) => 
                        setPushNotifications({...pushNotifications, mentions: checked})
                      } 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-product-updates">
                      Product updates and announcements
                    </Label>
                    <Switch 
                      id="push-product-updates" 
                      checked={pushNotifications.productUpdates} 
                      onCheckedChange={(checked) => 
                        setPushNotifications({...pushNotifications, productUpdates: checked})
                      } 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-followers">
                      New followers
                    </Label>
                    <Switch 
                      id="push-followers" 
                      checked={pushNotifications.newFollowers} 
                      onCheckedChange={(checked) => 
                        setPushNotifications({...pushNotifications, newFollowers: checked})
                      } 
                    />
                  </div>
                </div>
              </div>
              
              <Button className="w-full">Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Change Password</h3>
                <div className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="current-password">Current Password</Label>
                    <input 
                      type="password" 
                      id="current-password" 
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" 
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="new-password">New Password</Label>
                    <input 
                      type="password" 
                      id="new-password" 
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" 
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <input 
                      type="password" 
                      id="confirm-password" 
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" 
                    />
                  </div>
                  
                  <Button className="w-full">Update Password</Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-factor authentication is not enabled yet</p>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline">
                    <Lock className="mr-2 h-4 w-4" />
                    Enable
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Sessions</h3>
                <p className="text-sm text-gray-500 mb-3">
                  You&apos;re currently signed in on this device. You can sign out of all other devices if you think your account has been compromised.
                </p>
                <Button variant="outline">Sign out from all other devices</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Account Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Account Information</h3>
                <div className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="account-email">Email Address</Label>
                    <input 
                      type="email" 
                      id="account-email" 
                      defaultValue="user@example.com"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" 
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="account-username">Username</Label>
                    <input 
                      type="text" 
                      id="account-username" 
                      defaultValue={mockUserProfile.username}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" 
                    />
                  </div>
                  
                  <Button className="w-full">Update Account Information</Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Data Export</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Download a copy of your data including your profile, posts, and comments
                </p>
                <Button variant="outline">Request Data Export</Button>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3 text-red-600">Danger Zone</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                    <div>
                      <p className="font-medium">Deactivate Account</p>
                      <p className="text-sm text-gray-500">
                        Temporarily disable your account
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={handleDeactivateAccount}
                    >
                      Deactivate
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-md bg-red-50">
                    <div>
                      <p className="font-medium text-red-600">Delete Account</p>
                      <p className="text-sm text-red-500">
                        Permanently delete your account and all your data
                      </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 