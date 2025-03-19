"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChevronLeft, Upload, Camera, User, ChevronDown, MapPin, Link as LinkIcon, Globe, Instagram, Twitter } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"

import { getMockUserData } from "@/data/mockUserData"
import { UserData } from "@/types/user"

type EditSection = "profile" | "photos" | "preferences" | "social";

const ProfileEditPage = () => {
  const initialData = getMockUserData();
  const [userData, setUserData] = useState<UserData>(initialData);
  const [activeTab, setActiveTab] = useState<EditSection>("profile");
  const [saving, setSaving] = useState(false);
  const [imageHover, setImageHover] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you would save to Supabase here
    console.log("Saving user data:", userData);
    
    setSaving(false);
  };

  const updateUserData = (field: keyof UserData, value: any) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested objects
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setUserData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof UserData],
          [child]: value
        }
      }));
    } else {
      updateUserData(name as keyof UserData, value);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/my-page" className="inline-flex items-center text-gray-600 hover:text-amber-700 mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Back to profile</span>
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold">Edit Profile</h1>
          <Button 
            onClick={handleSave} 
            disabled={saving} 
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="p-4 lg:col-span-1">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as EditSection)} orientation="vertical" className="h-full">
            <TabsList className="flex flex-col items-start h-full space-y-1 bg-transparent">
              <TabsTrigger 
                value="profile" 
                className="w-full justify-start px-4 py-2 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-800"
              >
                <User className="h-4 w-4 mr-2" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger 
                value="photos" 
                className="w-full justify-start px-4 py-2 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-800"
              >
                <Camera className="h-4 w-4 mr-2" />
                Profile Photos
              </TabsTrigger>
              <TabsTrigger 
                value="preferences" 
                className="w-full justify-start px-4 py-2 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-800"
              >
                <ChevronDown className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger 
                value="social" 
                className="w-full justify-start px-4 py-2 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-800"
              >
                <Globe className="h-4 w-4 mr-2" />
                Social Profiles
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>
        
        {/* Main content */}
        <Card className="p-6 lg:col-span-3">
          <TabsContent value="profile" className="mt-0">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input 
                    id="displayName" 
                    name="displayName" 
                    value={userData.displayName} 
                    onChange={handleInputChange}
                    placeholder="Your display name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    name="username" 
                    value={userData.username} 
                    onChange={handleInputChange}
                    placeholder="Your username"
                  />
                  <p className="text-xs text-gray-500">This will be your @username</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  value={userData.bio} 
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                  className="min-h-[120px]"
                />
                <p className="text-xs text-gray-500">Brief description for your profile.</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="location" 
                    name="location" 
                    value={userData.location || ""}
                    onChange={handleInputChange}
                    placeholder="Your location"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="photos" className="mt-0">
            <h2 className="text-xl font-semibold mb-4">Profile Photos</h2>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Profile Picture</Label>
                <div className="flex items-start gap-6">
                  <div 
                    className="relative"
                    onMouseEnter={() => setImageHover(true)}
                    onMouseLeave={() => setImageHover(false)}
                  >
                    <Avatar className="h-24 w-24 border-2 border-white shadow-sm">
                      <img 
                        src={userData.profileImage} 
                        alt={userData.displayName} 
                        className="object-cover"
                      />
                    </Avatar>
                    {imageHover && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center">
                        <Camera className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <Button variant="outline" size="sm" className="flex gap-1 items-center">
                      <Upload className="h-4 w-4" />
                      <span>Upload New Picture</span>
                    </Button>
                    <p className="text-xs text-gray-500">
                      Recommended size: 400x400 pixels. Max size: 2MB.
                      <br />
                      Supported formats: JPG, PNG, GIF
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <Label>Cover Image</Label>
                <div className="w-full h-40 bg-gray-100 rounded-lg relative overflow-hidden">
                  {userData.coverImage ? (
                    <img 
                      src={userData.coverImage} 
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                      No cover image set
                    </div>
                  )}
                  
                  <div className="absolute bottom-3 right-3">
                    <Button variant="outline" size="sm" className="bg-white shadow-sm">
                      <Upload className="h-4 w-4 mr-1" />
                      <span>Change Cover</span>
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Recommended size: 1200x400 pixels. Max size: 5MB.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preferences" className="mt-0">
            <h2 className="text-xl font-semibold mb-4">Account Preferences</h2>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notif-comments" className="font-normal">Comment notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications when someone comments on your posts</p>
                    </div>
                    <Switch id="notif-comments" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notif-likes" className="font-normal">Like notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications when someone likes your content</p>
                    </div>
                    <Switch id="notif-likes" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notif-follows" className="font-normal">New follower notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications when someone follows you</p>
                    </div>
                    <Switch id="notif-follows" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notif-newsletter" className="font-normal">Newsletter</Label>
                      <p className="text-sm text-gray-500">Receive our weekly newsletter with skincare tips</p>
                    </div>
                    <Switch id="notif-newsletter" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <h3 className="text-lg font-medium">Privacy Settings</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Profile Visibility</Label>
                    <RadioGroup defaultValue="public">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="visibility-public" />
                        <Label htmlFor="visibility-public" className="font-normal">Public</Label>
                      </div>
                      <p className="text-sm text-gray-500 ml-6 mb-2">Anyone can see your profile</p>
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="visibility-private" />
                        <Label htmlFor="visibility-private" className="font-normal">Private</Label>
                      </div>
                      <p className="text-sm text-gray-500 ml-6">Only people you approve can see your profile</p>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="social" className="mt-0">
            <h2 className="text-xl font-semibold mb-4">Social Profiles</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="website">Personal Website</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="website" 
                    name="website" 
                    placeholder="https://your-website.com" 
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="instagram" 
                    name="instagram" 
                    placeholder="your_instagram_handle" 
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter / X</Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="twitter" 
                    name="twitter" 
                    placeholder="your_twitter_handle" 
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Adding your social profiles helps community members find and connect with you on other platforms. This information is shown publicly on your profile.
                </p>
              </div>
            </div>
          </TabsContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileEditPage; 