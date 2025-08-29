'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Building2, TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';
import { FloatingCard } from '@/components/Tracker-ui/floating-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Tracker-ui/card';
import { Button } from '@/components/Tracker-ui/button';
import { Input } from '@/components/Tracker-ui/input';
import { Label } from '@/components/Tracker-ui/label';
import { Badge } from '@/components/Tracker-ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { storage } from '@/lib-tracker/storage';
import { BankAccount } from '@/tracker-types';

const ACCOUNT_ICONS = {
  checking: DollarSign,
  savings: TrendingUp,
  credit: CreditCard
};

const ACCOUNT_COLORS = {
  checking: 'from-blue-500 to-blue-600',
  savings: 'from-green-500 to-green-600', 
  credit: 'from-red-500 to-red-600'
};

export default function BankingPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [showAccountForm, setShowAccountForm] = useState(false);
  
  // Form state
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState<'checking' | 'savings' | 'credit'>('checking');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountBalance, setAccountBalance] = useState('');

  useEffect(() => {
    const loadAccounts = () => {
      setAccounts(storage.getBankAccounts());
    };

    loadAccounts();
  }, []);

  const handleAddAccount = () => {
    if (!accountName || !accountNumber || !accountBalance) return;

    const newAccount: BankAccount = {
      id: Date.now().toString(),
      name: accountName,
      type: accountType,
      accountNumber: accountNumber,
      balance: parseFloat(accountBalance)
    };

    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    storage.saveBankAccounts(updatedAccounts);
    
    // Reset form
    setAccountName('');
    setAccountNumber('');
    setAccountBalance('');
    setShowAccountForm(false);
  };

  const handleUpdateBalance = (accountId: string, newBalance: number) => {
    const updatedAccounts = accounts.map(account => 
      account.id === accountId 
        ? { ...account, balance: newBalance }
        : account
    );
    
    setAccounts(updatedAccounts);
    storage.saveBankAccounts(updatedAccounts);
  };

  const totalAssets = accounts
    .filter(a => a.type !== 'credit')
    .reduce((sum, a) => sum + a.balance, 0);
    
  const totalLiabilities = accounts
    .filter(a => a.type === 'credit')
    .reduce((sum, a) => sum + Math.abs(a.balance), 0);
    
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-white">Banking Overview</h1>
        <p className="text-gray-300">Manage your accounts and track your net worth</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="bg-gradient-to-br from-green-900/30 to-green-800/40 border-green-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-300">Total Assets</p>
                  <p className="text-2xl font-bold text-white">
                    ${totalAssets.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-red-900/30 to-red-800/40 border-red-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-300">Total Liabilities</p>
                  <p className="text-2xl font-bold text-white">
                    ${totalLiabilities.toLocaleString()}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={`bg-gradient-to-br border-2 backdrop-blur-sm ${
            netWorth >= 0 
              ? 'from-blue-900/30 to-blue-800/40 border-blue-700/50' 
              : 'from-orange-900/30 to-orange-800/40 border-orange-700/50'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${netWorth >= 0 ? 'text-blue-300' : 'text-orange-300'}`}>
                    Net Worth
                  </p>
                  <p className="text-2xl font-bold text-white">
                    ${netWorth.toLocaleString()}
                  </p>
                </div>
                <DollarSign className={`h-8 w-8 ${netWorth >= 0 ? 'text-blue-400' : 'text-orange-400'}`} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Accounts Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Your Accounts</h2>
        <Dialog open={showAccountForm} onOpenChange={setShowAccountForm}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Add Bank Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Account Name</Label>
                <Input
                  className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="My Checking Account"
                />
              </div>
              <div>
                <Label className="text-gray-300">Account Type</Label>
                <Select value={accountType} onValueChange={(value: 'checking' | 'savings' | 'credit') => setAccountType(value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Account Number (Last 4 digits)</Label>
                <Input
                  className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="1234"
                  maxLength={4}
                />
              </div>
              <div>
                <Label className="text-gray-300">Current Balance ($)</Label>
                <Input
                  className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                  type="number"
                  value={accountBalance}
                  onChange={(e) => setAccountBalance(e.target.value)}
                  placeholder="1000.00"
                />
              </div>
              <Button 
                onClick={handleAddAccount} 
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
              >
                Add Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.length === 0 ? (
          <div className="col-span-full">
            <FloatingCard className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium text-white mb-2">
                  No accounts added yet
                </h3>
                <p className="text-gray-300 mb-4">
                  Add your bank accounts to track your complete financial picture.
                </p>
                <Button 
                  onClick={() => setShowAccountForm(true)}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                >
                  Add Your First Account
                </Button>
              </div>
            </FloatingCard>
          </div>
        ) : (
          accounts.map((account, index) => {
            const Icon = ACCOUNT_ICONS[account.type];
            const gradientClass = ACCOUNT_COLORS[account.type];
            
            return (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Card Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-90`} />
                  
                  {/* Pattern Overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full" />
                    <div className="absolute top-8 right-8 w-8 h-8 border-2 border-white rounded-full" />
                  </div>

                  <CardContent className="relative p-6 text-white">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <Badge 
                          variant="secondary" 
                          className="bg-white/20 text-white border-white/30 mb-2"
                        >
                          {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                        </Badge>
                        <h3 className="text-lg font-semibold">{account.name}</h3>
                        <p className="text-sm opacity-80">****{account.accountNumber}</p>
                      </div>
                      <Icon className="h-8 w-8 opacity-80" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm opacity-80">
                        {account.type === 'credit' ? 'Amount Owed' : 'Balance'}
                      </p>
                      <motion.p 
                        className="text-3xl font-bold"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ${Number.isFinite(account.balance) ? Math.abs(account.balance).toLocaleString() : '0'}
                      </motion.p>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6 flex space-x-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                        onClick={() => {
                          const amount = prompt('Enter new balance:');
                          if (amount && !isNaN(parseFloat(amount))) {
                            handleUpdateBalance(account.id, parseFloat(amount));
                          }
                        }}
                      >
                        Update
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Quick Stats */}
      {accounts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <FloatingCard className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Account Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
                  <p className="text-sm text-gray-300">Total Accounts</p>
                  <p className="text-2xl font-bold text-white">{accounts.length}</p>
                </div>
                <div className="text-center p-4 bg-green-900/30 rounded-lg border border-green-700/50">
                  <p className="text-sm text-green-300">Asset Accounts</p>
                  <p className="text-2xl font-bold text-white">
                    {accounts.filter(a => a.type !== 'credit').length}
                  </p>
                </div>
                <div className="text-center p-4 bg-red-900/30 rounded-lg border border-red-700/50">
                  <p className="text-sm text-red-300">Credit Accounts</p>
                  <p className="text-2xl font-bold text-white">
                    {accounts.filter(a => a.type === 'credit').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </FloatingCard>
        </motion.div>
      )}
    </div>
  );
}