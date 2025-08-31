import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/Tracker-ui/card';
import { Button } from '@/components/Tracker-ui/button';
import { Badge } from '@/components/Tracker-ui/badge';
import { BankAccount } from '@/tracker-types';
import { UpdateBalanceDialog } from './UpdateBalanceDialog';
import { DeleteAccountDialog } from './DeleteAccountDialog';
import { FaBangladeshiTakaSign } from "react-icons/fa6";
const ACCOUNT_ICONS = {
    checking: FaBangladeshiTakaSign,
    savings: TrendingUp,
    credit: CreditCard
};

const ACCOUNT_COLORS = {
    checking: 'from-blue-500 to-blue-600',
    savings: 'from-green-500 to-green-600',
    credit: 'from-red-500 to-red-600'
};

interface AccountCardProps {
    account: BankAccount;
    index: number;
    onUpdateBalance: (accountId: string, newBalance: number) => void;
    onDeleteAccount: (accountId: string) => void;
}

export function AccountCard({ account, index, onUpdateBalance, onDeleteAccount }: AccountCardProps) {
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const Icon = ACCOUNT_ICONS[account.type];
    const gradientClass = ACCOUNT_COLORS[account.type];

    const handleUpdateBalance = (newBalance: number) => {
        onUpdateBalance(account.id, newBalance);
    };

    const handleDeleteAccount = () => {
        onDeleteAccount(account.id);
    };

    return (
        <>
            <motion.div
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
                            <p className="text-3xl font-bold">
                                ৳ {Number.isFinite(account.balance) ? Math.abs(account.balance).toLocaleString() : '0'}
                            </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-6 flex space-x-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="bg-amber-600 text-white border-amber-500 hover:bg-amber-700"
                                onClick={() => setShowUpdateDialog(true)}
                            >
                                <Edit className="w-3 h-3 mr-1" />
                                Update
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="bg-slate-800 text-white border-slate-700 hover:bg-slate-900"
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                            </Button>
                        </div>

                    </CardContent>
                </Card>
            </motion.div>

            <UpdateBalanceDialog
                isOpen={showUpdateDialog}
                onClose={() => setShowUpdateDialog(false)}
                accountName={account.name}
                currentBalance={account.balance}
                onUpdate={handleUpdateBalance}
            />

            <DeleteAccountDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                accountName={account.name}
                onDelete={handleDeleteAccount}
            />
        </>
    );
}