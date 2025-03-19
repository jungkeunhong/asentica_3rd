"use client";

import { UserProfile } from "@/types/user"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { MapPin, Globe, CalendarDays, Edit, Shield } from "lucide-react"
import { formatDistance } from "date-fns"
import Link from "next/link"
import Image from "next/image"

interface ProfileHeaderProps {
  user: UserProfile;
  isCurrentUser?: boolean;
}

export function ProfileHeader({ user, isCurrentUser = false }: ProfileHeaderProps) {
  const joinDateFormatted = formatDistance(
    new Date(user.joinDate), 
    new Date(), 
    { addSuffix: true }
  );
  
  // Format the cover image style with a fallback
  const coverStyle = {
    backgroundImage: user.coverImage 
      ? `url(${user.coverImage})` 
      : 'linear-gradient(to right, #f59e0b, #d97706)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
  
  return (
    <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
      {/* Cover Photo */}
      <div 
        className="h-48 w-full relative" 
        style={coverStyle}
      >
        {isCurrentUser && (
          <Button 
            size="sm" 
            variant="secondary" 
            className="absolute top-4 right-4 bg-white/80 hover:bg-white"
            asChild
          >
            <Link href="/my-page/edit">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Link>
          </Button>
        )}
      </div>
      
      {/* Profile Info */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="absolute -top-16 left-6 border-4 border-white rounded-full">
          <Avatar className="h-32 w-32">
            <div className="relative h-full w-full">
              <Image 
                src={user.profileImage} 
                alt={user.displayName} 
                fill
                className="object-cover"
              />
            </div>
          </Avatar>
        </div>
        
        {/* User Info */}
        <div className="pt-20 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{user.displayName}</h1>
              {user.verifiedStatus === true && (
                <Shield className="h-5 w-5 text-blue-500" fill="#dbeafe" />
              )}
            </div>
            
            <p className="text-gray-500">@{user.username}</p>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
              {user.location && (
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {user.location}
                </div>
              )}
              
              {user.website && (
                <div className="flex items-center text-sm text-gray-500">
                  <Globe className="h-4 w-4 mr-1" />
                  <a 
                    href={user.website.startsWith('http') ? user.website : `https://${user.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {user.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              
              <div className="flex items-center text-sm text-gray-500">
                <CalendarDays className="h-4 w-4 mr-1" />
                Joined {joinDateFormatted}
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3 items-center">
            <div className="flex space-x-6 mr-4">
              <div className="text-center">
                <span className="block font-bold">{user.followingCount}</span>
                <span className="text-sm text-gray-500">Following</span>
              </div>
              <div className="text-center">
                <span className="block font-bold">{user.followerCount}</span>
                <span className="text-sm text-gray-500">Followers</span>
              </div>
            </div>
            
            {!isCurrentUser && (
              <Button variant="default">
                Follow
              </Button>
            )}
          </div>
        </div>
        
        {/* Bio */}
        {user.bio && (
          <div className="mt-4">
            <p className="text-gray-700 whitespace-pre-line">{user.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
} 