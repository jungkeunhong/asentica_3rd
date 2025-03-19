"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserBadge } from "@/types/user"
import { getMockUserData } from "@/data/mockUserData"
import { format } from "date-fns"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function UserBadges() {
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  
  useEffect(() => {
    // In a real app, we would fetch user badges from an API
    // For now, we'll use mock data
    const userData = getMockUserData()
    
    // Map the data to ensure it matches the UserBadge type
    const badgesWithCorrectType: UserBadge[] = (userData.badges || []).map(badge => ({
      ...badge,
      // Ensure the badge has all required properties
      earnedDate: badge.earnedDate || new Date().toISOString(),
      category: badge.category || inferCategoryFromName(badge.name),
      // Use image property for iconUrl if it exists
      image: badge.image || badge.iconUrl
    }));
    
    setBadges(badgesWithCorrectType)
    setLoading(false)
  }, [])
  
  // Helper function to infer category from badge name
  const inferCategoryFromName = (name: string): 'achievements' | 'contributions' | 'expertise' => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("expert") || lowerName.includes("pro")) return "expertise";
    if (lowerName.includes("review") || lowerName.includes("helpful")) return "contributions";
    return "achievements";
  };
  
  // Mock categories for badges
  const categories = [
    { id: "all", name: "All Badges" },
    { id: "achievement", name: "Achievements" },
    { id: "contribution", name: "Contributions" },
    { id: "expert", name: "Expertise" }
  ]
  
  // Filter badges based on active tab
  const filteredBadges = badges.filter(badge => {
    if (activeTab === "all") return true
    // In a real app, badges would have a category property
    // For now, we'll just simulate it based on badge name
    const lowerName = badge.name.toLowerCase()
    if (activeTab === "achievement" && (lowerName.includes("completed") || lowerName.includes("profile"))) return true
    if (activeTab === "contribution" && (lowerName.includes("review") || lowerName.includes("helpful"))) return true
    if (activeTab === "expert" && (lowerName.includes("expert") || lowerName.includes("pro"))) return true
    return false
  })
  
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
        <h1 className="text-2xl font-bold">My Badges</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTab}>
          {filteredBadges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBadges.map(badge => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700">No badges found</h3>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">
                Continue participating in the community to earn badges!
              </p>
              <Button asChild className="mt-6">
                <Link href="/community">
                  Explore Community
                </Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface BadgeCardProps {
  badge: UserBadge
}

function BadgeCard({ badge }: BadgeCardProps) {
  // Helper to determine the appropriate color scheme for the badge
  const getBadgeColorScheme = () => {
    const name = badge.name.toLowerCase()
    
    if (name.includes("expert") || name.includes("pro")) {
      return {
        bg: "bg-purple-50",
        border: "border-purple-100",
        icon: "bg-purple-100",
        text: "text-purple-800",
        buttonBg: "bg-purple-100",
        buttonText: "text-purple-800"
      }
    }
    
    if (name.includes("review") || name.includes("helpful")) {
      return {
        bg: "bg-blue-50",
        border: "border-blue-100",
        icon: "bg-blue-100",
        text: "text-blue-800",
        buttonBg: "bg-blue-100",
        buttonText: "text-blue-800"
      }
    }
    
    return {
      bg: "bg-amber-50",
      border: "border-amber-100",
      icon: "bg-amber-100",
      text: "text-amber-800",
      buttonBg: "bg-amber-100",
      buttonText: "text-amber-800"
    }
  }
  
  const colors = getBadgeColorScheme()
  
  return (
    <Card className={`p-6 ${colors.bg} border ${colors.border} relative overflow-hidden`}>
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-16 h-16 rounded-lg ${colors.icon} flex items-center justify-center`}>
          <Image 
            src={badge.image || "/images/default-badge.png"} 
            alt={badge.name} 
            width={40}
            height={40}
            className="h-10 w-10" 
          />
        </div>
        
        <div className="flex-1">
          <h3 className={`font-semibold text-lg ${colors.text}`}>{badge.name}</h3>
          <p className="text-gray-600 mt-1">{badge.description}</p>
          
          {badge.earnedDate && (
            <div className="mt-3 text-sm text-gray-500">
              Earned {format(new Date(badge.earnedDate), "MMMM d, yyyy")}
            </div>
          )}
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className={`${colors.buttonBg} ${colors.buttonText} border-none`}
            >
              Share Badge
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
        <svg viewBox="0 0 80 80" fill="currentColor" className={colors.text}>
          <path d="M40 0C17.9 0 0 17.9 0 40s17.9 40 40 40 40-17.9 40-40S62.1 0 40 0zm0 70c-16.5 0-30-13.5-30-30S23.5 10 40 10s30 13.5 30 30-13.5 30-30 30z" />
          <path d="M40 20c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 30c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" />
          <path d="M40 30c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm0 15c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" />
        </svg>
      </div>
    </Card>
  )
} 