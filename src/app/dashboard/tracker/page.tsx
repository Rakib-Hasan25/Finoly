'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Target, Trophy } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { LevelProgress } from '@/components/dashboard/LevelProgress';
import { FloatingCard } from '@/components/Tracker-ui/floating-card';
import { Badge } from '@/components/Tracker-ui/badge';
import { storage } from '@/lib-tracker/storage';
import { calculateUserLevel, updateStreak, checkAchievements } from '@/lib-tracker/gamification';
import { Transaction, Achievement } from '@/tracker-types';
import { ConfettiExplosion } from '@/components/Tracker-animations/ConfettiExplosion';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userLevel, setUserLevel] = useState({ 
    level: 1, 
    title: 'Novice Saver', 
    progress: 0, 
    currentPoints: 0, 
    requiredPoints: 100 
  });
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const loadData = () => {
      const savedTransactions = storage.getTransactions();
      const levelData = storage.getUserLevel();
      const calculatedLevel = calculateUserLevel(levelData.points);
      const currentStreak = updateStreak();
      const achievements = checkAchievements();

      setTransactions(savedTransactions);
      setUserLevel(calculatedLevel);
      setStreak(currentStreak);

      if (achievements.length > 0) {
        setNewAchievements(achievements);
        setShowConfetti(true);
      }
    };

    loadData();
  }, []);

  // Calculate stats
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyTransactions = transactions.filter(t => 
    t.date.startsWith(currentMonth)
  );
  
  const totalIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (Number.isFinite(t.amount) ? t.amount : 0), 0);
    
  const totalExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (Number.isFinite(t.amount) ? t.amount : 0), 0);
    
  const netWorth = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Welcome to Your Budget Journey
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Track, plan, and grow your wealth with intelligent insights and experiences.
        </p>
        
        {/* Streak Display */}
        <motion.div 
          className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-900/30 border border-orange-700/50 rounded-full backdrop-blur-sm"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xl">🔥</span>
          <span className="font-semibold text-orange-300">
            {streak} day{streak !== 1 ? 's' : ''} streak!
          </span>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Monthly Income"
          value={totalIncome}
          icon={TrendingUp}
          change={12.5}
          changeLabel="vs last month"
          color="rgb(74, 222, 128)" // green-400
          delay={0}
        />
        <StatsCard
          title="Monthly Expenses"
          value={totalExpenses}
          icon={TrendingDown}
          change={-8.2}
          changeLabel="vs last month"
          color="rgb(251, 113, 133)" // rose-400
          delay={0.1}
        />
        <StatsCard
          title="Net Worth"
          value={netWorth}
          icon={DollarSign}
          change={18.7}
          changeLabel="this month"
          color="rgb(96, 165, 250)" // blue-400
          delay={0.2}
        />
        <StatsCard
          title="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          icon={Target}
          change={5.3}
          changeLabel="improvement"
          color="rgb(192, 132, 252)" // violet-400
          delay={0.3}
        />
      </div>

      {/* Level and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Level Progress */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <LevelProgress userLevel={userLevel} />
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <FloatingCard className="h-full bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                <Badge variant="outline" className="text-xs bg-slate-700/50 text-gray-300 border-slate-600/50">
                  {recentTransactions.length} transactions
                </Badge>
              </div>
              
              <div className="space-y-3">
                {recentTransactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Start tracking to see your activity here!</p>
                  </div>
                ) : (
                  recentTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg hover:bg-slate-700/30 transition-colors border border-slate-600/30"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          transaction.type === 'income' 
                            ? 'bg-green-500' 
                            : 'bg-red-500'
                        }`} />
                        <div>
                          <p className="font-medium text-sm text-white">{transaction.category}</p>
                          <p className="text-xs text-gray-300">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`font-semibold ${
                        transaction.type === 'income' 
                          ? 'text-green-300' 
                          : 'text-red-300'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        ${Number.isFinite(transaction.amount) ? transaction.amount.toFixed(2) : '0.00'}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </FloatingCard>
        </motion.div>
      </div>

      {/* Achievement Notifications */}
      {newAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <FloatingCard className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 min-w-[300px]">
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8" />
              <div>
                <h4 className="font-bold">Achievement Unlocked!</h4>
                <p className="text-sm opacity-90">
                  {newAchievements[0].title} - {newAchievements[0].description}
                </p>
              </div>
            </div>
          </FloatingCard>
        </motion.div>
      )}

      {/* Confetti Animation */}
      <ConfettiExplosion 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
    </div>
  );
}