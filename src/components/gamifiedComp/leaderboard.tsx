"use client";
import { useAuth } from "@/hooks/useAuth";
import { getLeaderboard, getUserByEmail, Player } from "@/lib/actions/users";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";


// Leaderboard Skeleton
function LeaderboardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-800/70 p-4 rounded-xl shadow-md flex items-center justify-between"
        >
          {/* Left side: rank + name */}
          <div className="flex items-center">
            {/* Rank */}
            <div className="h-6 w-10 bg-gray-700 rounded-md mr-4" />
            {/* Name */}
            <div className="h-6 w-32 bg-gray-700 rounded-md" />
          </div>
          {/* Right side: score */}
          <div className="h-5 w-20 bg-gray-700 rounded-md" />
        </div>
      ))}
    </div>
  );
}


export default function Leaderboard() {
  const { user } = useAuth();
  const [userId, setUserId] = useState<number | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch userId from email
  useEffect(() => {
    const fetchUserId = async () => {
      if (user?.email) {
        const userData = await getUserByEmail(user.email);
        setUserId(userData?.id ?? null);
      }
    };
    fetchUserId();
  }, [user]);

  // Fetch leaderboard only when userId is available
  useEffect(() => {
    if (!userId) return; // wait until userId is set
    const fetchData = async () => {
      setLoading(true);
      const data = await getLeaderboard(userId);
      setLeaderboardData(data);
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  return (
    <div className="bg-gray-900/80 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition">
      <div className="flex items-center mb-6">
        <svg
          className="w-7 h-7 mr-3 text-yellow-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"
          ></path>
        </svg>
        <h2 className="text-2xl font-extrabold text-yellow-300">Leaderboard</h2>
      </div>

      <div className="space-y-4">
        {loading ? (
          <LeaderboardSkeleton />
        ) : (
          <>
            {leaderboardData.map((player) => (
              <div
                key={player.id}
                className="bg-gray-800/70 p-4 rounded-xl shadow-md flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="text-xl font-bold text-white mr-4 w-10 text-center">
                    {player.rank}
                  </span>
                  <p className="text-lg font-semibold text-white">
                    {player.id == userId ? "You" :  player.name}
                  </p>
                </div>
                <span className="text-md font-medium text-yellow-400">
                  {player.score} XP
                </span>
              </div>
            ))}{" "}
          </>
        )}
      </div>
    </div>
  );
}
