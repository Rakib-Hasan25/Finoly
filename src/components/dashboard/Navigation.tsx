'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  HomeIcon, 
  Gamepad2Icon, 
  GraduationCapIcon, 
  BarChart3Icon,
  BellIcon,
  SearchIcon,
  UserIcon
} from "lucide-react"

const navigationItems = [
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

export function Navigation() {
  const pathname = usePathname()

  return (
    <div className="flex items-center justify-between w-full p-4 bg-white/5 backdrop-blur-sm border-b border-white/10">
      {/* Left: Navigation Links */}
      <nav className="flex items-center space-x-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "px-4 py-2 rounded-lg transition-all duration-200 group",
                  pathname === item.href
                    ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                    : "text-gray-300 hover:bg-white/5 hover:text-white hover:shadow-lg"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 mr-2 transition-all duration-200",
                  pathname === item.href 
                    ? "text-emerald-400" 
                    : "text-gray-400 group-hover:text-white"
                )} />
                <span className="font-medium text-sm">{item.title}</span>
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center space-x-3">
        {/* Search */}
        <Button variant="ghost" size="sm" className="p-2 text-gray-400 hover:text-white hover:bg-white/5">
          <SearchIcon className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="p-2 text-gray-400 hover:text-white hover:bg-white/5 relative">
          <BellIcon className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
        </Button>

        {/* Profile */}
        <Button variant="ghost" size="sm" className="p-2 text-gray-400 hover:text-white hover:bg-white/5">
          <UserIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}