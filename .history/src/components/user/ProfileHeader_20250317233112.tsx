'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Eye, EyeOff, MapPin, Globe, CalendarDays, Edit, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserProfile, MemberTier } from '@/types/user';

interface ProfileHeaderProps {
  userProfile: UserProfile;
  isOwnProfile?: boolean;
}

// Map of member tiers to display colors
const memberTierColors: Record<MemberTier, string> = {
  'Dewdrop': 'text-blue-500 bg-blue-50',
  'Radiance': 'text-teal-500 bg-teal-50',
  'Luminous': 'text-purple-500 bg-purple-50',
  'Gleaming': 'text-amber-500 bg-amber-50',
  'Ethereal': 'text-pink-500 bg-pink-50'
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  userProfile,
  isOwnProfile = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const memberTierColor = memberTierColors[userProfile.memberTier] || 'text-gray-500 bg-gray-50';
  
  // Format join date
  const formattedJoinDate = format(new Date(userProfile.joinDate), 'MMMM yyyy');
  
  return (
    <div className="relative mb-6">
      {/* Cover image */}
      <div className="h-48 w-full rounded-t-lg overflow-hidden bg-gradient-to-r from-amber-100 to-amber-200 relative">
        {userProfile.coverImageUrl && (
          <Image
            src={userProfile.coverImageUrl}
            alt="Cover"
            fill
            className="object-cover"
            priority
          />
        )}
      </div>
      
      {/* Profile info container */}
      <div className="bg-white rounded-b-lg shadow-sm px-6 pb-6 pt-16 relative">
        {/* Avatar */}
        <div className="absolute -top-12 left-6 rounded-full overflow-hidden border-4 border-white shadow-md">
          <Image
            src={userProfile.avatarUrl}
            alt={userProfile.username}
            width={96}
            height={96}
            className="object-cover bg-amber-50"
          />
        </div>
        
        {/* Edit button (only shown to owner) */}
        {isOwnProfile && (
          <div className="absolute top-4 right-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        )}
        
        {/* User information */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mt-2">
          <div className="flex-1">
            {/* Username and display name */}
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {userProfile.displayName || userProfile.username}
              </h1>
              
              {/* Verification badge */}
              {userProfile.isVerified && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              
              {/* Privacy indicator */}
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                {userProfile.isAnonymous ? (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    Anonymous
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Public
                  </>
                )}
              </Badge>
            </div>
            
            {/* Username */}
            <p className="text-gray-500 mt-1">@{userProfile.username}</p>
            
            {/* Member tier */}
            <div className="mt-3">
              <Badge className={`${memberTierColor} font-medium`}>
                {userProfile.memberTier} Member
              </Badge>
            </div>
            
            {/* Bio */}
            {userProfile.bio && (
              <p className="mt-4 text-gray-700">{userProfile.bio}</p>
            )}
            
            {/* Location, website, join date */}
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
              {userProfile.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{userProfile.location}</span>
                </div>
              )}
              
              {userProfile.website && (
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  <a 
                    href={userProfile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber-700 hover:text-amber-800 hover:underline"
                  >
                    {userProfile.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-1" />
                <span>Joined {formattedJoinDate}</span>
              </div>
            </div>
          </div>
          
          {/* Stats (followers, following, etc.) */}
          <div className="flex gap-4 mt-6 md:mt-0">
            <Link href={`/user/${userProfile.username}/followers`} className="text-center">
              <div className="text-xl font-bold text-gray-900">{userProfile.followersCount}</div>
              <div className="text-sm text-gray-500">Followers</div>
            </Link>
            
            <Link href={`/user/${userProfile.username}/following`} className="text-center">
              <div className="text-xl font-bold text-gray-900">{userProfile.followingCount}</div>
              <div className="text-sm text-gray-500">Following</div>
            </Link>
            
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{userProfile.postsCount}</div>
              <div className="text-sm text-gray-500">Posts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 