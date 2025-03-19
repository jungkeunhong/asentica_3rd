'use client';

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserActivity } from "@/types/user"
import { formatDistanceToNow } from "date-fns"
import { FileText, Star, MessageSquare, ThumbsUp, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Extended ActivityItem interface that includes all possible properties needed
interface ActivityItem {
  id: string;
  type: 'post' | 'review' | 'comment' | 'like' | 'badge';
  date: string;
  title?: string;
  productId?: string;
  productName?: string;
  link?: string;
  targetTitle?: string;
  badgeName?: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  className?: string;
  limit?: number;
}

export const ActivityFeed = ({ 
  activities,
  className = "",
  limit = 10 
}: ActivityFeedProps) => {
  const [selectedTab, setSelectedTab] = useState<string>("all")
  
  // Filter activities based on selected tab
  const filteredActivities = activities
    .filter(activity => {
      if (selectedTab === "all") return true
      return activity.type === selectedTab
    })
    .slice(0, limit)
  
  // Helper to get the appropriate icon for an activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "post":
        return <FileText className="h-4 w-4 text-amber-500" />
      case "review":
        return <Star className="h-4 w-4 text-blue-500" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case "like":
        return <ThumbsUp className="h-4 w-4 text-purple-500" />
      case "badge":
        return <Award className="h-4 w-4 text-rose-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }
  
  // Helper to format the activity message
  const getActivityMessage = (activity: ActivityItem) => {
    switch (activity.type) {
      case "post":
        return (
          <>
            Created a post: <Link href={`/community/post/${activity.id}`} className="font-medium hover:underline">{activity.title}</Link>
          </>
        )
      case "review":
        return (
          <>
            Reviewed <Link href={`/products/${activity.productId}`} className="font-medium hover:underline">{activity.productName}</Link>
          </>
        )
      case "comment":
        return (
          <>
            Commented on <Link href={activity.link || '#'} className="font-medium hover:underline">{activity.targetTitle}</Link>
          </>
        )
      case "like":
        return (
          <>
            Liked <Link href={activity.link || '#'} className="font-medium hover:underline">{activity.targetTitle}</Link>
          </>
        )
      case "badge":
        return (
          <>
            Earned badge: <span className="font-medium">{activity.badgeName}</span>
          </>
        )
      default:
        return activity.title || "Activity"
    }
  }
  
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex flex-col space-y-4">
        <h2 className="text-lg font-semibold">Activity History</h2>
        
        <Tabs defaultValue="all" onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="post">Posts</TabsTrigger>
            <TabsTrigger value="review">Reviews</TabsTrigger>
            <TabsTrigger value="comment">Comments</TabsTrigger>
            <TabsTrigger value="badge">Badges</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedTab} className="mt-0">
            {filteredActivities.length > 0 ? (
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <div key={`${activity.type}-${activity.id}`} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                    <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <div className="text-sm">{getActivityMessage(activity)}</div>
                      <div className="mt-1 text-xs text-gray-500">
                        {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {activities.length > limit && (
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View More
                  </Button>
                )}
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-gray-500">No activities found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  )
} 