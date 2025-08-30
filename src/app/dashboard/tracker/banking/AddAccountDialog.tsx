'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/Tracker-ui/button';
import { Input } from '@/components/Tracker-ui/input';
import { Label } from '@/components/Tracker-ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BankAccount } from '@/tracker-types';
import clsx from 'clsx';

interface AddAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (account: Omit<BankAccount, 'id'>) => void;
}

export function AddAccountDialog({ isOpen, onClose, onAddAccount }: AddAccountDialogProps) {
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState<'checking' | 'savings' | 'credit'>('checking');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountBalance, setAccountBalance] = useState('');
  const [shake, setShake] = useState(false);

  const handleAddAccount = () => {
    if (!accountName || !accountNumber || !accountBalance || parseFloat(accountBalance) < 0) {
      // Trigger shake animation
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const newAccount = {
      name: accountName,
      type: accountType,
      accountNumber: accountNumber,
      balance: parseFloat(accountBalance),
    };

    onAddAccount(newAccount);

    // Reset form
    setAccountName('');
    setAccountNumber('');
    setAccountBalance('');
    onClose();
  };

  const handleClose = () => {
    setAccountName('');
    setAccountNumber('');
    setAccountBalance('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Add Bank Account</DialogTitle>
        </DialogHeader>
        <div className={clsx("space-y-4", shake && "animate-shake")}>
          <div>
            <Label className="text-gray-300">Account Name *</Label>
            <Input
              className={clsx(
                "bg-slate-700 border-slate-600 text-white placeholder-gray-400",
                !accountName && shake && "border-red-500"
              )}
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
            <Label className="text-gray-300">Account Number (Last 4 digits) *</Label>
            <Input
              className={clsx(
                "bg-slate-700 border-slate-600 text-white placeholder-gray-400",
                !accountNumber && shake && "border-red-500"
              )}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="1234"
              maxLength={4}
            />
          </div>
          <div>
            <Label className="text-gray-300">Current Balance ($) *</Label>
            <Input
              className={clsx(
                "bg-slate-700 border-slate-600 text-white placeholder-gray-400",
                (!accountBalance || parseFloat(accountBalance) < 0) && shake && "border-red-500"
              )}
              type="text" // remove spinner
              value={accountBalance}
              onChange={(e) => {
                // Allow only numbers and decimal
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) setAccountBalance(value);
              }}
              placeholder="1000.00"
            />
          </div>
          <div className="flex space-x-2 pt-4">
            <Button 
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent border-slate-600 text-gray-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddAccount} 
              className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
            >
              Add Account
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Shake animation using Tailwind */}
      <style jsx>{`
        .animate-shake {
          animation: shake 0.5s;
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </Dialog>
  );
}
