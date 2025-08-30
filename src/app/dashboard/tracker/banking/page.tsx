'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Building2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { FloatingCard } from '@/components/Tracker-ui/floating-card';
import { Card, CardContent } from '@/components/Tracker-ui/card';
import { Button } from '@/components/Tracker-ui/button';
import { storage } from '@/lib-tracker/storage';
import { BankAccount } from '@/tracker-types';
import { AccountCard } from './AccountCard';
import { AddAccountDialog } from './AddAccountDialog';
import { AccountSummary } from './AccountSummary';

export default function BankingPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [showAccountForm, setShowAccountForm] = useState(false);

  useEffect(() => {
    const loadAccounts = () => {
      setAccounts(storage.getBankAccounts());
    };

    loadAccounts();
  }, []);

  const handleAddAccount = (accountData: Omit<BankAccount, 'id'>) => {
    const newAccount: BankAccount = {
      id: Date.now().toString(),
      ...accountData
    };

    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    storage.saveBankAccounts(updatedAccounts);
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

  const handleDeleteAccount = (accountId: string) => {
    const updatedAccounts = accounts.filter(account => account.id !== accountId);
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
    <div className="space-y-8 max-w-full overflow-hidden">
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
        <Button 
          onClick={() => setShowAccountForm(true)}
          className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Account
        </Button>
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
          accounts.map((account, index) => (
            <AccountCard
              key={account.id}
              account={account}
              index={index}
              onUpdateBalance={handleUpdateBalance}
              onDeleteAccount={handleDeleteAccount}
            />
          ))
        )}
      </div>

      {/* Account Summary */}
      <AccountSummary accounts={accounts} />

      {/* Add Account Dialog */}
      <AddAccountDialog
        isOpen={showAccountForm}
        onClose={() => setShowAccountForm(false)}
        onAddAccount={handleAddAccount}
      />
    </div>
  );
}