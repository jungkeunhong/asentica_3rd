'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Pencil, Heart, MessageSquare, Bookmark, Award, TrendingUp, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserActivity, ActivityType } from '@/types/user';

interface ActivityFeedProps {
  activities: UserActivity[];
  maxItems?: number;
  showTitle?: boolean;
  className?: string;
}

// Activity type to icon mapping
const activityIcons: Record<ActivityType, React.ReactNode> = {
  post_created: <Pencil className="h-4 w-4 text-amber-700" />,
  post_liked: <Heart className="h-4 w-4 text-red-600" />,
  comment_created: <MessageSquare className="h-4 w-4 text-blue-600" />,
  post_saved: <Bookmark className="h-4 w-4 text-purple-600" />,
  review_created: <BarChart className="h-4 w-4 text-green-600" />,
  badge_earned: <Award className="h-4 w-4 text-amber-600" />,
  level_up: <TrendingUp className="h-4 w-4 text-pink-600" />,
};

// Activity type to descriptive text mapping
const activityTexts: Record<ActivityType, string> = {
  post_created: 'Created a post',
  post_liked: 'Liked a post',
  comment_created: 'Commented on',
  post_saved: 'Saved a post',
  review_created: 'Added a review',
  badge_earned: 'Earned a badge',
  level_up: 'Reached a new level',
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  maxItems = 5,
  showTitle = true,
  className = '',
}) => {
  // Take only the requested number of items
  const displayActivities = activities.slice(0, maxItems);
  
  const getActivityUrl = (activity: UserActivity): string => {
    switch (activity.type) {
      case 'post_created':
      case 'post_liked':
      case 'post_saved':
      case 'comment_created':
        return `/community/post/${activity.contentId}`;
      case 'review_created':
        return `/reviews/${activity.contentId}`;
      case 'badge_earned':
        return `/my-page/badges`;
      case 'level_up':
        return `/my-page`;
      default:
        return '#';
    }
  };
  
  return (
    <Card className={className}>
      {showTitle && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
      )}
      
      <CardContent>
        <div className="space-y-4">
          {displayActivities.length > 0 ? (
            displayActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                {/* Activity Icon */}
                <div className="mt-0.5 flex-shrink-0 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center">
                  {activityIcons[activity.type]}
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Activity Description */}
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">
                      {activityTexts[activity.type]}
                    </span>
                    {' '}
                    {activity.contentTitle && (
                      <Link 
                        href={getActivityUrl(activity)}
                        className="text-amber-700 hover:text-amber-800 hover:underline truncate inline-block max-w-[200px] align-bottom"
                        title={activity.contentTitle}
                      >
                        {activity.contentTitle}
                      </Link>
                    )}
                    
                    {/* Points earned */}
                    {activity.points && activity.points > 0 && (
                      <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                        +{activity.points} glow
                      </Badge>
                    )}
                  </div>
                  
                  {/* Activity Preview */}
                  {activity.contentPreview && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                      {activity.contentPreview}
                    </p>
                  )}
                  
                  {/* Tags */}
                  {activity.tagIds && activity.tagIds.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {activity.tagIds.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Timestamp */}
                  <div className="mt-1 text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              No recent activity to display
            </div>
          )}
          
          {activities.length > maxItems && (
            <div className="text-center pt-2">
              <Link 
                href="/my-page/activity" 
                className="text-sm text-amber-700 hover:text-amber-800 hover:underline"
              >
                View all activity
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 