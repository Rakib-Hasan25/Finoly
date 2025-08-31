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
              {/* Metallic bluish silver */}
              <radialGradient id="metal-blue-silver" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f0f4f9" />
                <stop offset="40%" stopColor="#a5b9d6" />
                <stop offset="80%" stopColor="#5b7a99" />
                <stop offset="100%" stopColor="#2c3e50" />
              </radialGradient>

              {/* Rim base bluish steel */}
              <linearGradient id="coin-rim-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0e7f1" />
                <stop offset="50%" stopColor="#6c7a89" />
                <stop offset="100%" stopColor="#2f3640" />
              </linearGradient>

              {/* Rim flare */}
              <radialGradient id="rim-flare-blue" cx="50%" cy="50%" r="50%">
                <stop offset="85%" stopColor="rgba(255,255,255,0)" />
                <stop offset="92%" stopColor="rgba(180,200,255,0.9)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>

            {/* Coin rim */}
            <circle cx="32" cy="32" r="31" fill="url(#coin-rim-blue)" />

            {/* Coin body */}
            <circle
              cx="32"
              cy="32"
              r="29"
              fill="url(#metal-blue-silver)"
              stroke="#8a99ab"
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

            {/* Rotating rim flare */}
            <motion.circle
              cx="32"
              cy="32"
              r="31"
              fill="url(#rim-flare-blue)"
              animate={{ rotate: 360 }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ transformOrigin: 'center' }}
            />

            {/* Bangladeshi Taka Icon */}
            <text
              x="32"
              y="42"
              fontFamily="Inter, sans-serif"
              fontSize="32"
              fontWeight="bold"
              textAnchor="middle"
              fill="#1c2733"
              stroke="#eaf2ff"
              strokeWidth="1.2"
            >
              ৳
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
              {/* Darker metallic blue */}
              <radialGradient id="metal-blue-dark" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f5f7fa" />
                <stop offset="40%" stopColor="#7f8fa6" />
                <stop offset="80%" stopColor="#4a6278" />
                <stop offset="100%" stopColor="#1e272e" />
              </radialGradient>
              <linearGradient id="coin-rim-blue-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dcdde1" />
                <stop offset="50%" stopColor="#718093" />
                <stop offset="100%" stopColor="#2f3640" />
              </linearGradient>
              <radialGradient id="rim-flare-blue-dark" cx="50%" cy="50%" r="50%">
                <stop offset="85%" stopColor="rgba(255,255,255,0)" />
                <stop offset="92%" stopColor="rgba(180,200,255,0.8)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>

            {/* Rim */}
            <circle cx="32" cy="32" r="31" fill="url(#coin-rim-blue-dark)" />

            {/* Body */}
            <circle
              cx="32"
              cy="32"
              r="29"
              fill="url(#metal-blue-dark)"
              stroke="#7f8c9a"
              strokeWidth="1.5"
            />

            {/* Inner detail */}
            <circle
              cx="32"
              cy="32"
              r="24"
              fill="none"
              stroke="#9daab5"
              strokeWidth="1.5"
              strokeDasharray="1 3"
            />

            {/* Rotating rim flare */}
            <motion.circle
              cx="32"
              cy="32"
              r="31"
              fill="url(#rim-flare-blue-dark)"
              animate={{ rotate: 360 }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ transformOrigin: 'center' }}
            />

            {/* Back Taka Icon */}
            <text
              x="32"
              y="42"
              fontFamily="Inter, sans-serif"
              fontSize="32"
              fontWeight="bold"
              textAnchor="middle"
              fill="#1c2733"
              stroke="#eaf2ff"
              strokeWidth="1.2"
            >
              ৳
            </text>
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
