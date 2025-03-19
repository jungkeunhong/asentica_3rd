import { Metadata } from "next"
import { Sidebar } from "@/components/ui/Sidebar"

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
      <Sidebar isOpen={true} onCloseAction={() => {}} isPermanent={true} />
      <div className="w-full md:pl-64 flex flex-col flex-1">
        <main className="flex-1 pb-12">
          {children}
        </main>
      </div>
    </div>
  )
}