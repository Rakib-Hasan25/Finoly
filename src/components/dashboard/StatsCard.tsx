import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as TrendingUp, TrendingDown } from 'lucide-react';
import { FloatingCard } from '@/components/Tracker-ui/floating-card';
import {LucideIcon} from "lucide-react";


interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change: number;
  // changeLabel: string;
  color: string;
  delay?: number;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  change,
  color, 
  delay = 0 
}: StatsCardProps) {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  
  const trendColor = isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-gray-400';
  const trendBgColor = isPositive ? 'bg-green-400/10' : isNegative ? 'bg-red-400/10' : 'bg-gray-400/10';

  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    if (title.toLowerCase().includes('rate')) return `${val.toFixed(1)}%`;
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <FloatingCard className="p-6 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${color}20` }}
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Icon 
                className="h-6 w-6" 
                style={{ color }} 
              />
            </motion.div>
            <h3 className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
              {title}
            </h3>
          </div>
          
          {/* Trend Indicator */}
          {/* {change !== 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.3 }}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full ${trendBgColor}`}
            >
              <TrendIcon className={`h-3 w-3 ${trendColor}`} />
              <span className={`text-xs font-medium ${trendColor}`}>
                {Math.abs(change).toFixed(1)}%
              </span>
            </motion.div>
          )} */}
        </div>

        <div className="space-y-2">
          <motion.p
            className="text-2xl md:text-3xl font-bold text-white"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
          >
            {formatValue(value)}
          </motion.p>
          
          {/* <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.4 }}
            className="text-sm text-gray-400"
          >
            {changeLabel}
          </motion.p> */}
        </div>

        {/* Animated background glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`
          }}
        />
      </FloatingCard>
    </motion.div>
  );
}