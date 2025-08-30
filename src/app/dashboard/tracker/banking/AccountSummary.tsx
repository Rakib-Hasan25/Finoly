import { motion } from 'framer-motion';
import { FloatingCard } from '@/components/Tracker-ui/floating-card';
import { CardHeader, CardTitle, CardContent } from '@/components/Tracker-ui/card';
import { BankAccount } from '@/tracker-types';

interface AccountSummaryProps {
  accounts: BankAccount[];
}

export function AccountSummary({ accounts }: AccountSummaryProps) {
  if (accounts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="w-full"
    >
      <FloatingCard className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Account Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
              <p className="text-sm text-gray-300 mb-1">Total Accounts</p>
              <p className="text-2xl font-bold text-white">{accounts.length}</p>
            </div>
            <div className="text-center p-4 bg-green-900/30 rounded-lg border border-green-700/50">
              <p className="text-sm text-green-300 mb-1">Asset Accounts</p>
              <p className="text-2xl font-bold text-white">
                {accounts.filter(a => a.type !== 'credit').length}
              </p>
            </div>
            <div className="text-center p-4 bg-red-900/30 rounded-lg border border-red-700/50">
              <p className="text-sm text-red-300 mb-1">Credit Accounts</p>
              <p className="text-2xl font-bold text-white">
                {accounts.filter(a => a.type === 'credit').length}
              </p>
            </div>
          </div>
        </CardContent>
      </FloatingCard>
    </motion.div>
  );
}