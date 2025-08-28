'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit3, Calendar } from 'lucide-react';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { FloatingCard } from '@/components/Tracker-ui/floating-card';
import { Button } from '@/components/Tracker-ui/button';
import { Badge } from '@/components/Tracker-ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Tracker-ui/card';
import { storage } from '@/lib-tracker/storage';
import { addPoints } from '@/lib-tracker/gamification';
import { EXPENSE_CATEGORIES } from '@/lib-tracker/constants';
import { Transaction } from '@/tracker-types';

export default function SpendingPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [todaysTotal, setTodaysTotal] = useState(0);

  useEffect(() => {
    const loadTransactions = () => {
      const saved = storage.getTransactions();
      const expenses = saved.filter(t => t.type === 'expense');
      setTransactions(expenses);
      
      // Calculate today's total
      const today = new Date().toDateString();
      const todaysExpenses = expenses.filter(t => 
        new Date(t.date).toDateString() === today
      );
      const total = todaysExpenses.reduce((sum, t) => sum + t.amount, 0);
      setTodaysTotal(total);
    };

    loadTransactions();
  }, []);

  const handleAddExpense = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };

    const allTransactions = storage.getTransactions();
    const updatedTransactions = [...allTransactions, newTransaction];
    storage.saveTransactions(updatedTransactions);
    
    const expenses = updatedTransactions.filter(t => t.type === 'expense');
    setTransactions(expenses);
    
    // Update today's total
    const today = new Date().toDateString();
    const todaysExpenses = expenses.filter(t => 
      new Date(t.date).toDateString() === today
    );
    const total = todaysExpenses.reduce((sum, t) => sum + t.amount, 0);
    setTodaysTotal(total);

    // Add points for tracking
    addPoints(5);
  };

  const handleDeleteTransaction = (id: string) => {
    const allTransactions = storage.getTransactions();
    const updatedTransactions = allTransactions.filter(t => t.id !== id);
    storage.saveTransactions(updatedTransactions);
    
    const expenses = updatedTransactions.filter(t => t.type === 'expense');
    setTransactions(expenses);
    
    // Update today's total
    const today = new Date().toDateString();
    const todaysExpenses = expenses.filter(t => 
      new Date(t.date).toDateString() === today
    );
    const total = todaysExpenses.reduce((sum, t) => sum + t.amount, 0);
    setTodaysTotal(total);
  };

  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Check if today's total exceeds $100
  const isOverBudget = todaysTotal > 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-gray-900">Daily Spending Tracker</h1>
        <p className="text-gray-600">Track your daily expenses and build healthy spending habits</p>
        
        {/* Today's Total - Fixed Animation */}
        <motion.div
          animate={{ 
            scale: isOverBudget ? [1, 1.05, 1] : 1,
          }}
          transition={{ 
            duration: 2, 
            repeat: isOverBudget ? Infinity : 0,
            ease: "easeInOut"
          }}
          className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full transition-colors duration-300 ${
            isOverBudget 
              ? 'bg-red-100 border border-red-200' 
              : 'bg-green-50 border border-green-200'
          }`}
        >
          <Calendar className={`h-5 w-5 ${isOverBudget ? 'text-red-600' : 'text-green-600'}`} />
          <span className={`font-semibold ${isOverBudget ? 'text-red-900' : 'text-green-900'}`}>
            Today's Total: ${Number.isFinite(todaysTotal) ? todaysTotal.toFixed(2) : '0.00'}
          </span>
          {isOverBudget && (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-red-600 text-sm font-medium"
            >
              Over Budget!
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Expense Form */}
        <div className="lg:col-span-1">
          <TransactionForm
            type="expense"
            categories={EXPENSE_CATEGORIES}
            onSubmit={handleAddExpense}
          />
        </div>

        {/* Expense List */}
        <div className="lg:col-span-2">
          <FloatingCard>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Expenses</span>
                <Badge variant="outline">
                  {transactions.length} total
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    💸
                  </motion.div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No expenses tracked yet
                  </h3>
                  <p className="text-gray-500">
                    Start by adding your first expense to begin tracking your spending habits.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedDates.map((date, dateIndex) => {
                    const dayTransactions = groupedTransactions[date];
                    const dayTotal = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
                    
                    return (
                      <motion.div
                        key={date}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: dateIndex * 0.1 }}
                        className="space-y-3"
                      >
                        {/* Date Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                          <h4 className="font-medium text-gray-900">
                            {new Date(date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </h4>
                          <Badge 
                            variant="secondary"
                            className="bg-red-50 text-red-700 border-red-200"
                          >
                            ${Number.isFinite(dayTotal) ? dayTotal.toFixed(2) : '0.00'}
                          </Badge>
                        </div>

                        {/* Transactions for this date */}
                        <div className="space-y-2">
                          {dayTransactions.map((transaction, index) => (
                            <motion.div
                              key={transaction.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ 
                                scale: 1.02,
                                backgroundColor: 'rgba(0,0,0,0.02)'
                              }}
                              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:shadow-md transition-all"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                  <span className="text-red-600 font-semibold text-sm">
                                  ${!isNaN(Number(transaction.amount)) ? Number(transaction.amount).toFixed(0) : "0"}

                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {transaction.category}
                                  </p>
                                  {transaction.description && (
                                    <p className="text-sm text-gray-500">
                                      {transaction.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-red-600">
                                  ${Number.isFinite(transaction.amount) ? transaction.amount.toFixed(2) : '0.00'}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteTransaction(transaction.id)}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </FloatingCard>
        </div>
      </div>
    </div>
  );
}