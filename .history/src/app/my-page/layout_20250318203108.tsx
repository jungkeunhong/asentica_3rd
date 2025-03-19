import { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Profile | Asentica",
  description: "View and manage your profile, content, and account settings",
}

import { ClientLayout } from "@/components/layouts/ClientLayout"

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}