'use client';

import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/Tracker-ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  changeLabel?: string;
  color: string;
  delay?: number;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeLabel, 
  color, 
  delay = 0 
}: StatsCardProps) {
  const formattedValue = typeof value === 'number' 
    ? value.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
    : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        y: -2,
        transition: { type: "spring", stiffness: 300 }
      }}
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
              >
                <p className="text-2xl font-bold text-gray-900">{formattedValue}</p>
              </motion.div>
              
              {change !== undefined && (
                <motion.div 
                  className="flex items-center space-x-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: delay + 0.4 }}
                >
                  {Number.isFinite(change) && (
                  <span className={`text-sm font-medium ${
                    change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {change >= 0 ? '+' : ''}{change}%
                  </span>
                  )}
                  {changeLabel && (
                    <span className="text-sm text-gray-500">{changeLabel}</span>
                  )}
                </motion.div>
              )}
            </div>
            
            <motion.div
              className="p-3 rounded-full"
              style={{ backgroundColor: `${color}20` }}
              whileHover={{ 
                scale: 1.1,
                rotate: 5,
                transition: { type: "spring", stiffness: 400 }
              }}
              animate={{
                rotate: [0, 5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: delay + 0.6
              }}
            >
              <Icon 
                className="h-6 w-6" 
                style={{ color }} 
              />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}