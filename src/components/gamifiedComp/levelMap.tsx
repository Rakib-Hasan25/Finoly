"use client";
import { useEffect, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";
import { getLevels } from "@/lib/actions/level";
import { useRouter } from "next/navigation";

interface LevelMapProps {
  courseId: string;
}

export default function LevelsPage({ courseId }: LevelMapProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [levels, setLevels] = useState<any[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const levelsData = await getLevels(courseId);
        setLevels(
          levelsData.map((level, index) => ({
            id: level.id,
            name: level.title,
            description: level.description,
            completed: index + 1 < currentLevel,
            isCurrent: index + 1 === currentLevel,
            isCheckpoint: (index + 1) % 5 === 0,
            order: level.level_no,
          }))
        );
      } catch (error) {
        console.error("Error fetching levels:", error);
      }
    };
    fetchLevels();
  }, [courseId]);

  useEffect(() => {
    if (containerRef.current) {
      const currentEl = containerRef.current.querySelector(
        `[data-level="${currentLevel}"]`
      ) as HTMLElement | null;
      if (currentEl)
        currentEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentLevel]);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.85 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      x: i % 2 === 0 ? 50 : -50,
      scale: 1,
      zIndex: levels.length - i,
      transition: { duration: 0.6, ease: "easeInOut", delay: i * 0.1 },
    }),
    hover: { scale: 1.07, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const rewardVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 10, delay: 0.5 },
    },
  };

  const glowVariants: Variants = {
    hidden: { boxShadow: "0 0 0 rgba(255, 215, 0, 0)" },
    visible: {
      boxShadow:
        "0 0 25px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.5)",
      transition: { duration: 1, repeat: Infinity, repeatType: "reverse" },
    },
  };

  return (
    <div className="bg-gradient-to-b from-[#1c004d] via-[#101b4d] to-[#081229] flex flex-col items-center w-full h-full perspective-1500 overflow-hidden p-4">
      <div
        ref={containerRef}
        className="relative w-full max-w-lg flex flex-col-reverse gap-10 overflow-y-scroll scrollbar-none pb-12 flex-grow"
        style={{ transformStyle: "preserve-3d", perspective: 1500 }}
      >
        {levels.map((level, i) => (
          <motion.div
            key={level.id}
            data-level={level.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={
              level.completed || level.isCurrent ? "hover" : undefined
            }
            className={`relative p-5 rounded-2xl text-center transform-gpu shadow-lg ${
              level.completed
                ? "bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-xl cursor-pointer"
                : level.isCurrent
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl ring-4 ring-blue-300 animate-pulse cursor-pointer"
                : "bg-gray-800/80 text-gray-400 cursor-not-allowed opacity-60"
            }`}
            style={{ zIndex: levels.length - i }}
          >
            {level.completed || level.isCurrent ? (
              <a
                href={`/dashboard/gamified-learning/lesson/${level.id}`}
                className="block relative z-10"
              >
                <span className="block text-lg font-semibold mb-1">
                  {level.name}
                </span>
                <span className="block text-sm text-gray-200">
                  {level.completed ? "Completed" : "Current Level"}
                </span>
              </a>
            ) : (
              <div className="block relative z-10">
                <span className="block text-lg font-bold mb-1">
                  {level.name}
                </span>
                <span className="block text-sm text-gray-300">Locked</span>
              </div>
            )}

            {level.isCheckpoint && level.completed && (
              <motion.div
                variants={rewardVariants}
                initial="hidden"
                animate="visible"
                className="absolute -top-6 -right-6 w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-3xl text-black font-extrabold shadow-lg border-2 border-white"
              >
                🎉
              </motion.div>
            )}

            {level.isCheckpoint && (
              <motion.div
                variants={glowVariants}
                animate={level.completed ? "visible" : "hidden"}
                className="absolute inset-0 rounded-2xl z-0"
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Hide Scrollbar */}
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
