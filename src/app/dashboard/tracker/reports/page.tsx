'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar } from 'lucide-react';
import { FloatingCard } from '@/components/Tracker-ui/floating-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/Tracker-ui/badge';
import { storage } from '@/lib-tracker/storage';
import { Transaction } from '@/tracker-types';

const COLORS = ['#34D399', '#F97316', '#F87171', '#A78BFA', '#22D3EE', '#FACC15'];

interface ChartData {
  name: string;
  income: number;
  expenses: number;
  net: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reportPeriod, setReportPeriod] = useState<'week' | 'month'>('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    const loadTransactions = () => {
      const saved = storage.getTransactions();
      setTransactions(saved);
    };

    loadTransactions();
  }, []);

  // Prepare data for charts
  const getChartData = () => {
    const data: ChartData[] = [];
    const now = new Date();
    
    if (reportPeriod === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        const dateStr = date.toDateString();
        
        const dayTransactions = transactions.filter(t => 
          new Date(t.date).toDateString() === dateStr
        );
        
        const income = dayTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
          
        const expenses = dayTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        data.push({
          name: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          income,
          expenses,
          net: income - expenses
        });
      }
    } else {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(now.getMonth() - i);
        const monthStr = date.toISOString().slice(0, 7);
        
        const monthTransactions = transactions.filter(t => 
          t.date.startsWith(monthStr)
        );
        
        const income = monthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
          
        const expenses = monthTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        data.push({
          name: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          income,
          expenses,
          net: income - expenses
        });
      }
    }
    
    return data;
  };

  // Get spending by category
  const getSpendingByCategory = () => {
    const currentTransactions = transactions.filter(t => {
      if (reportPeriod === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(t.date) >= weekAgo && t.type === 'expense';
      } else {
        return t.date.startsWith(selectedMonth) && t.type === 'expense';
      }
    });

    const categoryTotals = currentTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value);
  };

  const chartData = getChartData();
  const categoryData = getSpendingByCategory();
  
  // Calculate totals for current period
  const currentPeriodTransactions = transactions.filter(t => {
    if (reportPeriod === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(t.date) >= weekAgo;
    } else {
      return t.date.startsWith(selectedMonth);
    }
  });

  const totalIncome = currentPeriodTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = currentPeriodTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-white">Financial Reports</h1>
        <p className="text-gray-300">Analyze your spending patterns and financial progress</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Select value={reportPeriod} onValueChange={(value: 'week' | 'month') => setReportPeriod(value)}>
            <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              <SelectItem value="week">Weekly Report</SelectItem>
              <SelectItem value="month">Monthly Report</SelectItem>
            </SelectContent>
          </Select>

          {reportPeriod === 'month' && (
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
          )}
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="bg-green-900/30 border-green-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-300">Total Income</p>
                  <p className="text-2xl font-bold text-green-200">
                    ${totalIncome.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-red-900/30 border-red-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-300">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-200">
                    ${totalExpenses.toFixed(2)}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className={`bg-slate-900/30 border ${
            netIncome >= 0 
              ? 'bg-blue-900/30 border-blue-700/50' 
              : 'bg-orange-900/30 border-orange-700/50'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${netIncome >= 0 ? 'text-blue-300' : 'text-orange-300'}`}>
                    Net Income
                  </p>
                  <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-blue-200' : 'text-orange-200'}`}>
                    ${netIncome.toFixed(2)}
                  </p>
                </div>
                <DollarSign className={`h-8 w-8 ${netIncome >= 0 ? 'text-blue-400' : 'text-orange-400'}`} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-purple-900/30 border-purple-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-300">Savings Rate</p>
                  <p className="text-2xl font-bold text-purple-200">
                    {savingsRate.toFixed(1)}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income vs Expenses Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <FloatingCard className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid stroke="#475569" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    formatter={(value, name) => [`$${value}`, name === 'income' ? 'Income' : name === 'expenses' ? 'Expenses' : 'Net']} 
                    contentStyle={{ backgroundColor: '#334155', border: '1px solid #475569', color: '#fff' }}
                  />
                  <Bar dataKey="income" fill="#34D399" name="income" />
                  <Bar dataKey="expenses" fill="#F87171" name="expenses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </FloatingCard>
        </motion.div>

        {/* Spending by Category */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <FloatingCard className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`$${value}`, 'Amount']} 
                        contentStyle={{ backgroundColor: '#334155', border: '1px solid #475569', color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {categoryData.slice(0, 5).map((category, index) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-sm font-medium text-gray-300">{category.name}</span>
                        </div>
                        <Badge variant="secondary" className="bg-slate-700/50 text-gray-300">
                          ${Number.isFinite(category.value) ? category.value.toFixed(2) : '0.00'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No spending data for this period</p>
                </div>
              )}
            </CardContent>
          </FloatingCard>
        </motion.div>
      </div>

      {/* Trend Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <FloatingCard className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Net Income Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#475569" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Net Income']} 
                  contentStyle={{ backgroundColor: '#334155', border: '1px solid #475569', color: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="net" 
                  stroke="#A78BFA" 
                  strokeWidth={3}
                  dot={{ fill: '#A78BFA', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </FloatingCard>
      </motion.div>
    </div>
  );
}