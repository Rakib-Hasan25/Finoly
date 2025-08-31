'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/Tracker-ui/avatar';
import {
  HomeIcon,
  Gamepad2Icon,
  GraduationCapIcon,
  BarChart3Icon,
  SparklesIcon,
  LogOutIcon,
  CrownIcon,
  ChevronRight,
  Receipt,
  TrendingUp,
  Target,
  Landmark,
  LayoutGridIcon, // Added new icon for Overview
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the main sidebar items
const sidebarItems = [
  {
    title: 'হোম',
    href: '/dashboard/home',
    icon: HomeIcon,
  },
  {
    title: 'গেমিফাইড শিক্ষা',
    href: '/dashboard/gamified-learning',
    icon: Gamepad2Icon,
  },
  {
    title: 'আর্থিক কোচ',
    href: '/dashboard/financial-coach',
    icon: GraduationCapIcon,
  },
  {
    title: 'ট্র্যাকার',
    href: '/dashboard/tracker',
    icon: BarChart3Icon,
    submenu: [
      // New 'Overview' item added here
      { href: '/dashboard/tracker', label: 'সারসংক্ষেপ', icon: LayoutGridIcon },
      { href: '/dashboard/tracker/spending', label: 'দৈনিক ব্যয়', icon: Receipt },
      { href: '/dashboard/tracker/income', label: 'মাসিক আয়', icon: TrendingUp },
      { href: '/dashboard/tracker/reports', label: 'রিপোর্ট', icon: BarChart3Icon },
      { href: '/dashboard/tracker/budget', label: 'বাজেট পরিকল্পনা', icon: Target },
      { href: '/dashboard/tracker/banking', label: 'ব্যাংকিং', icon: Landmark },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isTrackerHovered, setIsTrackerHovered] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'সফলভাবে সাইন আউট হয়েছে',
        description: 'আপনি আপনার অ্যাকাউন্ট থেকে লগ আউট হয়েছেন।',
      });
      router.push('/');
    } catch (error) {
      toast({
        title: 'সাইন আউটে ত্রুটি',
        description: 'আপনাকে সাইন আউট করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        variant: 'destructive',
      });
    }
  };

  const getUserInitials = (email: string) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };

  const getUserDisplayName = (email: string) => {
    if (!email) return 'User';
    const username = email.split('@')[0];
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  return (
    <div className="flex h-full w-72 flex-col bg-gradient-to-b from-white/10 via-white/5 to-white/10 backdrop-blur-xl border-r border-white/20 shadow-2xl">
      {/* Header with Logo */}
      <div className="p-6 border-b border-white/20 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10">
        <div className="flex items-center space-x-3">
          <Image src="/logo.png" alt="Finoly Logo" width={100} height={100} />
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Finoly
            </h1>
            <p className="text-sm text-gray-300 mt-1 font-medium">আর্থিক ড্যাশবোর্ড</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const hasSubmenu = !!item.submenu;

          return (
            <div
              key={item.title}
              onMouseEnter={() => hasSubmenu && setIsTrackerHovered(true)}
              onMouseLeave={() => hasSubmenu && setIsTrackerHovered(false)}
            >
              {/* Main menu item */}
              <Link href={item.href} passHref>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start text-left h-14 px-6 rounded-xl transition-all duration-300 group hover:scale-[1.02]',
                    isActive || (hasSubmenu && isTrackerHovered)
                      ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/20'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white hover:shadow-lg hover:border hover:border-white/20'
                  )}
                >
                  <Icon className={cn('mr-4 h-5 w-5 transition-all duration-300', isActive || (hasSubmenu && isTrackerHovered) ? 'text-emerald-300' : 'text-gray-400 group-hover:text-white')} />
                  <span className="font-medium">{item.title}</span>
                  {hasSubmenu && (
                    <motion.div
                      animate={{ rotate: isTrackerHovered ? 90 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-auto"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </motion.div>
                  )}
                </Button>
              </Link>

              {/* Submenu */}
              <AnimatePresence>
                {hasSubmenu && isTrackerHovered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 space-y-2 pl-8 overflow-hidden"
                  >
                    {item.submenu?.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const subIsActive = pathname === subItem.href;

                      return (
                        <Link key={subItem.href} href={subItem.href} passHref>
                          <Button
                            variant="ghost"
                            className={cn(
                              'w-full justify-start text-left h-12 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02]',
                              subIsActive ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/40' : 'text-gray-400 hover:bg-white/10 hover:text-white'
                            )}
                          >
                            <SubIcon className={cn('mr-4 h-4 w-4 transition-all duration-300', subIsActive ? 'text-emerald-300' : 'text-gray-400 hover:text-white')} />
                            <span className="text-sm font-medium">{subItem.label}</span>
                          </Button>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
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
              <p className="text-xs text-gray-300 truncate">{user.email}</p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-xs text-emerald-300 font-medium">অনলাইন</span>
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
            <span className="font-medium">সাইন আউট</span>
          </Button>
        </div>
      )}
      {/* Footer */}
    </div>
  );
}