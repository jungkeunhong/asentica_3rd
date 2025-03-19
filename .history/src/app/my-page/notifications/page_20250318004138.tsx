"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { 
  Bell, 
  Heart, 
  MessageSquare, 
  UserPlus, 
  AtSign, 
  RefreshCw,
  Check,
  MoreHorizontal 
} from "lucide-react"
import { UserNotification } from "@/types/user"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<UserNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    // Simulate loading notifications from an API
    const loadNotifications = async () => {
      setLoading(true)
      try {
        // In a real app, we would fetch from an API
        // For now, we'll use mock data
        const mockNotifications: UserNotification[] = [
          {
            id: "notif-1",
            type: "like",
            message: "liked your post \"My Morning Skincare Routine\"",
            date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            read: false,
            actionUrl: "/post/1",
            fromUser: {
              id: "user-1",
              username: "jessica_beauty",
              profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
            }
          },
          {
            id: "notif-2",
            type: "comment",
            message: "commented on your post \"My Morning Skincare Routine\"",
            date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            read: false,
            actionUrl: "/post/1#comment-1",
            fromUser: {
              id: "user-2",
              username: "skincare_guru",
              profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
            }
          },
          {
            id: "notif-3",
            type: "follow",
            message: "started following you",
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            read: true,
            actionUrl: "/profile/user-3",
            fromUser: {
              id: "user-3",
              username: "derma_enthusiast",
              profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
            }
          },
          {
            id: "notif-4",
            type: "mention",
            message: "mentioned you in a comment",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            read: true,
            actionUrl: "/post/5#comment-3",
            fromUser: {
              id: "user-4",
              username: "beauty_insider",
              profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
            }
          },
          {
            id: "notif-5",
            type: "system",
            message: "Your account has been verified! Enjoy all the benefits of being a verified member.",
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            read: true,
            actionUrl: "/my-page"
          }
        ]
        
        setNotifications(mockNotifications)
      } catch (error) {
        console.error("Failed to load notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [])

  const handleMarkAsRead = (notificationId: string) => {
    // In a real app, we would call an API to mark the notification as read
    // For now, we'll just update the state
    setNotifications(notifications.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    ))
  }

  const handleMarkAllAsRead = () => {
    // Mark all notifications as read
    setNotifications(notifications.map(notification => ({ ...notification, read: true })))
  }

  const filteredNotifications = filter === "all" 
    ? notifications
    : filter === "unread"
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === filter)

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case "follow":
        return <UserPlus className="h-4 w-4 text-blue-500" />
      case "mention":
        return <AtSign className="h-4 w-4 text-purple-500" />
      case "system":
        return <Bell className="h-4 w-4 text-amber-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 sm:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
        <div className="flex overflow-x-auto scrollbar-hide">
          <button
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              filter === "all" ? "border-b-2 border-amber-500 text-amber-700" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              filter === "unread" ? "border-b-2 border-amber-500 text-amber-700" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setFilter("unread")}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              filter === "like" ? "border-b-2 border-amber-500 text-amber-700" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setFilter("like")}
          >
            Likes
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              filter === "comment" ? "border-b-2 border-amber-500 text-amber-700" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setFilter("comment")}
          >
            Comments
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              filter === "follow" ? "border-b-2 border-amber-500 text-amber-700" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setFilter("follow")}
          >
            Follows
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              filter === "mention" ? "border-b-2 border-amber-500 text-amber-700" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setFilter("mention")}
          >
            Mentions
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              filter === "system" ? "border-b-2 border-amber-500 text-amber-700" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setFilter("system")}
          >
            System
          </button>
        </div>
      </div>

      {filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`${!notification.read ? 'bg-amber-50' : ''} hover:shadow-md transition-shadow`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {notification.fromUser ? (
                    <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image 
                        src={notification.fromUser.profileImage} 
                        alt={notification.fromUser.username}
                        width={40}
                        height={40}
                        className="object-cover h-full w-full"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-900">
                          {notification.fromUser && (
                            <Link 
                              href={`/profile/${notification.fromUser.username}`}
                              className="font-semibold hover:text-amber-600"
                            >
                              {notification.fromUser.username}
                            </Link>
                          )}
                          {" "}
                          <span className="text-gray-700">
                            {notification.message}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                        </p>
                      </div>
                      
                      <div className="flex items-center ml-2">
                        {!notification.read && (
                          <button 
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                            onClick={() => handleMarkAsRead(notification.id)}
                            aria-label="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button 
                          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                          aria-label="More options"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {notification.actionUrl && (
                      <div className="mt-2">
                        <Link
                          href={notification.actionUrl}
                          className="inline-block text-xs font-medium text-amber-600 hover:text-amber-700"
                        >
                          View
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            {filter === "all" 
              ? "You don&apos;t have any notifications yet. Interact with the community to receive notifications."
              : `You don&apos;t have any ${filter} notifications.`
            }
          </p>
          <Button className="mt-6" asChild>
            <Link href="/community">
              Browse Community
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
} 