import type { Metadata } from "next"
import { Sidebar } from "@/components/ui/Sidebar"

export const metadata: Metadata = {
  title: "My Profile | Asentica",
  description: "View and manage your Asentica profile",
}

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="pt-16 pb-20">
        {children}
      </main>
    </div>
  )
} 