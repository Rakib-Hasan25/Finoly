import { storage } from './storage';
import { ACHIEVEMENTS, USER_LEVELS } from './constants';
import { Achievement } from '@/types';

export const calculateUserLevel = (points: number) => {
  let currentLevel = 1;
  let progress = 0;
  
  for (let i = USER_LEVELS.length - 1; i >= 0; i--) {
    if (points >= USER_LEVELS[i].requiredPoints) {
      currentLevel = USER_LEVELS[i].level;
      const nextLevel = USER_LEVELS[i + 1];
      if (nextLevel) {
        progress = ((points - USER_LEVELS[i].requiredPoints) / 
                   (nextLevel.requiredPoints - USER_LEVELS[i].requiredPoints)) * 100;
      } else {
        progress = 100;
      }
      break;
    }
  }
  
  return {
    level: currentLevel,
    title: USER_LEVELS[currentLevel - 1].title,
    progress: Math.min(progress, 100),
    currentPoints: points,
    requiredPoints: USER_LEVELS[currentLevel] ? USER_LEVELS[currentLevel].requiredPoints : USER_LEVELS[USER_LEVELS.length - 1].requiredPoints
  };
};

export const addPoints = (points: number) => {
  const safePoints = Number.isFinite(points) ? points : 0;
  const currentLevel = storage.getUserLevel();
  const newPoints = currentLevel.points + safePoints;
  storage.saveUserLevel({ level: currentLevel.level, points: newPoints });
  return newPoints;
};

export const checkAchievements = () => {
  const transactions = storage.getTransactions();
  const budgets = storage.getBudgets();
  const savingsGoals = storage.getSavingsGoals();
  const debts = storage.getDebts();
  const currentAchievements = storage.getAchievements();
  const streak = storage.getUserStreak();
  
  const newAchievements: Achievement[] = [];
  
  // Check first expense achievement
  if (transactions.length > 0 && !currentAchievements.find(a => a.id === 'first-expense')) {
    newAchievements.push({
      ...ACHIEVEMENTS.find(a => a.id === 'first-expense')!,
      unlocked: true,
      unlockedAt: new Date().toISOString()
    });
  }
  
  // Check streak achievement
  if (streak >= 7 && !currentAchievements.find(a => a.id === 'week-streak')) {
    newAchievements.push({
      ...ACHIEVEMENTS.find(a => a.id === 'week-streak')!,
      unlocked: true,
      unlockedAt: new Date().toISOString()
    });
  }
  
  // Check budget achievement
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyBudgets = budgets.filter(b => b.month === currentMonth);
  const underBudget = monthlyBudgets.every(b => b.spent <= b.amount);
  if (monthlyBudgets.length > 0 && underBudget && !currentAchievements.find(a => a.id === 'budget-master')) {
    newAchievements.push({
      ...ACHIEVEMENTS.find(a => a.id === 'budget-master')!,
      unlocked: true,
      unlockedAt: new Date().toISOString()
    });
  }
  
  // Check savings achievement
  const completedGoals = savingsGoals.filter(g => g.completed);
  if (completedGoals.length > 0 && !currentAchievements.find(a => a.id === 'savings-hero')) {
    newAchievements.push({
      ...ACHIEVEMENTS.find(a => a.id === 'savings-hero')!,
      unlocked: true,
      unlockedAt: new Date().toISOString()
    });
  }
  
  // Check debt achievement
  const paidOffDebts = debts.filter(d => d.amount <= 0);
  if (paidOffDebts.length > 0 && !currentAchievements.find(a => a.id === 'debt-slayer')) {
    newAchievements.push({
      ...ACHIEVEMENTS.find(a => a.id === 'debt-slayer')!,
      unlocked: true,
      unlockedAt: new Date().toISOString()
    });
  }
  
  if (newAchievements.length > 0) {
    storage.saveAchievements([...currentAchievements, ...newAchievements]);
    return newAchievements;
  }
  
  return [];
};

export const updateStreak = () => {
  const lastLogin = storage.getLastLogin();
  const today = new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (!lastLogin) {
    storage.saveUserStreak(1);
    storage.saveLastLogin(today);
    return 1;
  }
  
  const lastLoginDate = new Date(lastLogin).toDateString();
  
  if (lastLoginDate === today) {
    return storage.getUserStreak();
  } else if (lastLoginDate === yesterday.toDateString()) {
    const newStreak = storage.getUserStreak() + 1;
    storage.saveUserStreak(newStreak);
    storage.saveLastLogin(today);
    return newStreak;
  } else {
    storage.saveUserStreak(1);
    storage.saveLastLogin(today);
    return 1;
  }
};