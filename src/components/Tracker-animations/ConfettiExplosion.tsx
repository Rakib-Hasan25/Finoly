'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ConfettiParticleProps {
  delay: number;
}

const ConfettiParticle = ({ delay }: ConfettiParticleProps) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = Math.random() * 8 + 4;
  const xOffset = (Math.random() - 0.5) * 400;
  const yOffset = Math.random() * 200 + 100;
  
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        backgroundColor: color,
        width: size,
        height: size
      }}
      initial={{ 
        x: 0, 
        y: 0, 
        opacity: 1, 
        scale: 0, 
        rotate: 0 
      }}
      animate={{ 
        x: xOffset,
        y: yOffset,
        opacity: 0,
        scale: 1,
        rotate: 720
      }}
      transition={{
        duration: 3,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    />
  );
};

interface ConfettiExplosionProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function ConfettiExplosion({ trigger, onComplete }: ConfettiExplosionProps) {
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      const timer = setTimeout(() => {
        setIsActive(false);
        onComplete?.();
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);
  
  if (!isActive) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="relative">
        {/* Central burst */}
        <motion.div
          className="w-8 h-8 bg-yellow-400 rounded-full"
          initial={{ scale: 0 }}
          animate={{ 
            scale: [0, 2, 0],
            backgroundColor: ['#FBBF24', '#F59E0B', '#D97706']
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Confetti particles */}
        {[...Array(50)].map((_, i) => (
          <ConfettiParticle key={i} delay={i * 0.02} />
        ))}
        
        {/* Firework trails */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`trail-${i}`}
            className="absolute w-1 h-12 bg-gradient-to-t from-yellow-400 to-transparent"
            style={{
              transformOrigin: 'bottom center',
              rotate: i * 45
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ 
              scaleY: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 1,
              delay: 0.2,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    </div>
  );
}