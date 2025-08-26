'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface CoinProps {
  delay: number;
}

const Coin = ({ delay }: CoinProps) => (
  <motion.div
    className="absolute w-4 h-4 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-lg"
    initial={{ x: 0, y: 0, rotate: 0, scale: 1 }}
    animate={{ 
      x: Math.random() * 200 - 100,
      y: Math.random() * 100 + 50,
      rotate: 360,
      scale: 0.5
    }}
    transition={{
      duration: 1.5,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "spring",
      stiffness: 100,
      damping: 15
    }}
  />
);

const Bill = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute w-8 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-sm shadow-lg"
    initial={{ x: -50, y: -20, rotate: -15, scale: 0 }}
    animate={{ 
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1
    }}
    transition={{
      duration: 0.8,
      delay,
      ease: "backOut",
      type: "spring",
      stiffness: 200
    }}
  />
);

interface WalletAnimationProps {
  type: 'expense' | 'income';
  trigger: boolean;
  onAnimationComplete?: () => void;
}

export function WalletAnimation({ type, trigger, onAnimationComplete }: WalletAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  React.useEffect(() => {
    if (trigger) {
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
        onAnimationComplete?.();
      }, 2000);
    }
  }, [trigger, onAnimationComplete]);

  return (
    <div className="relative w-24 h-16 mx-auto">
      {/* Wallet Base */}
      <motion.div
        className="w-full h-full bg-gradient-to-br from-amber-800 to-amber-900 rounded-lg shadow-lg relative overflow-hidden"
        animate={{
          scale: showAnimation ? [1, 1.1, 1] : 1,
          rotateY: showAnimation && type === 'expense' ? [0, 15, 0] : 0
        }}
        transition={{ duration: 0.5 }}
      >
        {/* Wallet Flap */}
        <motion.div
          className="absolute top-0 left-0 w-full h-2 bg-amber-700 rounded-t-lg"
          animate={{
            rotateX: showAnimation ? [0, -45, 0] : 0
          }}
          transition={{ duration: 0.8 }}
        />
        
        {/* Wallet Opening */}
        <motion.div
          className="absolute top-2 left-1 right-1 h-1 bg-black/20 rounded"
          animate={{
            scaleY: showAnimation ? [1, 3, 1] : 1
          }}
          transition={{ duration: 0.8 }}
        />
      </motion.div>

      {/* Coins Animation for Expenses */}
      {showAnimation && type === 'expense' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          {[...Array(5)].map((_, i) => (
            <Coin key={i} delay={i * 0.1} />
          ))}
        </div>
      )}

      {/* Bills Animation for Income */}
      {showAnimation && type === 'income' && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          {[...Array(3)].map((_, i) => (
            <Bill key={i} delay={i * 0.2} />
          ))}
        </div>
      )}

      {/* Sparkle Effects */}
      {showAnimation && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                rotate: 360
              }}
              transition={{
                duration: 1,
                delay: Math.random() * 0.5,
                repeat: 2
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}