import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Dashboard - Finoly",
  description: "Manage courses, levels, and cards",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[rgb(25,45,54)]">
      {/* Admin Sidebar */}
      <div className="w-64 bg-[rgb(25,45,54)] text-white p-6 space-y-6 border-r border-white/10">
        <Link href="/admin">
          <div className="text-xl font-bold">Finoly Admin</div>
        </Link>
        <nav className="space-y-4">
          <Link href="/admin/courses">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:text-white hover:bg-white/10"
            >
              Courses
            </Button>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-[rgb(25,45,54)] text-white overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
