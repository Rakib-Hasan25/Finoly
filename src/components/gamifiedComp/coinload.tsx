'use client';
import { motion } from 'framer-motion';
import React from 'react';

export default function CoinLoading() {
  return (
    // Full screen overlay with a dark, semi-transparent background consistent with other components
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/70 z-50 overflow-hidden font-inter">
      {/* Animated Coin with $F Icon */}
      <motion.svg
        className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64" // Large and responsive sizing for the coin
        viewBox="0 0 64 64" // Standard viewBox for our coin design
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ rotateY: 360 }} // Continuous rotation animation around the Y-axis
        transition={{
          duration: 3, // Duration for one full rotation
          repeat: Infinity, // Repeat indefinitely
          ease: 'linear', // Consistent speed throughout the rotation
        }}
        style={{
          filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.6))' // Add a more prominent shadow for depth
        }}
      >
        <defs>
          {/* Radial gradient for a cool, aesthetic, materialistic silver look */}
          <radialGradient id="grad-main-rotating-coin" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E6E8EA" /> {/* Brightest silver highlight */}
            <stop offset="60%" stopColor="#A5B0B8" /> {/* Main metallic silver body */}
            <stop offset="100%" stopColor="#6C7A89" /> {/* Darker, cool gray for shadow/depth */}
          </radialGradient>
        </defs>
        {/* Main circular body of the coin, filled with the silver radial gradient */}
        <circle cx="32" cy="32" r="30" fill="url(#grad-main-rotating-coin)" stroke="#8E9DA8" strokeWidth="2" /> {/* Silver stroke */}
        {/* Inner dashed circle for additional visual detail/texture */}
        <circle cx="32" cy="32" r="25" fill="none" stroke="#B0BCC7" strokeWidth="1.5" strokeDasharray="1 3" /> {/* Lighter silver inner stroke */}
        {/* Ellipse to simulate a subtle specular highlight on the coin's surface */}
        <ellipse cx="24" cy="24" rx="6" ry="3" fill="rgba(255,255,255,0.5)" />
        {/* Text "$F" in the center of the coin */}
        <text
          x="32"
          y="42" // Adjusted y to be more visually centered
          fontFamily="Inter, sans-serif"
          fontSize="28" // Larger font size for prominence
          fontWeight="bold"
          textAnchor="middle" // Center horizontally
          fill="#2D3748" // Dark gray for good contrast on silver
          stroke="#1A202C" // Subtle dark stroke for readability
          strokeWidth="0.8"
        >
          $F
        </text>
      </motion.svg>
    </div>
  );
}
