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
        <h1 className="text-3xl font-bold text-gray-900">Banking Overview</h1>
        <p className="text-gray-600">Manage your accounts and track your net worth</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Total Assets</p>
                  <p className="text-2xl font-bold text-green-900">
                    ${totalAssets.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Total Liabilities</p>
                  <p className="text-2xl font-bold text-red-900">
                    ${totalLiabilities.toLocaleString()}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={`bg-gradient-to-br border-2 ${
            netWorth >= 0 
              ? 'from-blue-50 to-blue-100 border-blue-200' 
              : 'from-orange-50 to-orange-100 border-orange-200'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${netWorth >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                    Net Worth
                  </p>
                  <p className={`text-2xl font-bold ${netWorth >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
                    ${netWorth.toLocaleString()}
                  </p>
                </div>
                <DollarSign className={`h-8 w-8 ${netWorth >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Accounts Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Your Accounts</h2>
        <Dialog open={showAccountForm} onOpenChange={setShowAccountForm}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Bank Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Account Name</Label>
                <Input
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="My Checking Account"
                />
              </div>
              <div>
                <Label>Account Type</Label>
                <Select value={accountType} onValueChange={(value: 'checking' | 'savings' | 'credit') => setAccountType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Account Number (Last 4 digits)</Label>
                <Input
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="1234"
                  maxLength={4}
                />
              </div>
              <div>
                <Label>Current Balance ($)</Label>
                <Input
                  type="number"
                  value={accountBalance}
                  onChange={(e) => setAccountBalance(e.target.value)}
                  placeholder="1000.00"
                />
              </div>
              <Button onClick={handleAddAccount} className="w-full">
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
            <FloatingCard>
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No accounts added yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Add your bank accounts to track your complete financial picture.
                </p>
                <Button 
                  onClick={() => setShowAccountForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600"
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
          <FloatingCard>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Accounts</p>
                  <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600">Asset Accounts</p>
                  <p className="text-2xl font-bold text-green-900">
                    {accounts.filter(a => a.type !== 'credit').length}
                  </p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600">Credit Accounts</p>
                  <p className="text-2xl font-bold text-red-900">
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