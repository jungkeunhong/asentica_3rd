'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Eye, EyeOff, MapPin, Globe, CalendarDays, Edit, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/types/user';

interface ProfileHeaderProps {
  userProfile: UserProfile;
  isOwnProfile?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  userProfile,
  isOwnProfile = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Format join date
  const formattedJoinDate = format(new Date(userProfile.joinDate), 'MMMM yyyy');
  
  return (
    <div className="relative mb-6">
      {/* Cover image */}
      <div className="h-48 w-full rounded-t-lg overflow-hidden bg-gradient-to-r from-amber-100 to-amber-200 relative">
        {userProfile.coverImage && (
          <Image
            src={userProfile.coverImage}
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
            src={userProfile.profileImage}
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
              {userProfile.verificationStatus === "verified" && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            
            {/* Username */}
            <p className="text-gray-500 mt-1">@{userProfile.username}</p>
            
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
              <div className="text-xl font-bold text-gray-900">{userProfile.followerCount}</div>
              <div className="text-sm text-gray-500">Followers</div>
            </Link>
            
            <Link href={`/user/${userProfile.username}/following`} className="text-center">
              <div className="text-xl font-bold text-gray-900">{userProfile.followingCount}</div>
              <div className="text-sm text-gray-500">Following</div>
            </Link>
            
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{userProfile.glowStats.postsCount}</div>
              <div className="text-sm text-gray-500">Posts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 