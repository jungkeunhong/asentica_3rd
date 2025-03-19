import { Metadata } from "next"
import { SidebarNav } from "@/components/ui/Sidebar"

export const metadata: Metadata = {
  title: "My Profile | Asentica",
  description: "View and manage your profile, content, and account settings",
}

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          </div>
        </div>
      </div>
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 pb-12">
          {children}
        </main>
      </div>
    </div>
  )
}