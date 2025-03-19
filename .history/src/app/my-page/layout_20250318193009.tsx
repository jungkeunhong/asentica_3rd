import { Metadata } from "next"
import { SidebarContainer } from "@/components/ui/SidebarContainer"

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
      <SidebarContainer />
      <div className="w-full md:pl-64 flex flex-col flex-1">
        <main className="flex-1 pb-12">
          {children}
        </main>
      </div>
    </div>
  )
}