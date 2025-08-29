'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Tracker-ui/card';
import { Button } from '@/components/Tracker-ui/button';
import { Input } from '@/components/Tracker-ui/input';
import { Label } from '@/components/Tracker-ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Tracker-ui/select';
import { Calendar } from '@/components/Tracker-ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Tracker-ui/popover';
import { CalendarIcon, Plus, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { Transaction } from '@/tracker-types';
import { cn } from '@/lib-tracker/utils';

interface TransactionFormProps {
  type: 'income' | 'expense';
  categories: string[];
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  className?: string;
}

interface FormData {
  amount: number;
  category: string;
  description: string;
  date: Date;
}

// In-place CoinLoading component logic
const CoinLoading = () => {
  const numCoins = 15;
  const coinValues = ['$1', '$2', '$5', '$10', '$20'];

  const initialWindowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const initialWindowHeight = typeof window !== 'undefined' ? window.innerHeight : 768;

  const coins = Array.from({ length: numCoins }, (_, i) => ({
    id: i + 1,
    delay: i * 0.15,
    size: 96,
    xStart: Math.random() * initialWindowWidth,
    value: coinValues[Math.floor(Math.random() * coinValues.length)],
  }));

  return (
    <div className="fixed inset-0 flex items-start justify-start bg-gray-900/90 z-50 overflow-hidden">
      <div className="relative w-full h-full">
        {coins.map((coin) => (
          <motion.svg
            key={coin.id}
            className="absolute"
            style={{ width: coin.size, height: coin.size }}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ y: -120, x: coin.xStart }}
            animate={{
              y: [-120, initialWindowHeight + 120],
              opacity: [0, 1, 1, 0.8],
              scale: [0.9, 1, 1, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3.5 + Math.random(),
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
              delay: coin.delay,
            }}
          >
            <defs>
              <radialGradient id={`grad-${coin.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF9C4" />
                <stop offset="60%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FFA500" />
              </radialGradient>
            </defs>
            <circle cx="32" cy="32" r="30" fill={`url(#grad-${coin.id})`} stroke="#FFC700" strokeWidth="2" />
            <circle cx="32" cy="32" r="25" fill="none" stroke="#FFECB3" strokeWidth="2" strokeDasharray="2 4" />
            <ellipse cx="24" cy="24" rx="6" ry="3" fill="rgba(255,255,255,0.5)" />
            <text
              x="32"
              y="38"
              textAnchor="middle"
              fontSize="20"
              fontWeight="bold"
              fill="#ffffff"
              stroke="#000000"
              strokeWidth="0.5"
            >
              {coin.value}
            </text>
          </motion.svg>
        ))}
      </div>
    </div>
  );
};

// In-place MoneyFalling component logic
const MoneyFalling = () => {
  const numBills = 15;
  const initialWindowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const initialWindowHeight = typeof window !== 'undefined' ? window.innerHeight : 768;

  const bills = Array.from({ length: numBills }, (_, i) => ({
    id: i + 1,
    delay: i * 0.15,
    size: 100 + Math.random() * 50,
    xStart: Math.random() * initialWindowWidth,
    rotate: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 flex items-start justify-start bg-gray-900/90 z-50 overflow-hidden">
      <div className="relative w-full h-full">
        {bills.map((bill) => (
          <motion.svg
            key={bill.id}
            className="absolute"
            style={{ width: bill.size, height: bill.size }}
            viewBox="0 0 100 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ y: -120, x: bill.xStart, rotate: bill.rotate }}
            animate={{
              y: [-120, initialWindowHeight + 120],
              opacity: [0, 1, 1, 0.8],
              rotate: [bill.rotate, bill.rotate + 720],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
              delay: bill.delay,
            }}
          >
            <rect x="0" y="0" width="100" height="50" rx="10" fill="#4CAF50" stroke="#388E3C" strokeWidth="2" />
            <circle cx="25" cy="25" r="10" fill="#FFEB3B" />
            <text x="25" y="32" fontSize="16" textAnchor="middle" fill="#388E3C" fontWeight="bold">
              $
            </text>
            <text x="50" y="30" fontSize="10" textAnchor="middle" fill="#FFFFFF" fontWeight="bold">
              INCOME
            </text>
            <text x="75" y="32" fontSize="16" textAnchor="middle" fill="#388E3C" fontWeight="bold">
              $
            </text>
          </motion.svg>
        ))}
      </div>
    </div>
  );
};


export function TransactionForm({ type, categories, onSubmit, className }: TransactionFormProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [showAnimation, setShowAnimation] = useState(false);
  const [isSecure, setIsSecure] = useState(false);
  const [amountValue, setAmountValue] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { register, handleSubmit, formState: { errors, isValid }, reset, setValue, watch } = useForm<FormData>({
    defaultValues: {
      date: new Date(),
      description: '',
      amount: undefined,
      category: ''
    }
  });

  const watchedAmount = watch('amount');

  const onFormSubmit = (data: FormData) => {
    const transaction: Omit<Transaction, 'id'> = {
      ...data,
      date: date.toISOString(),
      type
    };

    setIsSecure(true);
    setShowAnimation(true);

    setTimeout(() => {
      onSubmit(transaction);
      reset();
      setDate(new Date());
      setAmountValue('');
      setSelectedCategory('');
      setIsSecure(false);
      setShowAnimation(false);
    }, 2000); 
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountValue(value);
    setValue('amount', value ? parseFloat(value) : 0);
  };

  const handleAmountFocus = () => {
    if (amountValue === '0' || amountValue === '') {
      setAmountValue('');
    }
  };

  const handleAmountWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  return (
    <>
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-md"
          >
            {type === 'income' ? <MoneyFalling /> : <CoinLoading />}
          </motion.div>
        )}
      </AnimatePresence>

      <Card className={cn("relative overflow-hidden bg-slate-800/50 border-slate-700/50 backdrop-blur-sm dark", className)}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white">
              Add {type === 'income' ? 'Income' : 'Expense'}
            </CardTitle>

            <motion.div
              animate={{
                scale: isSecure ? [1, 1.2, 1] : 1,
                rotate: isSecure ? [0, 360] : 0
              }}
              transition={{ duration: 0.5 }}
              className={`p-2 rounded-full ${isSecure ? 'bg-green-900/30' : 'bg-slate-700'}`}
            >
              <Lock className={`h-4 w-4 ${isSecure ? 'text-green-400' : 'text-gray-300'}`} />
            </motion.div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <motion.div
              className="space-y-2"
              whileFocus={{ scale: 1.02 }}
            >
              <Label htmlFor="amount" className="text-sm font-medium text-gray-300">
                Amount ($)
              </Label>
              <motion.div
                animate={{
                  borderColor: watchedAmount > 0 ? 'rgb(52, 211, 153)' : 'rgb(71, 85, 105)',
                  boxShadow: watchedAmount > 0 ? '0 0 0 1px rgba(52, 211, 153, 0.3)' : 'none'
                }}
                className="relative"
              >
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amountValue}
                  onChange={handleAmountChange}
                  onFocus={handleAmountFocus}
                  onWheel={handleAmountWheel}
                  className={cn(
                    "text-lg font-semibold pl-8 transition-all duration-200 bg-slate-700 border-slate-600 text-white placeholder:text-gray-500",
                    "[&::-webkit-outer-spin-button]:appearance-none",
                    "[&::-webkit-inner-spin-button]:appearance-none",
                    "[&::-webkit-inner-spin-button]:m-0",
                    "[-moz-appearance:textfield]",
                    "[appearance:textfield]",
                    watchedAmount > 0 && "border-green-400 focus:border-green-400"
                  )}
                />

                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold">
                  $
                </span>
              </motion.div>
              {errors.amount && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400"
                >
                  {errors.amount.message}
                </motion.p>
              )}
            </motion.div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Category</Label>
              <Select 
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setValue('category', value);
                }}
              >
                <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white placeholder:text-gray-500">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-400">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-300">
                Description (Optional)
              </Label>
              <Input
                id="description"
                placeholder="What was this for?"
                className="transition-all duration-200 focus:border-blue-400 bg-slate-700 border-slate-600 text-white placeholder:text-gray-500"
                {...register('description')}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700 dark" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={!isValid || isSecure}
                className={cn(
                  "w-full h-12 text-base font-semibold transition-all duration-200",
                  type === 'income'
                    ? "bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-gray-900"
                    : "bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-gray-900"
                )}
              >
                {isSecure ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Add {type === 'income' ? 'Income' : 'Expense'}
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}