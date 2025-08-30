'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { FloatingCard } from '@/components/Tracker-ui/floating-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Tracker-ui/card';
import { Button } from '@/components/Tracker-ui/button';
import { Input } from '@/components/Tracker-ui/input';
import { Label } from '@/components/Tracker-ui/label';
import { Badge } from '@/components/Tracker-ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Tracker-ui/select';
import { ProgressLiquid } from '@/components/Tracker-animations/ProgressLiquid';
import { ConfettiExplosion } from '@/components/Tracker-animations/ConfettiExplosion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/Tracker-ui/dialog';
import { storage } from '@/lib-tracker/storage';
import { addPoints } from '@/lib-tracker/gamification';
import { EXPENSE_CATEGORIES } from '@/lib-tracker/constants';
import { Budget, SavingsGoal, Debt } from '@/tracker-types';

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showDebtForm, setShowDebtForm] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Form states
  const [budgetCategory, setBudgetCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [goalTitle, setGoalTitle] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [goalDate, setGoalDate] = useState('');
  const [debtName, setDebtName] = useState('');
  const [debtAmount, setDebtAmount] = useState('');
  const [debtPayment, setDebtPayment] = useState('');
  const [debtRate, setDebtRate] = useState('');

  // Per-goal custom amount inputs
  const [goalCustomAmounts, setGoalCustomAmounts] = useState<Record<string, string>>({});
  
  // Per-debt payment amounts
  const [debtPaymentAmounts, setDebtPaymentAmounts] = useState<Record<string, string>>({});

  // Shake animation flags for goal creation form
  const [shakeFields, setShakeFields] = useState<{ title: boolean; amount: boolean; date: boolean }>({
    title: false,
    amount: false,
    date: false,
  });

  // New shake flags for budget and debt forms
  const [shakeBudgetFields, setShakeBudgetFields] = useState<{ category: boolean; amount: boolean }>({
    category: false,
    amount: false,
  });

  const [shakeDebtFields, setShakeDebtFields] = useState<{ name: boolean; amount: boolean; payment: boolean }>({
    name: false,
    amount: false,
    payment: false,
  });

  // Refs for focusing after validation
  const titleRef = useRef<HTMLInputElement | null>(null);
  const amountRef = useRef<HTMLInputElement | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);

  const budgetAmountRef = useRef<HTMLInputElement | null>(null);
  const budgetCategoryWrapperRef = useRef<HTMLDivElement | null>(null);

  const debtNameRef = useRef<HTMLInputElement | null>(null);
  const debtAmountRef = useRef<HTMLInputElement | null>(null);
  const debtPaymentRef = useRef<HTMLInputElement | null>(null);

  // Function to calculate spent amounts for budgets
  const calculateSpentAmounts = (budgetsToUpdate: Budget[], targetMonth?: string) => {
    const month = targetMonth || selectedMonth;
    const transactions = storage.getTransactions();
    const monthlyExpenses = transactions.filter((t: any) => 
      t.type === 'expense' && t.date.startsWith(month)
    );

    return budgetsToUpdate.map((budget) => {
      if (budget.month === month) {
        const spent = monthlyExpenses
          .filter((t: any) => t.category === budget.category)
          .reduce((sum: number, t: any) => sum + t.amount, 0);

        return { ...budget, spent };
      }
      return budget;
    });
  };

  useEffect(() => {
    const loadData = () => {
      const loadedBudgets = storage.getBudgets();
      const budgetsWithSpent = calculateSpentAmounts(loadedBudgets);
      setBudgets(budgetsWithSpent);
      setSavingsGoals(storage.getSavingsGoals());
      setDebts(storage.getDebts());
    };

    loadData();
  }, [selectedMonth]);

  // Update spent amounts when transactions change
  useEffect(() => {
    const budgetsWithSpent = calculateSpentAmounts(budgets);
    if (JSON.stringify(budgetsWithSpent) !== JSON.stringify(budgets)) {
      setBudgets(budgetsWithSpent);
      storage.saveBudgets(budgetsWithSpent);
    }
  }, [selectedMonth]);

  const handleAddBudget = () => {
    // Validate required fields; shake missing ones and focus first missing
    const missing = {
      category: !budgetCategory.trim(),
      amount: !budgetAmount.trim(),
    };

    if (missing.category || missing.amount) {
      setShakeBudgetFields({ category: missing.category, amount: missing.amount });

      // Focus first missing
      if (missing.category) {
        budgetCategoryWrapperRef.current?.focus();
      } else if (missing.amount) {
        budgetAmountRef.current?.focus();
      }

      // Clear shake after short time
      setTimeout(() => setShakeBudgetFields({ category: false, amount: false }), 600);
      return;
    }

    // parse amount safely
    const parsedAmount = parseFloat(budgetAmount);
    if (!isFinite(parsedAmount) || parsedAmount < 0) {
      setShakeBudgetFields({ category: false, amount: true });
      budgetAmountRef.current?.focus();
      setTimeout(() => setShakeBudgetFields({ category: false, amount: false }), 600);
      return;
    }

    const newBudget: Budget = {
      category: budgetCategory,
      amount: parsedAmount,
      spent: 0,
      month: selectedMonth,
    };

    // Find if budget exists for this category and month
    const existingBudgetIndex = budgets.findIndex((b) => b.category === budgetCategory && b.month === selectedMonth);

    let updatedBudgets;
    if (existingBudgetIndex >= 0) {
      // Update existing budget
      updatedBudgets = [...budgets];
      updatedBudgets[existingBudgetIndex] = newBudget;
    } else {
      // Add new budget
      updatedBudgets = [...budgets, newBudget];
    }

    // Calculate spent amounts for the updated budgets
    const budgetsWithSpent = calculateSpentAmounts(updatedBudgets);
    
    setBudgets(budgetsWithSpent);
    storage.saveBudgets(budgetsWithSpent);

    setBudgetCategory('');
    setBudgetAmount('');
    setShowBudgetForm(false);
    addPoints(5);
  };

  const handleDeleteBudget = (category: string, month: string) => {
    const updatedBudgets = budgets.filter((b) => !(b.category === category && b.month === month));
    setBudgets(updatedBudgets);
    storage.saveBudgets(updatedBudgets);
  };

  const handleAddSavingsGoal = () => {
    // Validate required fields; shake missing ones and focus first missing
    const missing = {
      title: !goalTitle.trim(),
      amount: !goalAmount.trim(),
      date: !goalDate.trim(),
    };

    if (missing.title || missing.amount || missing.date) {
      setShakeFields({ title: missing.title, amount: missing.amount, date: missing.date });
      // Focus first missing
      if (missing.title) titleRef.current?.focus();
      else if (missing.amount) amountRef.current?.focus();
      else if (missing.date) dateRef.current?.focus();
      // Remove shake after a moment
      setTimeout(() => setShakeFields({ title: false, amount: false, date: false }), 600);
      return;
    }

    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      title: goalTitle.trim(),
      targetAmount: Math.max(0, parseFloat(goalAmount)),
      currentAmount: 0,
      targetDate: goalDate,
      completed: false,
    };

    const updatedGoals = [...savingsGoals, newGoal];
    setSavingsGoals(updatedGoals);
    storage.saveSavingsGoals(updatedGoals);

    setGoalTitle('');
    setGoalAmount('');
    setGoalDate('');
    setShowGoalForm(false);
    addPoints(10);
  };

  const handleDeleteGoal = (goalId: string) => {
    const updated = savingsGoals.filter((g) => g.id !== goalId);
    setSavingsGoals(updated);
    storage.saveSavingsGoals(updated);
  };

  const handleAddDebt = () => {
    // Validate required fields; shake missing ones and focus first missing
    const missing = {
      name: !debtName.trim(),
      amount: !debtAmount.trim(),
      payment: !debtPayment.trim(),
    };

    if (missing.name || missing.amount || missing.payment) {
      setShakeDebtFields({ name: missing.name, amount: missing.amount, payment: missing.payment });
      // Focus first missing
      if (missing.name) debtNameRef.current?.focus();
      else if (missing.amount) debtAmountRef.current?.focus();
      else if (missing.payment) debtPaymentRef.current?.focus();

      setTimeout(() => setShakeDebtFields({ name: false, amount: false, payment: false }), 600);
      return;
    }

    // Parse numbers and validate
    const parsedAmount = parseFloat(debtAmount);
    const parsedPayment = parseFloat(debtPayment);
    const parsedRate = parseFloat(debtRate || '0');

    if (!isFinite(parsedAmount) || parsedAmount <= 0) {
      setShakeDebtFields((s) => ({ ...s, amount: true }));
      debtAmountRef.current?.focus();
      setTimeout(() => setShakeDebtFields((s) => ({ ...s, amount: false })), 600);
      return;
    }

    if (!isFinite(parsedPayment) || parsedPayment <= 0) {
      setShakeDebtFields((s) => ({ ...s, payment: true }));
      debtPaymentRef.current?.focus();
      setTimeout(() => setShakeDebtFields((s) => ({ ...s, payment: false })), 600);
      return;
    }

    const newDebt: Debt = {
      id: Date.now().toString(),
      name: debtName.trim(),
      amount: parsedAmount,
      originalAmount: parsedAmount,
      monthlyPayment: parsedPayment,
      remainingMonths: Math.ceil(parsedAmount / parsedPayment),
      interestRate: isFinite(parsedRate) ? parsedRate : 0,
    };

    const updatedDebts = [...debts, newDebt];
    setDebts(updatedDebts);
    storage.saveDebts(updatedDebts);

    setDebtName('');
    setDebtAmount('');
    setDebtPayment('');
    setDebtRate('');
    setShowDebtForm(false);
    addPoints(5);
  };

  const handleDebtPayment = (debtId: string) => {
    const paymentAmount = parseFloat(debtPaymentAmounts[debtId] || '0');
    if (!isFinite(paymentAmount) || paymentAmount <= 0) return;

    const updatedDebts = debts.map((debt) => {
      if (debt.id === debtId) {
        const newAmount = Math.max(0, debt.amount - paymentAmount);
        const newRemainingMonths = newAmount > 0 ? Math.ceil(newAmount / debt.monthlyPayment) : 0;
        
        // Show confetti if debt is paid off
        if (newAmount === 0 && debt.amount > 0) {
          setShowConfetti(true);
          addPoints(100); // Big reward for paying off debt
        }
        
        return {
          ...debt,
          amount: newAmount,
          remainingMonths: newRemainingMonths,
        };
      }
      return debt;
    });

    setDebts(updatedDebts);
    storage.saveDebts(updatedDebts);
    
    // Clear the payment input
    setDebtPaymentAmounts((prev) => ({ ...prev, [debtId]: '' }));
    
    // Award points for making payment
    addPoints(10);
  };

  const handleDeleteDebt = (debtId: string) => {
    const updated = debts.filter((d) => d.id !== debtId);
    setDebts(updated);
    storage.saveDebts(updated);
  };

  const handleDebtPaymentChange = (debtId: string, value: string) => {
    setDebtPaymentAmounts((prev) => ({ ...prev, [debtId]: value }));
  };

  const updateGoalAmount = (goalId: string, delta: number) => {
    const updatedGoals = savingsGoals.map((goal) => {
      if (goal.id === goalId) {
        const previousCompleted = goal.completed;
        const newAmountRaw = goal.currentAmount + delta;
        const newAmount = Math.max(0, Math.min(newAmountRaw, goal.targetAmount)); // clamp 0..target
        const completed = newAmount >= goal.targetAmount;
        if (completed && !previousCompleted) {
          setShowConfetti(true);
          addPoints(50);
        }
        return { ...goal, currentAmount: newAmount, completed };
      }
      return goal;
    });

    setSavingsGoals(updatedGoals);
    storage.saveSavingsGoals(updatedGoals);
  };

  const handleGoalCustomChange = (goalId: string, value: string) => {
    setGoalCustomAmounts((prev) => ({ ...prev, [goalId]: value }));
  };

  const handleGoalCustomApply = (goalId: string, mode: 'add' | 'withdraw') => {
    const raw = goalCustomAmounts[goalId];
    if (!raw) return;
    const amt = parseFloat(raw);
    if (!isFinite(amt) || amt <= 0) return;
    const delta = mode === 'add' ? amt : -amt;
    updateGoalAmount(goalId, delta);
    setGoalCustomAmounts((prev) => ({ ...prev, [goalId]: '' }));
  };

  // Function to refresh spent amounts when transactions change
  const refreshSpentAmounts = () => {
    const transactions = storage.getTransactions();
    const monthlyExpenses = transactions.filter((t: any) => 
      t.type === 'expense' && t.date.startsWith(selectedMonth)
    );

    const updatedBudgets = budgets.map((budget) => {
      if (budget.month === selectedMonth) {
        const spent = monthlyExpenses
          .filter((t: any) => t.category === budget.category)
          .reduce((sum: number, t: any) => sum + t.amount, 0);

        return { ...budget, spent };
      }
      return budget;
    });

    if (JSON.stringify(updatedBudgets) !== JSON.stringify(budgets)) {
      setBudgets(updatedBudgets);
      storage.saveBudgets(updatedBudgets);
    }
  };

  // Load data and calculate spent amounts
  useEffect(() => {
    const loadedBudgets = storage.getBudgets();
    const transactions = storage.getTransactions();
    const monthlyExpenses = transactions.filter((t: any) => 
      t.type === 'expense' && t.date.startsWith(selectedMonth)
    );

    // Calculate spent amounts for all budgets
    const budgetsWithSpent = loadedBudgets.map((budget) => {
      if (budget.month === selectedMonth) {
        const spent = monthlyExpenses
          .filter((t: any) => t.category === budget.category)
          .reduce((sum: number, t: any) => sum + t.amount, 0);

        return { ...budget, spent };
      }
      return budget;
    });

    setBudgets(budgetsWithSpent);
    setSavingsGoals(storage.getSavingsGoals());
    setDebts(storage.getDebts());
  }, [selectedMonth]);

  // Periodically refresh spent amounts to catch transaction updates
  useEffect(() => {
    const interval = setInterval(refreshSpentAmounts, 2000);
    return () => clearInterval(interval);
  }, [budgets, selectedMonth]);

  const currentBudgets = budgets.filter((b) => b.month === selectedMonth);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Budget Planning</h1>
        <p className="text-gray-300">Plan your spending, set savings goals, and manage debt</p>

        <div className="flex items-center justify-center">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() + i);
                const monthValue = date.toISOString().slice(0, 7);
                const monthLabel = date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                });
                return (
                  <SelectItem key={monthValue} value={monthValue}>
                    {monthLabel}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Budgets */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Monthly Budgets</h2>
            <Dialog open={showBudgetForm} onOpenChange={setShowBudgetForm}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Budget
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">Add Budget Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <motion.div
                    animate={shakeBudgetFields.category ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
                    transition={{ duration: 0.45 }}
                    tabIndex={-1}
                    ref={budgetCategoryWrapperRef}
                  >
                    <Label className="text-gray-300">Category <span className="text-red-500">*</span></Label>
                    <Select value={budgetCategory} onValueChange={setBudgetCategory}>
                      <SelectTrigger
                        className={`bg-slate-700 border-slate-600 text-white ${shakeBudgetFields.category ? 'ring-2 ring-red-500 border-red-500' : ''
                          }`}
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        {EXPENSE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div
                    animate={shakeBudgetFields.amount ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
                    transition={{ duration: 0.45 }}
                  >
                    <Label className="text-gray-300">Monthly Budget ($) <span className="text-red-500">*</span></Label>
                    <Input
                      ref={budgetAmountRef}
                      className={`bg-slate-700 border-slate-600 text-white placeholder-gray-400 ${shakeBudgetFields.amount ? 'ring-2 ring-red-500 border-red-500' : ''
                        }`}
                      type="text"
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(e.target.value)}
                      placeholder="0.00"
                      aria-required={true}
                    />
                  </motion.div>
                  <Button onClick={handleAddBudget} className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700">
                    Add Budget
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {currentBudgets.length === 0 ? (
              <FloatingCard className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <div className="text-center py-12">
                  <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-medium text-white mb-2">No budgets set for this month</h3>
                  <p className="text-gray-300">Create budgets to track your spending and stay on target.</p>
                </div>
              </FloatingCard>
            ) : (
              currentBudgets.map((budget, index) => {
                const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
                const isOverBudget = percentage > 100;
                const isWarning = percentage > 80 && percentage <= 100;

                return (
                  <motion.div key={`${budget.category}-${budget.month}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <FloatingCard
                      className={`bg-slate-800/50 border-slate-700/50 backdrop-blur-sm ${isOverBudget ? 'ring-2 ring-red-700' : isWarning ? 'ring-2 ring-orange-700' : ''
                        }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-white">{budget.category}</CardTitle>
                          <div className="flex items-center space-x-2">
                            {isOverBudget ? (
                              <Badge variant="destructive" className="bg-red-900/30 text-red-300 border-red-700/50 animate-pulse">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Over Budget
                              </Badge>
                            ) : isWarning ? (
                              <Badge variant="secondary" className="bg-orange-900/30 text-orange-300 border-orange-700/50">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Warning
                              </Badge>
                            ) : (
                              <Badge variant="default" className="bg-green-900/30 text-green-300 border-green-700/50">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                On Track
                              </Badge>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-300 hover:text-red-200 hover:bg-red-900/20"
                              onClick={() => {
                                if (confirm('Delete this budget? This action cannot be undone.')) {
                                  handleDeleteBudget(budget.category, budget.month);
                                }
                              }}
                              aria-label="Delete budget"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm text-gray-300">
                            <span>Spent: ${budget.spent.toFixed(2)}</span>
                            <span>Budget: ${budget.amount.toFixed(2)}</span>
                          </div>

                          <ProgressLiquid percentage={Math.min(percentage, 100)} color={isOverBudget ? 'rgb(248, 113, 113)' : isWarning ? 'rgb(253, 186, 118)' : 'rgb(74, 222, 128)'} />

                          <div className="text-center">
                            <span className={`${isOverBudget ? 'text-red-300' : isWarning ? 'text-orange-300' : 'text-green-300'} text-sm font-medium`}>
                              ${(budget.amount - budget.spent).toFixed(2)} remaining
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </FloatingCard>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar: Goals and Debt */}
        <div className="space-y-6">
          {/* Savings Goals */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold text-white">Savings Goals</h3>
              <Dialog open={showGoalForm} onOpenChange={setShowGoalForm}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50">
                    <Plus className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">Add Savings Goal</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <motion.div
                      animate={shakeFields.title ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
                      transition={{ duration: 0.45 }}
                    >
                      <Label className="text-gray-300">Goal Title <span className="text-red-500">*</span></Label>
                      <Input
                        ref={titleRef}
                        className={`bg-slate-700 border-slate-600 text-white placeholder-gray-400 ${shakeFields.title ? 'ring-2 ring-red-500 border-red-500' : ''
                          }`}
                        value={goalTitle}
                        onChange={(e) => setGoalTitle(e.target.value)}
                        placeholder="Emergency Fund"
                      />
                    </motion.div>
                    <motion.div
                      animate={shakeFields.amount ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
                      transition={{ duration: 0.45 }}
                    >
                      <Label className="text-gray-300">Target Amount ($) <span className="text-red-500">*</span></Label>
                      <Input
                        ref={amountRef}
                        className={`bg-slate-700 border-slate-600 text-white placeholder-gray-400 ${shakeFields.amount ? 'ring-2 ring-red-500 border-red-500' : ''
                          }`}
                        type="text"
                        value={goalAmount}
                        onChange={(e) => setGoalAmount(e.target.value)}
                        placeholder="5000"
                        aria-required={true}
                      />
                    </motion.div>
                    <motion.div
                      animate={shakeFields.date ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
                      transition={{ duration: 0.45 }}
                    >
                      <Label className="text-gray-300">Target Date <span className="text-red-500">*</span></Label>
                      <Input
                        ref={dateRef}
                        className={`bg-slate-700 border-slate-600 text-white placeholder-gray-400 ${shakeFields.date ? 'ring-2 ring-red-500 border-red-500' : ''
                          }`}
                        type="date"
                        value={goalDate}
                        onChange={(e) => setGoalDate(e.target.value)}
                        aria-required={true}
                      />
                    </motion.div>
                    <Button onClick={handleAddSavingsGoal} className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700">
                      Create Goal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {savingsGoals.map((goal, index) => (
                <motion.div key={goal.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                  <FloatingCard
                    className={
                      goal.completed
                        ? 'bg-gradient-to-br from-green-900/30 to-green-800/40 border-green-700/50 backdrop-blur-sm'
                        : 'bg-slate-800/50 border-slate-700/50 backdrop-blur-sm'
                    }
                  >
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between text-white">
                        <h4 className="font-medium truncate">{goal.title}</h4>
                        <div className="flex items-center gap-2">
                          {goal.completed && <CheckCircle className="h-5 w-5 text-green-400" />}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-300 hover:text-red-200 hover:bg-red-900/20"
                            onClick={() => {
                              if (confirm('Delete this goal? This action cannot be undone.')) {
                                handleDeleteGoal(goal.id);
                              }
                            }}
                            aria-label="Delete goal"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-sm text-gray-300">
                        ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                      </div>

                      <ProgressLiquid
                        percentage={Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}
                        color={goal.completed ? 'rgb(74, 222, 128)' : 'rgb(96, 165, 250)'}
                        height="30px"
                      />

                      {/* Custom update */}
                      {!goal.completed && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Input
                              type="text"
                              value={goalCustomAmounts[goal.id] ?? ''}
                              onChange={(e) => handleGoalCustomChange(goal.id, e.target.value)}
                              placeholder="Enter amount"
                              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                            />
                            <Button
                              size="sm"
                              className="bg-teal-600 hover:bg-teal-700 text-white"
                              onClick={() => handleGoalCustomApply(goal.id, 'add')}
                            >
                              Add
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => handleGoalCustomApply(goal.id, 'withdraw')}
                            >
                              Withdraw
                            </Button>
                          </div>
                          <p className="text-xs text-gray-400">
                            You can withdraw in emergencies. Balance will never go below $0.
                          </p>
                        </div>
                      )}
                    </div>
                  </FloatingCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Debt Management */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold text-white">Debt Management</h3>
              <Dialog open={showDebtForm} onOpenChange={setShowDebtForm}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50">
                    <Plus className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">Add Debt</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <motion.div
                      animate={shakeDebtFields.name ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
                      transition={{ duration: 0.45 }}
                    >
                      <Label className="text-gray-300">Debt Name <span className="text-red-500">*</span></Label>
                      <Input
                        ref={debtNameRef}
                        className={`bg-slate-700 border-slate-600 text-white placeholder-gray-400 ${shakeDebtFields.name ? 'ring-2 ring-red-500 border-red-500' : ''
                          }`}
                        value={debtName}
                        onChange={(e) => setDebtName(e.target.value)}
                        placeholder="Credit Card"
                        type="text"
                      />
                    </motion.div>

                    <motion.div
                      animate={shakeDebtFields.amount ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
                      transition={{ duration: 0.45 }}
                    >
                      <Label className="text-gray-300">Amount Owed ($) <span className="text-red-500">*</span></Label>
                      <Input
                        ref={debtAmountRef}
                        className={`bg-slate-700 border-slate-600 text-white placeholder-gray-400 ${shakeDebtFields.amount ? 'ring-2 ring-red-500 border-red-500' : ''
                          }`}
                        type="text"
                        value={debtAmount}
                        onChange={(e) => setDebtAmount(e.target.value)}
                        placeholder="5000"
                        aria-required={true}
                      />
                    </motion.div>

                    <motion.div
                      animate={shakeDebtFields.payment ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
                      transition={{ duration: 0.45 }}
                    >
                      <Label className="text-gray-300">Monthly Payment ($) <span className="text-red-500">*</span></Label>
                      <Input
                        ref={debtPaymentRef}
                        className={`bg-slate-700 border-slate-600 text-white placeholder-gray-400 ${shakeDebtFields.payment ? 'ring-2 ring-red-500 border-red-500' : ''
                          }`}
                        type="text"
                        value={debtPayment}
                        onChange={(e) => setDebtPayment(e.target.value)}
                        placeholder="200"
                        aria-required={true}
                      />
                    </motion.div>

                    <div>
                      <Label className="text-gray-300">Interest Rate (%) - Optional</Label>
                      <Input
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                        type="text"
                        value={debtRate}
                        onChange={(e) => setDebtRate(e.target.value)}
                        placeholder="18.5"
                      />
                    </div>
                    <Button onClick={handleAddDebt} className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700">
                      Add Debt
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {debts.map((debt, index) => {
                const isPaidOff = debt.amount <= 0;
                const originalAmount = debt.originalAmount || debt.amount;
                const progressPercentage = originalAmount > 0 ? ((originalAmount - debt.amount) / originalAmount) * 100 : 0;

                return (
                  <motion.div key={debt.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                    <FloatingCard 
                      className={
                        isPaidOff 
                          ? 'bg-gradient-to-br from-green-900/30 to-green-800/40 border-green-700/50 backdrop-blur-sm'
                          : 'bg-slate-800/50 border-slate-700/50 backdrop-blur-sm'
                      }
                    >
                      <div className="p-4 space-y-3 text-white">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{debt.name}</h4>
                          <div className="flex items-center gap-2">
                            {isPaidOff ? (
                              <>
                                <Badge variant="default" className="bg-green-900/30 text-green-300 border-green-700/50">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Paid Off
                                </Badge>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-red-300 hover:text-red-200 hover:bg-red-900/20"
                                  onClick={() => {
                                    if (confirm('Delete this paid-off debt? This action cannot be undone.')) {
                                      handleDeleteDebt(debt.id);
                                    }
                                  }}
                                  aria-label="Delete paid-off debt"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <Badge variant="secondary" className="bg-slate-700/50 text-gray-300 border-slate-600/50 hover:bg-slate-700/50 hover:text-gray-300">
                                {debt.remainingMonths} months left
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="text-sm text-gray-300">
                          ${Number.isFinite(debt.amount) ? debt.amount.toFixed(2) : '0.00'} remaining
                        </div>

                        {originalAmount > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>Progress</span>
                              <span>{progressPercentage.toFixed(1)}% paid off</span>
                            </div>
                            <ProgressLiquid 
                              percentage={progressPercentage} 
                              color={isPaidOff ? 'rgb(74, 222, 128)' : 'rgb(96, 165, 250)'} 
                              height="20px"
                            />
                          </div>
                        )}

                        <div className="text-sm text-gray-300">
                          Monthly payment: ${Number.isFinite(debt.monthlyPayment) ? debt.monthlyPayment.toFixed(2) : '0.00'}
                        </div>

                        {debt.interestRate > 0 && (
                          <div className="text-sm text-red-300">Interest rate: {debt.interestRate}%</div>
                        )}

                        {/* Payment interface - only show if debt is not paid off */}
                        {!isPaidOff && (
                          <div className="space-y-2 pt-2 border-t border-slate-600/50">
                            <Label className="text-gray-300 text-sm">Make Payment</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="text"
                                value={debtPaymentAmounts[debt.id] ?? ''}
                                onChange={(e) => handleDebtPaymentChange(debt.id, e.target.value)}
                                placeholder="Payment amount"
                                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 text-sm"
                              />
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all duration-200 hover:scale-105 cursor-pointer shadow-lg hover:shadow-red-500/25"
                                onClick={() => handleDebtPayment(debt.id)}
                                disabled={!debtPaymentAmounts[debt.id] || parseFloat(debtPaymentAmounts[debt.id]) <= 0}
                              >
                                Pay
                              </Button>
                            </div>
                            <p className="text-xs text-gray-400">
                              Enter payment amount to reduce your debt balance
                            </p>
                          </div>
                        )}
                      </div>
                    </FloatingCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ConfettiExplosion trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
    </div>
  );
}