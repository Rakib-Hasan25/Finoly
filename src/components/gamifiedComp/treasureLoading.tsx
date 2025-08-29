'use client';
import { motion, Variants } from 'framer-motion';
import React from 'react';

// Animation variants for the treasure chest lid
const lidVariants: Variants = {
  closed: { rotateX: 0, y: 0 },
  open: { rotateX: -60, y: -10, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Animation variants for the bursting particles
const particleVariants: Variants = {
  hidden: { opacity: 0, y: 0, x: 0, scale: 0.5 },
  visible: (i: number) => ({
    opacity: [0, 1, 0],
    y: [0, -50 - Math.random() * 50, -100 - Math.random() * 50],
    x: [0, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 100],
    scale: [0.5, 1, 0.8],
    transition: {
      duration: 1.5 + Math.random() * 0.5,
      ease: ['easeInOut'], // Framer Motion requires array or Easing type
      delay: i * 0.05,
      repeat: Infinity,
      repeatDelay: 1,
    },
  }),
};

export default function TreasureChestLoader() {
  const particleCount = 15;
  const particles = Array.from({ length: particleCount }, (_, i) => i);

  return (
    <div className="flex items-center justify-center w-full h-full font-inter">
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center">
        {/* Treasure Chest SVG */}
        <motion.svg
          className="absolute w-full h-full"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial="closed"
          animate="open"
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'loop',
            repeatDelay: 1.5,
            ease: 'easeOut',
          }}
          style={{
            filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.4))',
            transformStyle: 'preserve-3d',
            transformOrigin: '50% 50%',
          }}
        >
          {/* Chest Body */}
          <rect x="25" y="80" width="150" height="80" rx="10" fill="#8B4513" stroke="#5A2D0C" strokeWidth="4" />
          {/* Lock */}
          <rect x="90" y="100" width="20" height="30" rx="5" fill="#D4AF37" stroke="#A66C00" strokeWidth="2" />

          {/* Chest Lid */}
          <motion.g
            variants={lidVariants}
            initial="closed"
            animate="open"
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: 'reverse',
              repeatDelay: 1.5,
              ease: 'easeOut',
            }}
            style={{
              transformOrigin: '50% 80%',
            }}
          >
            <path
              d="M25 80 C25 60 50 50 100 50 C150 50 175 60 175 80 L175 90 L25 90 L25 80Z"
              fill="#A0522D"
              stroke="#663300"
              strokeWidth="4"
            />
            <path
              d="M100 50 C90 45 110 45 100 50"
              fill="#D4AF37"
              stroke="#A66C00"
              strokeWidth="2"
            />
          </motion.g>
        </motion.svg>

        {/* Bursting Particles */}
        {particles.map((i) => (
          <motion.div
            key={i}
            className="absolute"
            variants={particleVariants}
            initial="hidden"
            animate="visible"
            custom={i}
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#FFD700',
              borderRadius: '50%',
              top: '50%',
              left: '50%',
              marginTop: '10px',
              marginLeft: '-5px',
              opacity: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
