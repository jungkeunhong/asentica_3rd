'use client';

import { Sparkles, Award, Star, MessageSquare, ShoppingBag, TrendingUp, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GlowStats as GlowStatsType } from '@/types/user';

interface GlowStatsProps {
  stats: GlowStatsType;
  compact?: boolean;
  showComparison?: boolean;
}

// Helper function to determine glow level color
const getGlowColor = (level: number): string => {
  if (level < 5) return 'from-blue-400 to-blue-500';
  if (level < 10) return 'from-green-400 to-green-500';
  if (level < 20) return 'from-purple-400 to-purple-500';
  if (level < 30) return 'from-amber-400 to-amber-500';
  return 'from-pink-400 to-pink-500';
};

export const GlowStats: React.FC<GlowStatsProps> = ({
  stats,
  compact = false,
  showComparison = false
}) => {
  const glowColor = getGlowColor(stats.level);
  const progressPercent = stats.progress;
  const pointsToNextLevel = stats.nextLevelAt - stats.total;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
          Glow Stats
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Total Glow Score */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-1"
                 style={{ backgroundImage: `linear-gradient(to right, var(--${glowColor.split(' ')[0]}), var(--${glowColor.split(' ')[1]}))` }}>
              {stats.total.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <span>Total Glow Points</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 ml-1 cursor-help text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Glow points reflect your contribution and reputation in the Asentica community. Earn points by posting, commenting, and receiving upvotes.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-semibold">Level {stats.level}</div>
            <div className="text-sm text-gray-500">{stats.rank || ''}</div>
          </div>
        </div>
        
        {/* Progress to Next Level */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress to Level {stats.level + 1}</span>
            <span>{pointsToNextLevel} points to go</span>
          </div>
          <Progress value={progressPercent} className="h-2" 
            indicatorClassName={`bg-gradient-to-r ${glowColor}`} />
        </div>
        
        {!compact && (
          <>
            {/* Breakdown */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Glow Breakdown</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                    <Award className="h-4 w-4 text-amber-700" />
                  </div>
                  <div>
                    <div className="text-sm">{stats.breakdown.posts} points</div>
                    <div className="text-xs text-gray-500">Posts</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <MessageSquare className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <div className="text-sm">{stats.breakdown.comments} points</div>
                    <div className="text-xs text-gray-500">Comments</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <Star className="h-4 w-4 text-purple-700" />
                  </div>
                  <div>
                    <div className="text-sm">{stats.breakdown.reviews} points</div>
                    <div className="text-xs text-gray-500">Reviews</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <TrendingUp className="h-4 w-4 text-green-700" />
                  </div>
                  <div>
                    <div className="text-sm">{stats.breakdown.helpfulVotes} points</div>
                    <div className="text-xs text-gray-500">Helpful Votes</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                    <ShoppingBag className="h-4 w-4 text-pink-700" />
                  </div>
                  <div>
                    <div className="text-sm">{stats.breakdown.verifiedPurchases} points</div>
                    <div className="text-xs text-gray-500">Verified Purchases</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Community Comparison (optional) */}
            {showComparison && stats.percentile && (
              <div className="mt-6 p-3 bg-gray-50 rounded-md">
                <div className="text-sm text-gray-700">
                  You have more Glow points than {stats.percentile}% of users
                </div>
                <Progress value={stats.percentile} className="h-1.5 mt-2" />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}; 