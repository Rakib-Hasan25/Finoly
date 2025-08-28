"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/Tracker-ui/avatar"
import { 
  HomeIcon, 
  Gamepad2Icon, 
  GraduationCapIcon, 
  BarChart3Icon,
  SparklesIcon,
  LogOutIcon,
  UserIcon,
  CrownIcon
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"

const sidebarItems = [
  {
    title: "Home",
    href: "/dashboard/home",
    icon: HomeIcon,
  },
  {
    title: "Gamified Learning",
    href: "/dashboard/gamified-learning",
    icon: Gamepad2Icon,
  },
  {
    title: "Financial Coach",
    href: "/dashboard/financial-coach",
    icon: GraduationCapIcon,
  },
  {
    title: "Tracker",
    href: "/dashboard/tracker",
    icon: BarChart3Icon,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { toast } = useToast()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      })
      router.push('/auth/login')
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was an issue signing you out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getUserInitials = (email: string) => {
    if (!email) return 'U'
    return email.substring(0, 2).toUpperCase()
  }

  const getUserDisplayName = (email: string) => {
    if (!email) return 'User'
    const username = email.split('@')[0]
    return username.charAt(0).toUpperCase() + username.slice(1)
  }

  return (
    <div className="flex h-full w-72 flex-col bg-gradient-to-b from-white/10 via-white/5 to-white/10 backdrop-blur-xl border-r border-white/20 shadow-2xl">
      {/* Header with Logo */}
      <div className="p-6 border-b border-white/20 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl shadow-lg shadow-emerald-500/25">
            <SparklesIcon className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Finoly
            </h1>
            <p className="text-sm text-gray-300 mt-1 font-medium">
              Financial Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-3">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left h-14 px-6 rounded-xl transition-all duration-300 group hover:scale-[1.02]",
                  pathname === item.href
                    ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/20"
                    : "text-gray-300 hover:bg-white/10 hover:text-white hover:shadow-lg hover:border hover:border-white/20"
                )}
              >
                <Icon className={cn(
                  "mr-4 h-5 w-5 transition-all duration-300",
                  pathname === item.href 
                    ? "text-emerald-300" 
                    : "text-gray-400 group-hover:text-white"
                )} />
                <span className="font-medium">{item.title}</span>
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* User Profile Section */}
      {user && (
        <div className="mx-6 mb-4 p-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl border border-emerald-500/20 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-14 w-14 border-3 border-emerald-400/50 shadow-lg shadow-emerald-500/25">
                <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-xl">
                  {getUserInitials(user.email || '')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                <CrownIcon className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {getUserDisplayName(user.email || '')}
              </p>
              <p className="text-xs text-gray-300 truncate">
                {user.email}
              </p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-xs text-emerald-300 font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Section */}
      {user && (
        <div className="mx-6 mb-6">
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full justify-start text-left h-14 px-6 rounded-xl transition-all duration-300 text-red-300 hover:bg-red-500/15 hover:text-red-200 hover:shadow-lg border border-red-500/30 hover:border-red-400/50 hover:scale-[1.02] group"
          >
            <LogOutIcon className="mr-4 h-5 w-5 transition-transform group-hover:translate-x-1" />
            <span className="font-medium">Sign Out</span>
          </Button>
        </div>
      )}

      {/* Footer */}
    
    </div>
  )
}
