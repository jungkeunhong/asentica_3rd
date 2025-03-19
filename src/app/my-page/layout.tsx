import { Metadata } from "next"
import { ClientLayout } from "@/components/layouts/ClientLayout"

export const metadata: Metadata = {
  title: "My Profile | Asentica",
  description: "View and manage your profile, content, and account settings",
}



export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}