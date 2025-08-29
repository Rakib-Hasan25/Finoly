"use client";
import { useEffect, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";
import { getLevels } from "@/lib/actions/level";
import { useRouter } from "next/navigation";
import { getUserLevelProgressAll } from "@/lib/actions/user-level-progress";
import { useAuth } from "@/hooks/useAuth";
import { getUserByEmail } from "@/lib/actions/users";
import FinanceLevelLoader from "./levelLoader";

interface LevelMapProps {
  courseId: string;
}

export default function LevelsPage({ courseId }: LevelMapProps) {
  const { user } = useAuth();
  const [userId, setUserId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [levels, setLevels] = useState<any[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchUserId = async () => {
      if (user?.email) {
        const userData = await getUserByEmail(user.email);
        setUserId(userData?.id ?? null);
      }
    };
    fetchUserId();
  }, [user]);

  useEffect(() => {
    if (!userId) return;
    const fetchLevels = async () => {
      try {
        const levelsData = await getLevels(courseId);
        const userLevels = await getUserLevelProgressAll(userId);
        const completedLevels = new Map(
          userLevels.map((ul) => [ul.level_id, ul]) // map level_id → userLevel object
        );

        let maxCompletedLevel = 0;
        userLevels.forEach((ul) => {
          if (ul.status === "completed" && ul.level_id > maxCompletedLevel) {
            maxCompletedLevel = ul.level_id;
          }
        });
        // console.log(userLevels);
        // console.log(levelsData);
        let foundCurrent = false;
        setLevels(
          levelsData.map((level, index) => {
            const userLevel = completedLevels.get(level.id);
            const isCompleted = !!userLevel && userLevel.status === "completed";
            const isCurrent =
              level.id >= maxCompletedLevel + 1 && !foundCurrent;
            if (isCurrent) foundCurrent = true;
            if (isCurrent) setCurrentLevel(level.id);

            return {
              id: level.id,
              name: level.title,
              description: level.description,
              completed: isCompleted,
              score: isCompleted ? userLevel.score : null,
              isCurrent: isCurrent,
              isCheckpoint: (index + 1) % 5 === 0,
              order: level.level_no,
            };
          })
        );
      } catch (error) {
        console.error("Error fetching levels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLevels();
  }, [userId]);

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
        {loading ? (
          <FinanceLevelSkeleton />
        ) : (
          <>
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
                      {level.completed
                        ? `${level.score} / 100`
                        : "Current Level"}
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
          </>
        )}
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

function FinanceLevelSkeleton() {
  const skeletonCount = 6; // how many skeleton cards to show
  return (
    <div className="relative w-full max-w-lg flex flex-col-reverse gap-10 pb-12 flex-grow">
      {[...Array(skeletonCount)].map((_, i) => (
        <div
          key={i}
          className={`relative p-5 rounded-2xl shadow-lg bg-gray-700/50 animate-pulse`}
          style={{
            transform: `translateX(${i % 2 === 0 ? 50 : -50}px)`,
            zIndex: skeletonCount - i,
          }}
        >
          {/* Title placeholder */}
          <div className="h-5 w-32 bg-gray-600 rounded mx-auto mb-2"></div>
          {/* Subtitle placeholder */}
          <div className="h-3 w-20 bg-gray-600 rounded mx-auto"></div>

          {/* Checkpoint badge placeholder */}
          {i % 5 === 4 && (
            <div className="absolute -top-6 -right-6 w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-500"></div>
          )}
        </div>
      ))}
    </div>
  );
}
