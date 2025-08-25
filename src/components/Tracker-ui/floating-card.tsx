'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FloatingCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FloatingCard({ children, delay = 0, className = '' }: FloatingCardProps) {
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow ${className}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        y: -2,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300 }
      }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  );
}