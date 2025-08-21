"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const sidebarItems = [
  {
    title: "Home",
    href: "/dashboard/home",
    icon: "🏠",
  },
  {
    title: "Gamified Learning",
    href: "/dashboard/gamified-learning",
    icon: "🎮",
  },
  {
    title: "Financial Coach",
    href: "/dashboard/financial-coach",
    icon: "💰",
  },
  {
    title: "Tracker",
    href: "/dashboard/tracker",
    icon: "📊",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-[rgb(25,45,54)] border-r border-[rgb(87,204,2)]/20">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[rgb(87,204,2)]">
          Finoly
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Financial Dashboard
        </p>
      </div>

      <Separator className="bg-[rgb(87,204,2)]/20" />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-left h-12 px-4",
                pathname === item.href
                  ? "bg-[rgb(87,204,2)] text-[rgb(25,45,54)] hover:bg-[rgb(87,204,2)]/90"
                  : "text-gray-300 hover:bg-[rgb(87,204,2)]/10 hover:text-[rgb(87,204,2)]"
              )}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.title}
            </Button>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[rgb(87,204,2)]/20">
        <div className="text-center text-sm text-gray-400">
          <p>© 2024 Finoly</p>
        </div>
      </div>
    </div>
  )
}
