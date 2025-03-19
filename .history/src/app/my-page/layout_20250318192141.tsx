import { Metadata } from "next"
import Link from "next/link"
import { 
  User, 
  Settings, 
  BookMarked, 
  Award, 
  MessageSquare,
  ShoppingBag
} from "lucide-react"

export const metadata: Metadata = {
  title: "My Profile | Asentica",
  description: "View and manage your profile, content, and account settings",
}

// Sidebar navigation items
const sidebarItems = [
  {
    title: "Profile",
    href: "/my-page",
    icon: <User className="w-5 h-5" />
  },
  {
    title: "Saved Content",
    href: "/my-page/saved",
    icon: <BookMarked className="w-5 h-5" />
  },
  {
    title: "Badges",
    href: "/my-page/badges",
    icon: <Award className="w-5 h-5" />
  },
  {
    title: "Settings",
    href: "/my-page/settings",
    icon: <Settings className="w-5 h-5" />
  }
]

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
            <div className="flex items-center flex-shrink-0 px-4 mb-5">
              <Link href="/" className="font-bold text-xl text-amber-600">
                Asentica
              </Link>
            </div>
            <nav className="mt-5 flex-1 px-4 space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-amber-600 hover:bg-gray-50"
                >
                  <span className="mr-3 text-gray-500 group-hover:text-amber-500">
                    {item.icon}
                  </span>
                  {item.title}
                </Link>
              ))}
            </nav>
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