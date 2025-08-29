'use client';
import { motion } from 'framer-motion';
import React from 'react';

export default function CoinLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/70 z-50 overflow-hidden font-inter">
      <motion.div
        className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64"
        animate={{ rotateY: 360 }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          transformStyle: 'preserve-3d',
          perspective: 1200,
          filter: 'drop-shadow(0 12px 22px rgba(0,0,0,0.7))',
        }}
      >
        {/* Front Face */}
        <div className="absolute inset-0 flex items-center justify-center backface-hidden">
          <svg viewBox="0 0 64 64" className="w-full h-full">
            <defs>
              {/* Metallic silver body */}
              <radialGradient id="metal-silver" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f8f9fa" />
                <stop offset="50%" stopColor="#b0b8c2" />
                <stop offset="100%" stopColor="#606a76" />
              </radialGradient>

              {/* Rim base */}
              <linearGradient id="coin-rim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e6e8ea" />
                <stop offset="50%" stopColor="#8a939d" />
                <stop offset="100%" stopColor="#3a3f44" />
              </linearGradient>

              {/* Flare arc along border */}
              <radialGradient id="rim-flare" cx="50%" cy="50%" r="50%">
                <stop offset="85%" stopColor="rgba(255,255,255,0)" />
                <stop offset="92%" stopColor="rgba(255,255,255,0.9)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>

            {/* Coin rim */}
            <circle cx="32" cy="32" r="31" fill="url(#coin-rim)" />

            {/* Coin body */}
            <circle
              cx="32"
              cy="32"
              r="29"
              fill="url(#metal-silver)"
              stroke="#adb4ba"
              strokeWidth="1.5"
            />

            {/* Inner detailing */}
            <circle
              cx="32"
              cy="32"
              r="24"
              fill="none"
              stroke="#cfd4d8"
              strokeWidth="1.5"
              strokeDasharray="1 3"
            />

            {/* Rotating flare overlay on rim */}
            <motion.circle
              cx="32"
              cy="32"
              r="31"
              fill="url(#rim-flare)"
              animate={{ rotate: 360 }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ transformOrigin: 'center' }}
            />

            {/* Coin Text */}
            <text
              x="32"
              y="42"
              fontFamily="Inter, sans-serif"
              fontSize="28"
              fontWeight="bold"
              textAnchor="middle"
              fill="#2d3748"
              stroke="#1a202c"
              strokeWidth="0.8"
            >
              $F
            </text>
          </svg>
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 flex items-center justify-center backface-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <svg viewBox="0 0 64 64" className="w-full h-full">
            <defs>
              <radialGradient id="metal-gold" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff8dc" />
                <stop offset="50%" stopColor="#e6b422" />
                <stop offset="100%" stopColor="#8b7500" />
              </radialGradient>
              <linearGradient id="coin-rim-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffe066" />
                <stop offset="50%" stopColor="#b8860b" />
                <stop offset="100%" stopColor="#5c3d00" />
              </linearGradient>
              <radialGradient id="rim-flare-gold" cx="50%" cy="50%" r="50%">
                <stop offset="85%" stopColor="rgba(255,255,255,0)" />
                <stop offset="92%" stopColor="rgba(255,255,255,0.9)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>

            {/* Rim */}
            <circle cx="32" cy="32" r="31" fill="url(#coin-rim-gold)" />

            {/* Body */}
            <circle
              cx="32"
              cy="32"
              r="29"
              fill="url(#metal-gold)"
              stroke="#daa520"
              strokeWidth="1.5"
            />

            {/* Inner detail */}
            <circle
              cx="32"
              cy="32"
              r="24"
              fill="none"
              stroke="#ffd700"
              strokeWidth="1.5"
              strokeDasharray="1 3"
            />

            {/* Rotating rim flare */}
            <motion.circle
              cx="32"
              cy="32"
              r="31"
              fill="url(#rim-flare-gold)"
              animate={{ rotate: 360 }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ transformOrigin: 'center' }}
            />

            {/* Back text */}
            <text
              x="32"
              y="42"
              fontFamily="Inter, sans-serif"
              fontSize="26"
              fontWeight="bold"
              textAnchor="middle"
              fill="#2d2d2d"
              stroke="#000"
              strokeWidth="0.8"
            >
              FIN
            </text>
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
