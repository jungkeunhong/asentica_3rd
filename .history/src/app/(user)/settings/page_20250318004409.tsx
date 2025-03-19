"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronLeft, Info, Lock, Bell, Shield, Eye, EyeOff, LogOut, AlertTriangle } from "lucide-react"

type SettingsTab = "account" | "privacy" | "notifications" | "danger";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match");
      return;
    }
    
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you would call an API to change the password
    console.log("Password changed");
    
    // Reset form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSaving(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/my-page" className="inline-flex items-center text-gray-600 hover:text-amber-700 mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Back to profile</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold">Account Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="p-4 md:col-span-1">
          <Tabs 
            orientation="vertical" 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as SettingsTab)}
            className="h-full"
          >
            <TabsList className="flex flex-col items-start h-full space-y-1 bg-transparent">
              <TabsTrigger 
                value="account" 
                className="w-full justify-start px-3 py-2 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-800"
              >
                <Lock className="h-4 w-4 mr-2" />
                Account Security
              </TabsTrigger>
              <TabsTrigger 
                value="privacy" 
                className="w-full justify-start px-3 py-2 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-800"
              >
                <Shield className="h-4 w-4 mr-2" />
                Privacy
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="w-full justify-start px-3 py-2 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-800"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="danger" 
                className="w-full justify-start px-3 py-2 text-red-600 data-[state=active]:bg-red-50 data-[state=active]:text-red-800"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Danger Zone
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>
        
        {/* Main content */}
        <Card className="p-6 md:col-span-3">
          <TabsContent value="account" className="space-y-6 mt-0">
            <div>
              <h2 className="text-xl font-semibold mb-4">Account Security</h2>
              <p className="text-gray-600 mb-4">Manage your password and account security settings</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  value="sophia.kim@example.com" 
                  readOnly 
                  className="bg-gray-50"
                />
                <p className="text-sm text-gray-500">Your email is used for login and notifications</p>
              </div>
              
              <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                <h3 className="font-medium">Change Password</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input 
                      id="current-password" 
                      type={passwordVisible ? "text" : "password"} 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-2.5 text-gray-500"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    type={passwordVisible ? "text" : "password"} 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password" 
                    type={passwordVisible ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    onClick={handleSavePassword} 
                    disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                    className="bg-amber-500 hover:bg-amber-600"
                  >
                    {saving ? "Saving..." : "Update Password"}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline">Set Up 2FA</Button>
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-medium">Active Sessions</h3>
                    <p className="text-sm text-gray-500">View and manage your active login sessions</p>
                  </div>
                  <Button variant="outline">Manage Sessions</Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6 mt-0">
            <div>
              <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
              <p className="text-gray-600 mb-4">Control who can view your profile information</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-medium">Profile Visibility</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="profile-public" className="font-normal">Public Profile</Label>
                      <p className="text-sm text-gray-500">Allow anyone to view your full profile</p>
                    </div>
                    <Switch id="profile-public" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1">
                        <Label htmlFor="show-email" className="font-normal">Show Email on Profile</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Your email will be visible to other users</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-sm text-gray-500">Display your email address on your public profile</p>
                    </div>
                    <Switch id="show-email" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="activity-visible" className="font-normal">Activity Visibility</Label>
                      <p className="text-sm text-gray-500">Allow others to see your likes, comments, and saved items</p>
                    </div>
                    <Switch id="activity-visible" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Data Usage</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="personalized-rec" className="font-normal">Personalized Recommendations</Label>
                      <p className="text-sm text-gray-500">Allow us to use your activity to personalize recommendations</p>
                    </div>
                    <Switch id="personalized-rec" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="analytics" className="font-normal">Analytics Cookies</Label>
                      <p className="text-sm text-gray-500">Allow us to collect anonymous usage data to improve our services</p>
                    </div>
                    <Switch id="analytics" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="outline">Download My Data</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6 mt-0">
            <div>
              <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
              <p className="text-gray-600 mb-4">Choose what you want to be notified about</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-medium">Email Notifications</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-comments" className="font-normal">Comments on Your Posts</Label>
                      <p className="text-sm text-gray-500">Receive emails when someone comments on your content</p>
                    </div>
                    <Switch id="email-comments" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-likes" className="font-normal">Likes on Your Content</Label>
                      <p className="text-sm text-gray-500">Receive emails when someone likes your content</p>
                    </div>
                    <Switch id="email-likes" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-followers" className="font-normal">New Followers</Label>
                      <p className="text-sm text-gray-500">Receive emails when someone follows you</p>
                    </div>
                    <Switch id="email-followers" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-newsletter" className="font-normal">Newsletter and Updates</Label>
                      <p className="text-sm text-gray-500">Receive our newsletter and platform updates</p>
                    </div>
                    <Switch id="email-newsletter" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Push Notifications</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-all" className="font-normal">Allow Push Notifications</Label>
                      <p className="text-sm text-gray-500">Enable browser push notifications</p>
                    </div>
                    <Switch id="push-all" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-comments" className="font-normal">Comments and Replies</Label>
                      <p className="text-sm text-gray-500">Receive push notifications for comments and replies</p>
                    </div>
                    <Switch id="push-comments" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-likes" className="font-normal">Likes and Reactions</Label>
                      <p className="text-sm text-gray-500">Receive push notifications for likes on your content</p>
                    </div>
                    <Switch id="push-likes" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="outline">Update Notification Preferences</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="danger" className="space-y-6 mt-0">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
              <p className="text-gray-600 mb-4">Actions here can&apos;t be undone</p>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 border border-red-200 rounded-md bg-red-50">
                <h3 className="font-medium text-red-700">Deactivate Account</h3>
                <p className="text-sm text-gray-600 my-2">
                  Temporarily deactivate your account. You can reactivate anytime by logging back in.
                </p>
                <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700 mt-2">
                  Deactivate Account
                </Button>
              </div>
              
              <div className="p-4 border border-red-200 rounded-md bg-red-50">
                <h3 className="font-medium text-red-700">Delete Account</h3>
                <p className="text-sm text-gray-600 my-2">
                  Permanently delete your account and all your data. This action cannot be undone.
                </p>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="delete-confirm" className="text-red-600 font-medium">
                    Type &quot;DELETE&quot; to confirm
                  </Label>
                  <Input 
                    id="delete-confirm" 
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    className="border-red-300 focus:border-red-400 focus:ring-red-400"
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  className="bg-red-600 text-white hover:bg-red-700 mt-3"
                  disabled={deleteConfirm !== "DELETE"}
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Permanently Delete Account
                </Button>
              </div>
              
              <div className="p-4 border rounded-md bg-yellow-50 border-yellow-200">
                <h3 className="font-medium text-yellow-700">Export and Download Your Data</h3>
                <p className="text-sm text-gray-600 my-2">
                  Download a copy of all your data before deleting your account.
                </p>
                <Button variant="outline" className="mt-2">
                  Download My Data
                </Button>
              </div>
            </div>
          </TabsContent>
        </Card>
      </div>
      
      <div className="mt-8 text-center">
        <Button variant="outline" className="text-gray-500">
          <LogOut className="h-4 w-4 mr-1" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage; 