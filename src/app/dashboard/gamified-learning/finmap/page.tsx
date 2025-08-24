'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, Variants } from 'framer-motion';

export default function LevelsPage() {
  const [currentLevel] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  const levels = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Level ${i + 1}: Financial Mastery ${i + 1}`,
    completed: i + 1 < currentLevel,
    isCurrent: i + 1 === currentLevel,
    isCheckpoint: (i + 1) % 5 === 0,
  }));

  // Scroll to current level on mount
  useEffect(() => {
    if (containerRef.current) {
      const currentEl = containerRef.current.querySelector(`[data-level="${currentLevel}"]`) as HTMLElement | null;
      if (currentEl) {
        // Use scrollIntoView to smoothly bring the current level into the center of the view
        currentEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentLevel]); // Dependency on currentLevel to re-scroll if it changes

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.85 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      x: i % 2 === 0 ? 50 : -50, // Zigzag horizontal positioning
      translateZ: -i * 50, // Reintroduced Z-axis depth: levels recede as 'i' increases
      scale: 1,
      zIndex: levels.length - i, // Correct zIndex for visual layering (lower levels appear on top)
      transition: { duration: 0.6, ease: 'easeInOut', delay: i * 0.1 },
    }),
    hover: { scale: 1.05, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const rewardVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 10, delay: 0.5 } },
  };

  const glowVariants: Variants = {
    hidden: { boxShadow: '0 0 0 rgba(255, 215, 0, 0)' },
    visible: {
      boxShadow: '0 0 25px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.5)',
      transition: { duration: 1, repeat: Infinity, repeatType: 'reverse' as 'reverse' },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-800 flex flex-col items-center justify-start px-6 py-12 perspective-1500 overflow-visible">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-12 drop-shadow-lg">Level Journey</h1>

      {/* Levels container - now explicitly w-1/2 for all screen sizes */}
      <div
        ref={containerRef}
        className="relative w-1/2 flex flex-col-reverse gap-12 overflow-y-scroll scrollbar-none pb-12"
        style={{ transformStyle: 'preserve-3d', perspective: 1500 }}
      >
        {levels.map((level, i) => (
          <motion.div
            key={level.id}
            data-level={level.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            // Allow hover effect for completed and current levels
            whileHover={level.completed || level.isCurrent ? 'hover' : undefined}
            className={`relative p-6 rounded-xl text-center transform-gpu ${
              level.completed
                ? 'bg-gradient-to-r from-green-600 to-teal-700 text-white shadow-2xl hover:shadow-3xl cursor-pointer' // Add cursor-pointer for clickable levels
                : level.isCurrent
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-2xl ring-4 ring-blue-400 animate-pulse cursor-pointer' // Changed to cursor-pointer for current level
                : 'bg-gray-800 text-gray-400 shadow-md cursor-not-allowed opacity-70' // Already has cursor-not-allowed
            }`}
            style={{ transformStyle: 'preserve-3d', zIndex: levels.length - i }}
          >
            {/* Conditionally render <a> tag if the level is completed OR if it's the current level */}
            {level.completed || level.isCurrent ? (
              <a href={`/lesson/${level.id}`} className="block relative z-10">
                <span className="block text-2xl font-bold mb-1">{level.name}</span>
                <span className="block text-sm text-gray-200">
                  {level.completed ? 'Completed' : 'Current Level'}
                </span>
              </a>
            ) : (
              // If not completed or current, render a div to prevent click navigation
              <div className="block relative z-10">
                <span className="block text-2xl font-bold mb-1">{level.name}</span>
                <span className="block text-sm text-gray-200">
                  {'Locked'}
                </span>
              </div>
            )}

            {level.isCheckpoint && level.completed && (
              <motion.div
                variants={rewardVariants}
                initial="hidden"
                animate="visible"
                className="absolute -top-5 -right-5 w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-3xl text-black font-extrabold shadow-lg border-2 border-white z-20"
              >
                🎉
              </motion.div>
            )}

            {level.isCheckpoint && (
              <motion.div
                variants={glowVariants}
                animate={level.completed ? 'visible' : 'hidden'}
                className="absolute inset-0 rounded-xl z-0"
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Bottom Buttons */}
      <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 w-full max-w-xl z-10">
        <a href="/">
          <button className="w-full sm:w-auto px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-transform transform hover:scale-105 active:scale-95">
            Back to Home
          </button>
        </a>
        <a href={`/lesson/${currentLevel}`}>
          <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition-transform transform hover:scale-105 active:scale-95">
            Start Current Lesson
          </button>
        </a>
      </div>

      {/* Hidden scrollbar */}
      <style jsx>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}