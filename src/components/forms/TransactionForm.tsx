'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
import { WalletAnimation } from '@/components/Tracker-animations/WalletAnimation';
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

export function TransactionForm({ type, categories, onSubmit, className }: TransactionFormProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [showWalletAnimation, setShowWalletAnimation] = useState(false);
  const [isSecure, setIsSecure] = useState(false);

  const { register, handleSubmit, formState: { errors, isValid }, reset, setValue, watch } = useForm<FormData>({
    defaultValues: {
      date: new Date(),
      description: '',
      amount: 0,
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
    setShowWalletAnimation(true);
    
    // Simulate processing delay
    setTimeout(() => {
      onSubmit(transaction);
      reset();
      setDate(new Date());
      setIsSecure(false);
    }, 1500);
  };

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Add {type === 'income' ? 'Income' : 'Expense'}
          </CardTitle>
          
          {/* Security Indicator */}
          <motion.div
            animate={{
              scale: isSecure ? [1, 1.2, 1] : 1,
              rotate: isSecure ? [0, 360] : 0
            }}
            transition={{ duration: 0.5 }}
            className={`p-2 rounded-full ${isSecure ? 'bg-green-100' : 'bg-gray-100'}`}
          >
            <Lock className={`h-4 w-4 ${isSecure ? 'text-green-600' : 'text-gray-400'}`} />
          </motion.div>
        </div>
        
        {/* Wallet Animation */}
        <div className="mt-4">
          <WalletAnimation 
            type={type} 
            trigger={showWalletAnimation}
            onAnimationComplete={() => setShowWalletAnimation(false)}
          />
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Amount Input */}
          <motion.div 
            className="space-y-2"
            whileFocus={{ scale: 1.02 }}
          >
            <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
              Amount ($)
            </Label>
            <motion.div
              animate={{
                borderColor: watchedAmount > 0 ? 'rgb(34, 197, 94)' : 'rgb(209, 213, 219)',
                boxShadow: watchedAmount > 0 ? '0 0 0 1px rgba(34, 197, 94, 0.3)' : 'none'
              }}
              className="relative"
            >
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className={cn(
                  "text-lg font-semibold pl-8 transition-all duration-200",
                  watchedAmount > 0 && "border-green-400 focus:border-green-500"
                )}
                {...register('amount', { 
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than 0' }
                })}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold">
                $
              </span>
            </motion.div>
            {errors.amount && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600"
              >
                {errors.amount.message}
              </motion.p>
            )}
          </motion.div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Category</Label>
            <Select onValueChange={(value) => setValue('category', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description (Optional)
            </Label>
            <Input
              id="description"
              placeholder="What was this for?"
              className="transition-all duration-200 focus:border-blue-400"
              {...register('description')}
            />
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Submit Button */}
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
                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
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
  );
}