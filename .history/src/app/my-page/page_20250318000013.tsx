"use client"

import { useEffect, useState } from "react"
import { UserProfilePage } from "@/components/user/UserProfilePage"
import { getMockUserData } from "@/data/mockUserData"
import { UserProfile } from "@/types/user"

export default function MyPage() {
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // In a real app, we would fetch user data from an API
    // For now, we'll use mock data
    const mockUser = getMockUserData()
    setUserData(mockUser)
    setLoading(false)
  }, [])
  
  if (loading) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }
  
  if (!userData) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-700">Unable to load profile</h2>
        <p className="mt-2 text-gray-500">Please try again later</p>
      </div>
    )
  }
  
  return <UserProfilePage userData={userData} isCurrentUser={true} />
} 