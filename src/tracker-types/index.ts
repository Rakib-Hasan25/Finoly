export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  type: 'income' | 'expense';
}

export interface Budget {
  category: string;
  amount: number;
  spent: number;
  month: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  completed: boolean;
}

export interface UserLevel {
  level: number;
  title: string;
  progress: number;
  requiredPoints: number;
  currentPoints: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface BankAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  accountNumber: string;
}

export interface Debt {
  id: string;
  name: string;
  amount: number;
  monthlyPayment: number;
  remainingMonths: number;
  interestRate: number;
}