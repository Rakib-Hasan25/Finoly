'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Trophy, 
  BookOpen, 
  MessageCircle, 
  Target,
  Star,
  Award,
  Calendar,
  Zap,
  Users,
  BarChart3
} from 'lucide-react';
import { storage } from '@/lib-tracker/storage';
import { calculateUserLevel } from '@/lib-tracker/gamification';
import { Transaction, Achievement } from '@/tracker-types';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'tracker' | 'learning' | 'coach';
  icon: React.ReactNode;
  color: string;
}

export default function DashboardHome() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userLevel, setUserLevel] = useState({ 
    level: 1, 
    title: 'নবীন সঞ্চয়কারী', 
    progress: 0, 
    currentPoints: 0, 
    requiredPoints: 100 
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [streak, setStreak] = useState(0);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const loadData = () => {
      const savedTransactions = storage.getTransactions();
      const levelData = storage.getUserLevel();
      const calculatedLevel = calculateUserLevel(levelData.points);
      const currentStreak = storage.getUserStreak();
      const userAchievements = storage.getAchievements();

      setTransactions(savedTransactions);
      setUserLevel(calculatedLevel);
      setStreak(currentStreak);
      setAchievements(userAchievements);

      // Generate recent activities
      const activities: ActivityItem[] = [];
      
      // Add recent transactions
      const recentTransactions = savedTransactions.slice(0, 3);
      recentTransactions.forEach((transaction, index) => {
        activities.push({
          id: `transaction-${index}`,
          title: transaction.type === 'income' ? 'আয় যোগ হয়েছে' : 'ব্যয় যোগ হয়েছে',
          description: transaction.description || transaction.category,
          time: getTimeAgo(transaction.date),
          type: 'tracker',
          icon: transaction.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />,
          color: transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
        });
      });

      // Add learning activities
      if (calculatedLevel.level > 1) {
        activities.push({
          id: 'level-up',
          title: 'লেভেল আপ!',
          description: `লেভেল ${calculatedLevel.level} এ পৌঁছেছেন`,
          time: 'আজ',
          type: 'learning',
          icon: <Trophy className="w-5 h-5" />,
          color: 'text-yellow-400'
        });
      }

      // Add streak activities
      if (currentStreak > 0) {
        activities.push({
          id: 'streak',
          title: 'স্ট্রিক চলছে!',
          description: `${currentStreak} দিন ধরে সক্রিয়`,
          time: 'আজ',
          type: 'learning',
          icon: <Zap className="w-5 h-5" />,
          color: 'text-blue-400'
        });
      }

      // Add achievement activities
      const recentAchievements = userAchievements.slice(0, 2);
      recentAchievements.forEach((achievement, index) => {
        activities.push({
          id: `achievement-${index}`,
          title: 'অর্জন আনলক!',
          description: achievement.title,
          time: getTimeAgo(achievement.unlockedAt || new Date().toISOString()),
          type: 'learning',
          icon: <Award className="w-5 h-5" />,
          color: 'text-purple-400'
        });
      });

      // Add financial coach activities
      activities.push({
        id: 'coach-chat',
        title: 'আর্থিক পরামর্শ',
        description: 'আপনার আর্থিক লক্ষ্য নিয়ে আলোচনা করুন',
        time: 'গতকাল',
        type: 'coach',
        icon: <MessageCircle className="w-5 h-5" />,
        color: 'text-cyan-400'
      });

      setRecentActivities(activities.slice(0, 6));
    };

    loadData();
  }, []);

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'কয়েক মিনিট আগে';
    if (diffInHours < 24) return `${diffInHours} ঘন্টা আগে`;
    if (diffInHours < 48) return 'গতকাল';
    return `${Math.floor(diffInHours / 24)} দিন আগে`;
  };

  const calculateMonthlyStats = () => {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const monthlyTransactions = transactions.filter(t => 
      t.date.startsWith(currentMonth)
    );
    
    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (Number.isFinite(t.amount) ? t.amount : 0), 0);
      
    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (Number.isFinite(t.amount) ? t.amount : 0), 0);
      
    const netWorth = income - expenses;
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    return { income, expenses, netWorth, savingsRate };
  };

  const stats = calculateMonthlyStats();

  return (
    <div className="p-6 bg-[rgb(25,45,54)] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header with Animation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-[rgb(87,204,2)] mb-3 bg-gradient-to-r from-[rgb(87,204,2)] to-green-400 bg-clip-text text-transparent">
            আপনার ড্যাশবোর্ডে স্বাগতম
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto">
            আপনার আর্থিক অগ্রগতি ট্র্যাক করুন, নতুন দক্ষতা শিখুন এবং আপনার লক্ষ্যগুলি অর্জন করুন
          </p>
        </motion.div>

        {/* Enhanced Quick Stats with Icons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-gradient-to-br from-[rgb(25,45,54)] to-[rgb(35,55,64)] border border-[rgb(87,204,2)]/30 rounded-xl p-6 hover:border-[rgb(87,204,2)]/60 hover:shadow-lg hover:shadow-[rgb(87,204,2)]/20 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-[rgb(87,204,2)]">মোট ব্যালেন্স</h3>
              <div className="p-2 bg-[rgb(87,204,2)]/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-[rgb(87,204,2)]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">${stats.netWorth.toLocaleString()}</p>
            <p className="text-gray-400 text-sm mt-1">নেট মূল্য</p>
          </div>

          <div className="bg-gradient-to-br from-[rgb(25,45,54)] to-[rgb(35,55,64)] border border-[rgb(87,204,2)]/30 rounded-xl p-6 hover:border-[rgb(87,204,2)]/60 hover:shadow-lg hover:shadow-[rgb(87,204,2)]/20 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-[rgb(87,204,2)]">মাসিক আয়</h3>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">${stats.income.toLocaleString()}</p>
            <p className="text-gray-400 text-sm mt-1">এই মাসে</p>
          </div>

          <div className="bg-gradient-to-br from-[rgb(25,45,54)] to-[rgb(35,55,64)] border border-[rgb(87,204,2)]/30 rounded-xl p-6 hover:border-[rgb(87,204,2)]/60 hover:shadow-lg hover:shadow-[rgb(87,204,2)]/20 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-[rgb(87,204,2)]">মাসিক ব্যয়</h3>
              <div className="p-2 bg-red-500/20 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">${stats.expenses.toLocaleString()}</p>
            <p className="text-gray-400 text-sm mt-1">এই মাসে</p>
          </div>

          <div className="bg-gradient-to-br from-[rgb(25,45,54)] to-[rgb(35,55,64)] border border-[rgb(87,204,2)]/30 rounded-xl p-6 hover:border-[rgb(87,204,2)]/60 hover:shadow-lg hover:shadow-[rgb(87,204,2)]/20 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-[rgb(87,204,2)]">সঞ্চয়ের হার</h3>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stats.savingsRate.toFixed(1)}%</p>
            <p className="text-gray-400 text-sm mt-1">লক্ষ্য অর্জন</p>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Recent Activities */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-[rgb(25,45,54)] to-[rgb(35,55,64)] border border-[rgb(87,204,2)]/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-[rgb(87,204,2)] flex items-center gap-2">
                  <Zap className="w-6 h-6" />
                  সাম্প্রতিক কার্যক্রম
                </h3>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-[rgb(87,204,2)]/20 text-[rgb(87,204,2)] rounded-full text-sm font-medium">
                    {recentActivities.length} কার্যক্রম
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 bg-[rgb(25,45,54)]/50 border border-[rgb(87,204,2)]/20 rounded-lg hover:border-[rgb(87,204,2)]/40 hover:bg-[rgb(25,45,54)]/70 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${activity.color.replace('text-', 'bg-')}/20`}>
                          {activity.icon}
                        </div>
                        <div>
                          <p className="text-white font-medium">{activity.title}</p>
                          <p className="text-gray-400 text-sm">{activity.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400 text-sm">{activity.time}</span>
                        <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                          activity.type === 'tracker' ? 'bg-blue-500/20 text-blue-400' :
                          activity.type === 'learning' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-cyan-500/20 text-cyan-400'
                        }`}>
                          {activity.type === 'tracker' ? 'ট্র্যাকার' :
                           activity.type === 'learning' ? 'শিক্ষা' : 'কোচ'}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>কোন কার্যক্রম নেই</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Right Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6"
          >
            {/* Enhanced Quick Actions */}
            <div className="bg-gradient-to-br from-[rgb(25,45,54)] to-[rgb(35,55,64)] border border-[rgb(87,204,2)]/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-[rgb(87,204,2)] mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                দ্রুত কাজ
              </h3>
              <div className="space-y-3">
                <a href="/dashboard/tracker/spending" className="block w-full p-3 bg-gradient-to-r from-[rgb(87,204,2)] to-green-500 text-[rgb(25,45,54)] rounded-lg font-medium hover:from-[rgb(87,204,2)]/90 hover:to-green-400 transition-all duration-200 text-center transform hover:scale-105">
                  লেনদেন যোগ করুন
                </a>
                <a href="/dashboard/tracker/budget" className="block w-full p-3 border border-[rgb(87,204,2)]/40 text-[rgb(87,204,2)] rounded-lg font-medium hover:bg-[rgb(87,204,2)]/10 hover:border-[rgb(87,204,2)]/60 transition-all duration-200 text-center">
                  বাজেট নির্ধারণ করুন
                </a>
                <a href="/dashboard/gamified-learning" className="block w-full p-3 border border-[rgb(87,204,2)]/40 text-[rgb(87,204,2)] rounded-lg font-medium hover:bg-[rgb(87,204,2)]/10 hover:border-[rgb(87,204,2)]/60 transition-all duration-200 text-center">
                  শিক্ষার কেন্দ্র
                </a>
                <a href="/dashboard/financial-coach" className="block w-full p-3 border border-[rgb(87,204,2)]/40 text-[rgb(87,204,2)] rounded-lg font-medium hover:bg-[rgb(87,204,2)]/10 hover:border-[rgb(87,204,2)]/60 transition-all duration-200 text-center">
                  আর্থিক পরামর্শ
                </a>
              </div>
            </div>

            {/* Enhanced Learning Progress */}
            <div className="bg-gradient-to-br from-[rgb(25,45,54)] to-[rgb(35,55,64)] border border-[rgb(87,204,2)]/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-[rgb(87,204,2)] mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                শিক্ষার অগ্রগতি
              </h3>
              <div className="text-center mb-6">
                <div className="relative w-20 h-20 bg-gradient-to-br from-[rgb(87,204,2)]/20 to-green-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl font-bold text-[rgb(87,204,2)]">{userLevel.level}</span>
                  <div className="absolute inset-0 border-4 border-[rgb(87,204,2)]/30 rounded-full"></div>
                </div>
                <p className="text-white font-medium text-lg">{userLevel.title}</p>
                <p className="text-gray-400 text-sm">{userLevel.currentPoints} পয়েন্ট</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">লেভেল অগ্রগতি</span>
                  <span className="text-white font-medium">{userLevel.progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${userLevel.progress}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="bg-gradient-to-r from-[rgb(87,204,2)] to-green-400 h-3 rounded-full"
                  />
                </div>
                <div className="text-center text-xs text-gray-400">
                  পরবর্তী লেভেল: {userLevel.requiredPoints - userLevel.currentPoints} পয়েন্ট প্রয়োজন
                </div>
              </div>
            </div>

            {/* Enhanced Streak & Achievements */}
            <div className="bg-gradient-to-br from-[rgb(25,45,54)] to-[rgb(35,55,64)] border border-[rgb(87,204,2)]/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-[rgb(87,204,2)] mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                অর্জন ও স্ট্রিক
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[rgb(25,45,54)]/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <Zap className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">বর্তমান স্ট্রিক</p>
                      <p className="text-gray-400 text-sm">{streak} দিন</p>
                    </div>
                  </div>
                  <span className="text-orange-400 font-bold text-xl">{streak}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[rgb(25,45,54)]/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Award className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">মোট অর্জন</p>
                      <p className="text-gray-400 text-sm">আনলক করা</p>
                    </div>
                  </div>
                  <span className="text-purple-400 font-bold text-xl">{achievements.length}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section - Additional Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-[rgb(25,45,54)] to-[rgb(35,55,64)] border border-[rgb(87,204,2)]/30 rounded-xl p-6 text-center">
            <div className="p-3 bg-blue-500/20 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">সাম্প্রতিক লেনদেন</h4>
            <p className="text-3xl font-bold text-[rgb(87,204,2)]">{transactions.length}</p>
            <p className="text-gray-400 text-sm">মোট লেনদেন</p>
          </div>

          <div className="bg-gradient-to-br from-[rgb(25,45,54)] to-[rgb(35,55,64)] border border-[rgb(87,204,2)]/30 rounded-xl p-6 text-center">
            <div className="p-3 bg-green-500/20 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-green-400" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">এই মাসের লক্ষ্য</h4>
            <p className="text-3xl font-bold text-[rgb(87,204,2)]">{stats.savingsRate > 0 ? '✓' : '○'}</p>
            <p className="text-gray-400 text-sm">{stats.savingsRate > 0 ? 'লক্ষ্য অর্জিত' : 'লক্ষ্য নির্ধারণ করুন'}</p>
          </div>

          <div className="bg-gradient-to-br from-[rgb(25,45,54)] to-[rgb(35,55,64)] border border-[rgb(87,204,2)]/30 rounded-xl p-6 text-center">
            <div className="p-3 bg-purple-500/20 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Star className="w-8 h-8 text-purple-400" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">মোট পয়েন্ট</h4>
            <p className="text-3xl font-bold text-[rgb(87,204,2)]">{userLevel.currentPoints}</p>
            <p className="text-gray-400 text-sm">অর্জিত পয়েন্ট</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
