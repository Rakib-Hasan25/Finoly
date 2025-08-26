export const EXPENSE_CATEGORIES = [
  'Foods & Drinks',
  'Transportation',
  'Rent',
  'Education & Courses',
  'Entertainment',
  'Shopping',
  'Medical Care',
  'Personal Care',
  'Gift & Donation',
  'Debt',
  'Miscellaneous'
];

export const INCOME_CATEGORIES = [
  'Salary & Business',
  'Investments',
  'Rental & Property',
  'Freelance & Part-Time Jobs',
  'Bonus & Incentives',
  'Miscellaneous'
];

export const USER_LEVELS = [
  { level: 1, title: 'Novice Saver', requiredPoints: 0 },
  { level: 2, title: 'Budget Beginner', requiredPoints: 100 },
  { level: 3, title: 'Expense Expert', requiredPoints: 250 },
  { level: 4, title: 'Savings Specialist', requiredPoints: 500 },
  { level: 5, title: 'Finance Guru', requiredPoints: 1000 }
];

export const ACHIEVEMENTS = [
  {
    id: 'first-expense',
    title: 'First Step',
    description: 'Log your first expense',
    icon: '👶'
  },
  {
    id: 'week-streak',
    title: 'Consistent Tracker',
    description: 'Log expenses for 7 days straight',
    icon: '🔥'
  },
  {
    id: 'budget-master',
    title: 'Budget Master',
    description: 'Stay under budget for a month',
    icon: '🎯'
  },
  {
    id: 'savings-hero',
    title: 'Savings Hero',
    description: 'Reach your first savings goal',
    icon: '🏆'
  },
  {
    id: 'debt-slayer',
    title: 'Debt Slayer',
    description: 'Pay off a debt completely',
    icon: '⚔️'
  }
];

export const PRIMARY_COLOR = 'rgb(87, 204, 2)';
export const DARK_BASE = 'rgb(25, 45, 54)';
export const SUCCESS_COLOR = 'rgb(34, 197, 94)';
export const WARNING_COLOR = 'rgb(251, 191, 36)';
export const ERROR_COLOR = 'rgb(239, 68, 68)';