import './globals.css';
import { Navigation } from '@/components/dashboard/Navigation';
import { FloatingChatButton } from '@/components/chat/FloatingChatButton';

export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900">
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      {/* Floating Chat Button - Available on all tracker routes */}
      <FloatingChatButton />
    </div>
  );
}