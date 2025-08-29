'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
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
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm transition-colors hover:bg-slate-700/60 shadow-lg hover:shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-300">{title}</p>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
              >
                <p className="text-2xl font-bold text-white">{formattedValue}</p>
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
                      change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {change >= 0 ? '+' : ''}{change}%
                    </span>
                  )}
                  {changeLabel && (
                    <span className="text-sm text-gray-400">{changeLabel}</span>
                  )}
                </motion.div>
              )}
            </div>
            
            <motion.div
              className="p-3 rounded-full bg-slate-700/50 border border-slate-600/50"
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