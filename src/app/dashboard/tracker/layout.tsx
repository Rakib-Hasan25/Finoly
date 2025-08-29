import './globals.css';
import { Navigation } from '@/components/dashboard/Navigation';

export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900">
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}