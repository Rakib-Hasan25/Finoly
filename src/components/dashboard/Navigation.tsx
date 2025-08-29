'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  PiggyBank, 
  Receipt, 
  TrendingUp, 
  BarChart3, 
  Target, 
  Landmark,
  User,
  Trophy,
  // Home // Uncomment if adding /dashboard/home
} from 'lucide-react';
import { Badge } from '@/components/Tracker-ui/badge';
import { storage } from '@/lib-tracker/storage';
import { calculateUserLevel } from '@/lib-tracker/gamification';
import { useEffect, useState } from 'react';

// Define TypeScript interface for navItems
interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: PiggyBank },
  { href: '/dashboard/tracker/spending', label: 'Daily Spending', icon: Receipt },
  { href: '/dashboard/tracker/income', label: 'Monthly Income', icon: TrendingUp },
  { href: '/dashboard/tracker/reports', label: 'Reports', icon: BarChart3 },
  { href: '/dashboard/tracker/budget', label: 'Budget Planning', icon: Target },
  { href: '/dashboard/tracker/banking', label: 'Banking', icon: Landmark },
  // Optional: Uncomment to include additional dashboard routes
  // { href: '/dashboard/financial-coach', label: 'Financial Coach', icon: User },
  // { href: '/dashboard/gamified-learning', label: 'Gamified Learning', icon: Trophy },
  // { href: '/dashboard/home', label: 'Home', icon: Home },
];

export function Navigation() {
  const pathname = usePathname();
  const [userLevel, setUserLevel] = useState({ level: 1, title: 'Novice Saver' });
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const levelData = storage.getUserLevel();
      const calculatedLevel = calculateUserLevel(levelData.points);
      setUserLevel(calculatedLevel);
      setStreak(storage.getUserStreak());
    }
  }, []);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard/tracker" className="flex items-center space-x-2" aria-label="Finoly Home">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 bg-gradient-to-br from-green-400 to-green-600 rounded-lg"
            >
              <PiggyBank className="h-6 w-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Finoly
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <motion.div
                  key={item.href}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Link
                    href={item.href}
                    className={`relative px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                      isActive
                        ? 'bg-green-50 text-green-600 shadow-md'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                        layoutId="activeNav"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* User Stats */}
          <div className="flex items-center space-x-4">
            {/* Streak Counter */}
            <motion.div 
              className="flex items-center space-x-1 px-3 py-1 bg-orange-50 rounded-full"
              whileHover={{ scale: 1.05 }}
              aria-label={`Streak: ${streak} days`}
            >
              <span className="text-sm">🔥</span>
              <span className="text-sm font-semibold text-orange-600">{streak}</span>
            </motion.div>

            {/* Level Badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 px-3 py-1 bg-purple-50 rounded-full"
              aria-label={`Level: ${userLevel.title}`}
            >
              <Trophy className="h-4 w-4 text-purple-600" />
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                {userLevel.title}
              </Badge>
            </motion.div>

            {/* Profile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="User Profile"
            >
              <User className="h-5 w-5 text-gray-600" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex overflow-x-auto pb-2 px-4 space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-shrink-0 flex flex-col items-center p-2 rounded-lg min-w-[80px] ${
                  isActive
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}