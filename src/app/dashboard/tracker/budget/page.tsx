'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
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

  useEffect(() => {
    const loadData = () => {
      setBudgets(storage.getBudgets());
      setSavingsGoals(storage.getSavingsGoals());
      setDebts(storage.getDebts());
    };

    loadData();
    calculateSpentAmounts();
  }, [selectedMonth]);

  const calculateSpentAmounts = () => {
    const transactions = storage.getTransactions();
    const monthlyExpenses = transactions.filter(t => 
      t.type === 'expense' && t.date.startsWith(selectedMonth)
    );

    const updatedBudgets = budgets.map(budget => {
      const spent = monthlyExpenses
        .filter(t => t.category === budget.category && t.date.startsWith(budget.month))
        .reduce((sum, t) => sum + t.amount, 0);
      
      return { ...budget, spent };
    });

    setBudgets(updatedBudgets);
    storage.saveBudgets(updatedBudgets);
  };

  const handleAddBudget = () => {
    if (!budgetCategory || !budgetAmount) return;

    const newBudget: Budget = {
      category: budgetCategory,
      amount: parseFloat(budgetAmount),
      spent: 0,
      month: selectedMonth
    };

    const existingBudgetIndex = budgets.findIndex(b => 
      b.category === budgetCategory && b.month === selectedMonth
    );

    let updatedBudgets;
    if (existingBudgetIndex >= 0) {
      updatedBudgets = [...budgets];
      updatedBudgets[existingBudgetIndex] = newBudget;
    } else {
      updatedBudgets = [...budgets, newBudget];
    }

    setBudgets(updatedBudgets);
    storage.saveBudgets(updatedBudgets);
    
    setBudgetCategory('');
    setBudgetAmount('');
    setShowBudgetForm(false);
    addPoints(5);
  };

  const handleAddSavingsGoal = () => {
    if (!goalTitle || !goalAmount || !goalDate) return;

    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      title: goalTitle,
      targetAmount: parseFloat(goalAmount),
      currentAmount: 0,
      targetDate: goalDate,
      completed: false
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

  const handleAddDebt = () => {
    if (!debtName || !debtAmount || !debtPayment) return;

    const newDebt: Debt = {
      id: Date.now().toString(),
      name: debtName,
      amount: parseFloat(debtAmount),
      monthlyPayment: parseFloat(debtPayment),
      remainingMonths: Math.ceil(parseFloat(debtAmount) / parseFloat(debtPayment)),
      interestRate: parseFloat(debtRate) || 0
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

  const handleGoalContribution = (goalId: string, amount: number) => {
    const updatedGoals = savingsGoals.map(goal => {
      if (goal.id === goalId) {
        const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
        const completed = newAmount >= goal.targetAmount;
        
        if (completed && !goal.completed) {
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

  const currentBudgets = budgets.filter(b => b.month === selectedMonth);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
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
                  month: 'long' 
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
                  <div>
                    <Label className="text-gray-300">Category</Label>
                    <Select value={budgetCategory} onValueChange={setBudgetCategory}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        {EXPENSE_CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Monthly Budget ($)</Label>
                    <Input
                      className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                      type="number"
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
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
                  <h3 className="text-xl font-medium text-white mb-2">
                    No budgets set for this month
                  </h3>
                  <p className="text-gray-300">
                    Create budgets to track your spending and stay on target.
                  </p>
                </div>
              </FloatingCard>
            ) : (
              currentBudgets.map((budget, index) => {
                const percentage = (budget.spent / budget.amount) * 100;
                const isOverBudget = percentage > 100;
                const isWarning = percentage > 80 && percentage <= 100;
                
                return (
                  <motion.div
                    key={`${budget.category}-${budget.month}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FloatingCard 
                      className={`bg-slate-800/50 border-slate-700/50 backdrop-blur-sm ${
                        isOverBudget ? 'ring-2 ring-red-700' : 
                        isWarning ? 'ring-2 ring-orange-700' : ''
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-white">{budget.category}</CardTitle>
                          <div className="flex items-center space-x-2">
                            {isOverBudget ? (
                              <Badge 
                                variant="destructive" 
                                className="bg-red-900/30 text-red-300 border-red-700/50 animate-pulse"
                              >
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Over Budget
                              </Badge>
                            ) : isWarning ? (
                              <Badge 
                                variant="secondary" 
                                className="bg-orange-900/30 text-orange-300 border-orange-700/50"
                              >
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Warning
                              </Badge>
                            ) : (
                              <Badge 
                                variant="default" 
                                className="bg-green-900/30 text-green-300 border-green-700/50"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                On Track
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm text-gray-300">
                            <span>Spent: ${budget.spent.toFixed(2)}</span>
                            <span>Budget: ${budget.amount.toFixed(2)}</span>
                          </div>
                          
                          <ProgressLiquid 
                            percentage={Math.min(percentage, 100)}
                            color={isOverBudget ? 'rgb(248, 113, 113)' : 
                                   isWarning ? 'rgb(253, 186, 118)' : 
                                   'rgb(74, 222, 128)'}
                          />
                          
                          <div className="text-center">
                            <span className={`text-sm font-medium ${
                              isOverBudget ? 'text-red-300' : 
                              isWarning ? 'text-orange-300' : 
                              'text-green-300'
                            }`}>
                              {(budget.amount - budget.spent).toFixed(2)} remaining
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
                    <div>
                      <Label className="text-gray-300">Goal Title</Label>
                      <Input
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                        value={goalTitle}
                        onChange={(e) => setGoalTitle(e.target.value)}
                        placeholder="Emergency Fund"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Target Amount ($)</Label>
                      <Input
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                        type="number"
                        value={goalAmount}
                        onChange={(e) => setGoalAmount(e.target.value)}
                        placeholder="5000"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Target Date</Label>
                      <Input
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                        type="date"
                        value={goalDate}
                        onChange={(e) => setGoalDate(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleAddSavingsGoal} className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700">
                      Create Goal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {savingsGoals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FloatingCard 
                    className={
                      goal.completed 
                        ? 'bg-gradient-to-br from-green-900/30 to-green-800/40 border-green-700/50 backdrop-blur-sm'
                        : 'bg-slate-800/50 border-slate-700/50 backdrop-blur-sm'
                    }
                  >
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between text-white">
                        <h4 className="font-medium">{goal.title}</h4>
                        {goal.completed && (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-300">
                        ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                      </div>
                      
                      <ProgressLiquid 
                        percentage={(goal.currentAmount / goal.targetAmount) * 100}
                        color={goal.completed ? 'rgb(74, 222, 128)' : 'rgb(96, 165, 250)'}
                        height="30px"
                      />
                      
                      {!goal.completed && (
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-slate-700/50 text-white border-slate-600/50 hover:bg-slate-600/50"
                            onClick={() => handleGoalContribution(goal.id, 25)}
                          >
                            +$25
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-slate-700/50 text-white border-slate-600/50 hover:bg-slate-600/50"
                            onClick={() => handleGoalContribution(goal.id, 100)}
                          >
                            +$100
                          </Button>
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
                    <div>
                      <Label className="text-gray-300">Debt Name</Label>
                      <Input
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                        value={debtName}
                        onChange={(e) => setDebtName(e.target.value)}
                        placeholder="Credit Card"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Amount Owed ($)</Label>
                      <Input
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                        type="number"
                        value={debtAmount}
                        onChange={(e) => setDebtAmount(e.target.value)}
                        placeholder="5000"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Monthly Payment ($)</Label>
                      <Input
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                        type="number"
                        value={debtPayment}
                        onChange={(e) => setDebtPayment(e.target.value)}
                        placeholder="200"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Interest Rate (%) - Optional</Label>
                      <Input
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                        type="number"
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
              {debts.map((debt, index) => (
                <motion.div
                  key={debt.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FloatingCard className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                    <div className="p-4 space-y-3 text-white">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{debt.name}</h4>
                        <Badge variant="secondary" className="bg-slate-700/50 text-gray-300 border-slate-600/50">
                          {debt.remainingMonths} months left
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-300">
                        ${Number.isFinite(debt.amount) ? debt.amount.toFixed(2) : '0.00'} remaining
                      </div>
                      
                      <div className="text-sm text-gray-300">
                        Monthly payment: ${Number.isFinite(debt.monthlyPayment) ? debt.monthlyPayment.toFixed(2) : '0.00'}
                      </div>
                      
                      {debt.interestRate > 0 && (
                        <div className="text-sm text-red-300">
                          Interest rate: {debt.interestRate}%
                        </div>
                      )}
                    </div>
                  </FloatingCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfettiExplosion 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
    </div>
  );
}