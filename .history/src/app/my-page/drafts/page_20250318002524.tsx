"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { PenLine, FileText, Trash2 } from "lucide-react"
import { UserDraft } from "@/types/user"

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<UserDraft[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading drafts from an API
    const loadDrafts = async () => {
      setLoading(true)
      try {
        // In a real app, we would fetch from an API
        // For now, we'll use mock data
        const mockDrafts: UserDraft[] = [
          {
            id: "draft-1",
            type: "post",
            title: "My skincare routine for winter months",
            content: "During the winter months, I focus on hydration and protection...",
            lastEdited: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "draft-2",
            type: "review",
            title: "Review: Cetaphil Gentle Skin Cleanser",
            content: "I've been using Cetaphil's Gentle Skin Cleanser for a month now...",
            lastEdited: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "draft-3",
            type: "post",
            title: "How I cleared my acne in 3 months",
            content: "After struggling with acne for years, I finally found a routine that works...",
            lastEdited: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ]
        setDrafts(mockDrafts)
      } catch (error) {
        console.error("Failed to load drafts:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDrafts()
  }, [])

  const handleDeleteDraft = (draftId: string) => {
    // In a real app, we would call an API to delete the draft
    // For now, we'll just update the state
    setDrafts(drafts.filter(draft => draft.id !== draftId))
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
        <h1 className="text-2xl font-bold">My Drafts</h1>
        <Button asChild>
          <Link href="/create">
            <PenLine className="h-4 w-4 mr-2" />
            Create New
          </Link>
        </Button>
      </div>

      {drafts.length > 0 ? (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <Card key={draft.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 bg-gray-100 text-gray-800">
                        {draft.type === "post" ? "Post" : "Review"}
                      </span>
                      <span className="text-sm text-gray-500">
                        Last edited {formatDistanceToNow(new Date(draft.lastEdited), { addSuffix: true })}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      {draft.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">
                      {draft.content}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 px-6 py-3 flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteDraft(draft.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/edit/${draft.id}`}>
                    <FileText className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No drafts yet</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto mb-6">
            You don't have any saved drafts. Start creating posts or reviews and save them as drafts to continue later.
          </p>
          <Button asChild>
            <Link href="/create">
              <PenLine className="h-4 w-4 mr-2" />
              Start Creating
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
} 