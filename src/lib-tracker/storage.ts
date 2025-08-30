import {
  Transaction,
  Budget,
  SavingsGoal,
  BankAccount,
  Debt,
  Achievement,
} from "@/tracker-types";

const STORAGE_KEYS = {
  TRANSACTIONS: "finoly_transactions",
  BUDGETS: "finoly_budgets",
  SAVINGS_GOALS: "finoly_savings_goals",
  BANK_ACCOUNTS: "finoly_bank_accounts",
  DEBTS: "finoly_debts",
  USER_LEVEL: "finoly_user_level",
  ACHIEVEMENTS: "finoly_achievements",
  USER_STREAK: "finoly_user_streak",
  LAST_LOGIN: "finoly_last_login",
};

export const storage = {
  getTransactions: (): Transaction[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    try {
      const transactions = data ? JSON.parse(data) : [];
      return transactions.map((transaction: any) => ({
        ...transaction,
        amount: Number.isFinite(parseFloat(transaction.amount))
          ? parseFloat(transaction.amount)
          : 0,
        date: transaction.date || new Date().toISOString(),
        category: transaction.category || "Miscellaneous",
        type: transaction.type || "expense",
        description: transaction.description || "",
      }));
    } catch (error) {
      console.error("Error parsing transactions:", error);
      return [];
    }
  },

  saveTransactions: (transactions: Transaction[]) => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.TRANSACTIONS,
        JSON.stringify(transactions)
      );
    } catch (error) {
      console.error("Error saving transactions:", error);
    }
  },

  getBudgets: (): Budget[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    try {
      const budgets = data ? JSON.parse(data) : [];
      return budgets.map((budget: any) => ({
        ...budget,
        amount: Number.isFinite(parseFloat(budget.amount))
          ? parseFloat(budget.amount)
          : 0,
        spent: Number.isFinite(parseFloat(budget.spent))
          ? parseFloat(budget.spent)
          : 0,
      }));
    } catch (error) {
      console.error("Error parsing budgets:", error);
      return [];
    }
  },

  saveBudgets: (budgets: Budget[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    } catch (error) {
      console.error("Error saving budgets:", error);
    }
  },

  getSavingsGoals: (): SavingsGoal[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.SAVINGS_GOALS);
    try {
      const goals = data ? JSON.parse(data) : [];
      return goals.map((goal: any) => ({
        ...goal,
        targetAmount: Number.isFinite(parseFloat(goal.targetAmount))
          ? parseFloat(goal.targetAmount)
          : 0,
        currentAmount: Number.isFinite(parseFloat(goal.currentAmount))
          ? parseFloat(goal.currentAmount)
          : 0,
      }));
    } catch (error) {
      console.error("Error parsing savings goals:", error);
      return [];
    }
  },

  saveSavingsGoals: (goals: SavingsGoal[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify(goals));
    } catch (error) {
      console.error("Error saving savings goals:", error);
    }
  },

  getBankAccounts: (): BankAccount[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.BANK_ACCOUNTS);
    try {
      const accounts = data ? JSON.parse(data) : [];
      return accounts.map((account: any) => ({
        ...account,
        balance: Number.isFinite(parseFloat(account.balance))
          ? parseFloat(account.balance)
          : 0,
      }));
    } catch (error) {
      console.error("Error parsing bank accounts:", error);
      return [];
    }
  },

  saveBankAccounts: (accounts: BankAccount[]) => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.BANK_ACCOUNTS,
        JSON.stringify(accounts)
      );
    } catch (error) {
      console.error("Error saving bank accounts:", error);
    }
  },

  getDebts: (): Debt[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.DEBTS);
    try {
      const debts = data ? JSON.parse(data) : [];
      return debts.map((debt: any) => ({
        ...debt,
        amount: Number.isFinite(parseFloat(debt.amount))
          ? parseFloat(debt.amount)
          : 0,
        monthlyPayment: Number.isFinite(parseFloat(debt.monthlyPayment))
          ? parseFloat(debt.monthlyPayment)
          : 0,
        interestRate: Number.isFinite(parseFloat(debt.interestRate))
          ? parseFloat(debt.interestRate)
          : 0,
        remainingMonths: Number.isFinite(parseInt(debt.remainingMonths))
          ? parseInt(debt.remainingMonths)
          : 0,
      }));
    } catch (error) {
      console.error("Error parsing debts:", error);
      return [];
    }
  },

  saveDebts: (debts: Debt[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(debts));
    } catch (error) {
      console.error("Error saving debts:", error);
    }
  },

  getUserLevel: () => {
    if (typeof window === "undefined") return { level: 1, points: 0 };
    const data = localStorage.getItem(STORAGE_KEYS.USER_LEVEL);
    try {
      const levelData = data ? JSON.parse(data) : { level: 1, points: 0 };
      return {
        level: Number.isFinite(parseInt(levelData.level))
          ? parseInt(levelData.level)
          : 1,
        points: Number.isFinite(parseInt(levelData.points))
          ? parseInt(levelData.points)
          : 0,
      };
    } catch (error) {
      console.error("Error parsing user level:", error);
      return { level: 1, points: 0 };
    }
  },

  saveUserLevel: (levelData: { level: number; points: number }) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_LEVEL, JSON.stringify(levelData));
    } catch (error) {
      console.error("Error saving user level:", error);
    }
  },

  getAchievements: (): Achievement[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    try {
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error parsing achievements:", error);
      return [];
    }
  },

  saveAchievements: (achievements: Achievement[]) => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.ACHIEVEMENTS,
        JSON.stringify(achievements)
      );
    } catch (error) {
      console.error("Error saving achievements:", error);
    }
  },

  getUserStreak: () => {
    if (typeof window === "undefined") return 0;
    try {
      const streak = parseInt(
        localStorage.getItem(STORAGE_KEYS.USER_STREAK) || "0"
      );
      return Number.isFinite(streak) ? streak : 0;
    } catch (error) {
      console.error("Error parsing user streak:", error);
      return 0;
    }
  },

  saveUserStreak: (streak: number) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_STREAK, streak.toString());
    } catch (error) {
      console.error("Error saving user streak:", error);
    }
  },

  getLastLogin: () => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_LOGIN);
    } catch (error) {
      console.error("Error getting last login:", error);
      return null;
    }
  },

  saveLastLogin: (date: string) => {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_LOGIN, date);
    } catch (error) {
      console.error("Error saving last login:", error);
    }
  },
};
