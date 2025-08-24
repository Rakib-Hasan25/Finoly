import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/courses">
          <Card className="p-6 space-y-4 hover:bg-white/5 transition-colors bg-[rgb(35,55,64)] border-white/10 text-white cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Courses</h2>
            <p className="text-gray-400">Manage your economics courses</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
