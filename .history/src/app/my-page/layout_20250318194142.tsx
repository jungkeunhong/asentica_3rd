import { Metadata } from "next"
import { Sidebar } from "@/components/ui/Sidebar"
import Navbar from "@/components/Navbar"

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
      <Sidebar isOpen={true} onCloseAction={() => {}} />
      <div className="w-full flex flex-col">
        <Navbar />
        <div className="flex-1 pt-16 pb-12">
          {children}
        </div>
      </div>
    </div>
  )
}