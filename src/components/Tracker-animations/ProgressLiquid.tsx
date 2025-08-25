'use client';

import { motion } from 'framer-motion';

interface ProgressLiquidProps {
  percentage: number;
  color?: string;
  height?: string;
  className?: string;
}

export function ProgressLiquid({ 
  percentage, 
  color = 'rgb(87, 204, 2)', 
  height = '40px',
  className = ''
}: ProgressLiquidProps) {
  const safePercentage = Number.isFinite(percentage) ? percentage : 0;
  const clampedPercentage = Math.max(0, Math.min(100, safePercentage));
  
  return (
    <div 
      className={`relative bg-gray-200 rounded-full overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Liquid Progress */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 rounded-full"
        style={{ backgroundColor: color }}
        initial={{ height: '0%' }}
        animate={{ height: `${clampedPercentage}%` }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          type: "spring",
          stiffness: 50
        }}
      >
        {/* Wave Effect */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-30"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
            borderRadius: 'inherit'
          }}
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Bubbles */}
        {clampedPercentage > 10 && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/40 rounded-full"
                style={{
                  left: `${20 + i * 30}%`,
                  bottom: '10%'
                }}
                animate={{
                  y: [-10, -30, -10],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </>
        )}
      </motion.div>
      
      {/* Percentage Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span 
          className="text-sm font-semibold text-white mix-blend-difference"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(clampedPercentage)}%
        </motion.span>
      </div>
    </div>
  );
}