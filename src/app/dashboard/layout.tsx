import BaseBackground from "@/components/base/BaseBackground"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-[rgb(25,45,54)]">
      <BaseBackground />
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[rgb(25,45,54)]">
        {children}
      </main>
    </div>
  )
}
