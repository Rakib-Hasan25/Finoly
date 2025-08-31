'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Calendar, TrendingUp } from 'lucide-react';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { FloatingCard } from '@/components/Tracker-ui/floating-card';
import { Button } from '@/components/Tracker-ui/button';
import { Badge } from '@/components/Tracker-ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Tracker-ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Tracker-ui/select';
import { storage } from '@/lib-tracker/storage';
import { addPoints } from '@/lib-tracker/gamification';
import { INCOME_CATEGORIES } from '@/lib-tracker/constants';
import { Transaction } from '@/tracker-types';

export default function IncomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  useEffect(() => {
    const loadTransactions = () => {
      const saved = storage.getTransactions();
      const income = saved.filter(t => t.type === 'income');
      setTransactions(income);
      
      // Calculate monthly total
      const monthlyIncome = income.filter(t => 
        t.date.startsWith(selectedMonth)
      );
      const total = monthlyIncome.reduce((sum, t) => sum + t.amount, 0);
      setMonthlyTotal(total);
    };

    loadTransactions();
  }, [selectedMonth]);

  const handleAddIncome = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };

    const allTransactions = storage.getTransactions();
    const updatedTransactions = [...allTransactions, newTransaction];
    storage.saveTransactions(updatedTransactions);
    
    const income = updatedTransactions.filter(t => t.type === 'income');
    setTransactions(income);
    
    // Update monthly total
    const monthlyIncome = income.filter(t => 
      t.date.startsWith(selectedMonth)
    );
    const total = monthlyIncome.reduce((sum, t) => sum + t.amount, 0);
    setMonthlyTotal(total);

    // Add points for tracking
    addPoints(10);
  };

  const handleDeleteTransaction = (id: string) => {
    const allTransactions = storage.getTransactions();
    const updatedTransactions = allTransactions.filter(t => t.id !== id);
    storage.saveTransactions(updatedTransactions);
    
    const income = updatedTransactions.filter(t => t.type === 'income');
    setTransactions(income);
    
    // Update monthly total
    const monthlyIncome = income.filter(t => 
      t.date.startsWith(selectedMonth)
    );
    const total = monthlyIncome.reduce((sum, t) => sum + t.amount, 0);
    setMonthlyTotal(total);
  };

  const monthlyTransactions = transactions.filter(t => 
    t.date.startsWith(selectedMonth)
  );

  // Group by category
  const categoryTotals = monthlyTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-white">Monthly Income Tracker</h1>
        <p className="text-gray-300">Track your income streams and monitor your financial growth</p>
        
        {/* Month Selector */}
        <div className="flex items-center justify-center space-x-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
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

        {/* Monthly Total */}
        <motion.div
          animate={{ 
            scale: monthlyTotal > 0 ? [1, 1.05, 1] : 1,
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-green-900/30 border-green-700/50 rounded-full"
        >
          <TrendingUp className="h-5 w-5 text-green-400" />
          <span className="font-semibold text-green-300">
            Monthly Total: ৳{!isNaN(Number(monthlyTotal)) ? Number(monthlyTotal).toFixed(2) : "0.00"}
          </span>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Income Form */}
        <div className="lg:col-span-1 space-y-6">
          <TransactionForm
            type="income"
            categories={INCOME_CATEGORIES}
            onSubmit={handleAddIncome}
          />

          {/* Category Breakdown */}
          {Object.keys(categoryTotals).length > 0 && (
            <FloatingCard className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-white">Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(categoryTotals).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">{category}</span>
                      <Badge variant="secondary" className="bg-green-900/30 text-green-300 border-green-700/50">
                        ৳{Number.isFinite(amount) ? amount.toFixed(2) : '0.00'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </FloatingCard>
          )}
        </div>

        {/* Income List */}
        <div className="lg:col-span-2">
          <FloatingCard className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span>Income History</span>
                <Badge variant="outline" className="border-slate-600/50 text-gray-300">
                  {monthlyTransactions.length} entries
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {monthlyTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    💰
                  </motion.div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    No income recorded for this month
                  </h3>
                  <p className="text-gray-300">
                    Start tracking your income to see your financial progress.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {monthlyTransactions
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ 
                          scale: 1.02,
                          backgroundColor: 'rgba(50, 50, 50, 0.5)'
                        }}
                        className="flex items-center justify-between p-4 rounded-lg border border-slate-700/50 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          <motion.div 
                            className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            <TrendingUp className="h-6 w-6 text-green-400" />
                          </motion.div>
                          <div>
                            <p className="font-medium text-white">
                              {transaction.category}
                            </p>
                            <p className="text-sm text-gray-300">
                              {new Date(transaction.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                            {transaction.description && (
                              <p className="text-sm text-gray-300 mt-1">
                                {transaction.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <motion.span 
                            className="font-bold text-xl text-green-300"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                          >
                            +৳{!isNaN(Number(transaction.amount)) ? Number(transaction.amount).toFixed(2) : "0.00"}
                          </motion.span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </CardContent>
          </FloatingCard>
        </div>
      </div>
    </div>
  );
}