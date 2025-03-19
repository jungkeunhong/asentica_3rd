"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sparkles, Award, Star, MessageSquare, TrendingUp, Info } from "lucide-react"
import { UserGlowStats } from "@/types/user"

interface GlowStatsDisplayProps {
  stats: UserGlowStats
  showContributionLevel?: boolean
  className?: string
}

// Helper function to determine color based on contribution level
const getContributionLevelColor = (level?: string): string => {
  switch (level) {
    case "beginner": return "from-blue-400 to-blue-500"
    case "intermediate": return "from-green-400 to-green-500"
    case "expert": return "from-purple-400 to-purple-500"
    case "master": return "from-amber-400 to-amber-500"
    default: return "from-blue-400 to-blue-500"
  }
}

export const GlowStatsDisplay = ({
  stats,
  showContributionLevel = true,
  className = ""
}: GlowStatsDisplayProps) => {
  const levelColor = getContributionLevelColor(stats.contributionLevel)
  
  // Calculate the streak display text
  const streakText = stats.streakDays > 0 
    ? stats.streakDays === 1 
      ? "1 day streak" 
      : `${stats.streakDays} day streak` 
    : "Start a streak"
  
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center mb-4">
        <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
        <h2 className="text-lg font-semibold">Your Glow Stats</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col items-center justify-center p-3 bg-amber-50 rounded-lg">
          <div className="mb-1 flex items-center justify-center h-10 w-10 rounded-full bg-amber-100">
            <Award className="h-5 w-5 text-amber-700" />
          </div>
          <span className="text-2xl font-bold text-amber-700">{stats.postsCount}</span>
          <span className="text-sm text-gray-600">Posts</span>
        </div>
        
        <div className="flex flex-col items-center justify-center p-3 bg-blue-50 rounded-lg">
          <div className="mb-1 flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
            <Star className="h-5 w-5 text-blue-700" />
          </div>
          <span className="text-2xl font-bold text-blue-700">{stats.reviewsCount}</span>
          <span className="text-sm text-gray-600">Reviews</span>
        </div>
        
        <div className="flex flex-col items-center justify-center p-3 bg-green-50 rounded-lg">
          <div className="mb-1 flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
            <MessageSquare className="h-5 w-5 text-green-700" />
          </div>
          <span className="text-2xl font-bold text-green-700">{stats.commentsCount}</span>
          <span className="text-sm text-gray-600">Comments</span>
        </div>
        
        <div className="flex flex-col items-center justify-center p-3 bg-purple-50 rounded-lg">
          <div className="mb-1 flex items-center justify-center h-10 w-10 rounded-full bg-purple-100">
            <TrendingUp className="h-5 w-5 text-purple-700" />
          </div>
          <span className="text-2xl font-bold text-purple-700">{stats.upvotesReceived}</span>
          <span className="text-sm text-gray-600">Upvotes</span>
        </div>
      </div>
      
      {showContributionLevel && stats.contributionLevel && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <span className="text-sm font-medium">Contribution Level: {stats.contributionLevel}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 ml-1 cursor-help text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Your contribution level reflects your activity and engagement in the community. 
                      Keep posting, reviewing, and helping others to increase your level!
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-sm text-gray-500">{streakText}</span>
          </div>
          <Progress 
            value={stats.streakDays > 0 ? Math.min(stats.streakDays, 30) * (100/30) : 5} 
            className="h-2" 
            indicatorClassName={`bg-gradient-to-r ${levelColor}`} 
          />
        </div>
      )}
    </Card>
  )
} 