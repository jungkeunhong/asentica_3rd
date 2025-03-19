"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { UserProfile } from "@/types/user"
import { getMockUserData } from "@/data/mockUserData"
import Link from "next/link"
import { ArrowLeft, Camera, Upload } from "lucide-react"

export default function EditProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    bio: "",
    location: "",
    website: "",
    instagram: "",
    twitter: "",
    youtube: "",
    skinType: "",
    skinTone: ""
  })
  
  const [skinConcerns, setSkinConcerns] = useState<string[]>([])
  const [favoriteIngredients, setFavoriteIngredients] = useState<string[]>([])
  
  // Load user data
  useEffect(() => {
    // In a real app, we would fetch user data from an API
    // For now, we'll use mock data
    const mockUser = getMockUserData()
    setUser(mockUser)
    
    // Initialize form with user data
    setFormData({
      displayName: mockUser.displayName || "",
      username: mockUser.username || "",
      bio: mockUser.bio || "",
      location: mockUser.location || "",
      website: mockUser.website || "",
      instagram: mockUser.socialLinks?.instagram || "",
      twitter: mockUser.socialLinks?.twitter || "",
      youtube: mockUser.socialLinks?.youtube || "",
      skinType: mockUser.skinProfile?.skinType || "",
      skinTone: mockUser.skinProfile?.skinTone || ""
    })
    
    setSkinConcerns(mockUser.skinProfile?.concerns || [])
    setFavoriteIngredients(mockUser.skinProfile?.favoriteIngredients || [])
    setLoading(false)
  }, [])
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    // In a real app, we would send the updated data to the API
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update user state with form data
    if (user) {
      setUser({
        ...user,
        displayName: formData.displayName,
        username: formData.username,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        socialLinks: {
          instagram: formData.instagram,
          twitter: formData.twitter,
          youtube: formData.youtube
        },
        skinProfile: {
          ...user.skinProfile,
          skinType: formData.skinType,
          skinTone: formData.skinTone,
          concerns: skinConcerns,
          favoriteIngredients: favoriteIngredients
        }
      })
    }
    
    setSaving(false)
    
    // In a real app, we would navigate to the profile page
    // For now, we'll just show a success message
    alert('Profile updated successfully!')
  }
  
  if (loading) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
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
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {/* Profile images section */}
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Profile Images</h2>
              
              <div className="space-y-6">
                {/* Profile image */}
                <div className="space-y-3">
                  <Label htmlFor="profileImage">Profile Picture</Label>
                  <div className="flex items-center justify-center">
                    <div className="relative h-32 w-32 rounded-full overflow-hidden">
                      <img 
                        src={user?.profileImage} 
                        alt="Profile"
                        className="h-full w-full object-cover" 
                      />
                      <Button 
                        type="button"
                        variant="secondary" 
                        size="icon" 
                        className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Cover image */}
                <div className="space-y-3">
                  <Label htmlFor="coverImage">Cover Image</Label>
                  <div className="relative w-full h-28 bg-gray-100 rounded-lg overflow-hidden">
                    {user?.coverImage ? (
                      <img 
                        src={user.coverImage} 
                        alt="Cover"
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-r from-amber-100 to-amber-200" />
                    )}
                    <Button 
                      type="button"
                      variant="secondary" 
                      size="sm" 
                      className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Upload Cover
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Social media section */}
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Social Media</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border rounded-l-md bg-gray-50 text-gray-500">
                      @
                    </div>
                    <Input 
                      id="instagram"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      placeholder="username"
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border rounded-l-md bg-gray-50 text-gray-500">
                      @
                    </div>
                    <Input 
                      id="twitter"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      placeholder="username"
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input 
                    id="youtube"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleInputChange}
                    placeholder="YouTube channel name"
                  />
                </div>
              </div>
            </Card>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            {/* Basic info section */}
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input 
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    placeholder="Your display name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border rounded-l-md bg-gray-50 text-gray-500">
                      @
                    </div>
                    <Input 
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="username"
                      className="rounded-l-none"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500">
                    {formData.bio.length}/300 characters
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </Card>
            
            {/* Skin profile section */}
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Skin Profile</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="skinType">Skin Type</Label>
                  <select 
                    id="skinType"
                    name="skinType"
                    value={formData.skinType}
                    onChange={handleInputChange as any}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select skin type</option>
                    <option value="Dry">Dry</option>
                    <option value="Oily">Oily</option>
                    <option value="Combination">Combination</option>
                    <option value="Normal">Normal</option>
                    <option value="Sensitive">Sensitive</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="skinTone">Skin Tone</Label>
                  <select 
                    id="skinTone"
                    name="skinTone"
                    value={formData.skinTone}
                    onChange={handleInputChange as any}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select skin tone</option>
                    <option value="Fair">Fair</option>
                    <option value="Light">Light</option>
                    <option value="Medium">Medium</option>
                    <option value="Tan">Tan</option>
                    <option value="Deep">Deep</option>
                    <option value="Rich">Rich</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label>Skin Concerns</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Acne", "Hyperpigmentation", "Fine Lines", "Wrinkles", 
                      "Dryness", "Oiliness", "Redness", "Sensitivity", 
                      "Texture", "Dark Circles", "Pores", "Dullness"
                    ].map(concern => (
                      <label 
                        key={concern}
                        className={`px-3 py-1.5 text-sm rounded-full cursor-pointer transition-colors ${
                          skinConcerns.includes(concern) 
                            ? "bg-amber-100 text-amber-800" 
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <input 
                          type="checkbox"
                          className="sr-only"
                          checked={skinConcerns.includes(concern)}
                          onChange={() => {
                            if (skinConcerns.includes(concern)) {
                              setSkinConcerns(skinConcerns.filter(c => c !== concern))
                            } else {
                              setSkinConcerns([...skinConcerns, concern])
                            }
                          }}
                        />
                        {concern}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Favorite Ingredients</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Vitamin C", "Retinol", "Niacinamide", "Hyaluronic Acid", 
                      "Salicylic Acid", "Glycolic Acid", "Lactic Acid", "AHA/BHA", 
                      "Peptides", "Ceramides", "Snail Mucin", "Centella Asiatica"
                    ].map(ingredient => (
                      <label 
                        key={ingredient}
                        className={`px-3 py-1.5 text-sm rounded-full cursor-pointer transition-colors ${
                          favoriteIngredients.includes(ingredient) 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <input 
                          type="checkbox"
                          className="sr-only"
                          checked={favoriteIngredients.includes(ingredient)}
                          onChange={() => {
                            if (favoriteIngredients.includes(ingredient)) {
                              setFavoriteIngredients(favoriteIngredients.filter(i => i !== ingredient))
                            } else {
                              setFavoriteIngredients([...favoriteIngredients, ingredient])
                            }
                          }}
                        />
                        {ingredient}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/my-page">Cancel</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
} 