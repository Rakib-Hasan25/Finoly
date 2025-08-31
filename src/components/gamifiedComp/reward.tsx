"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RewardItem from "./rewardItem";
import { syncUserGlobalRewards } from "@/lib/actions/rewards";
import { useAuth } from "@/hooks/useAuth";
import { getUserByEmail } from "@/lib/actions/users";
import TreasureChestLoader from "./treasureLoading";

type RawReward = {
  userID: number;
  rewardID: number;
  title: string;
  description: string;
  badge?: string | null;
  progress?: number | null;
  status: string;
};

type ParsedReward = {
  userID: number;
  rewardID: number;
  title: string;
  description: string;
  rewardText: string;
  badge: string;
  status: string;
};

export function parseRewards(rawRewards: any): ParsedReward[] {
  return rawRewards.map((r: any) => {
    let rewardText = "";

    rewardText = `🏅 ${r.badge}`;

    return {
      userID: r.userID,
      rewardID: r.rewardID,
      title: r.title,
      description: r.description,
      rewardText,
      badge: r.badge,
      status: r.status,
    };
  });
}

export default function Reward() {
  const { user } = useAuth();
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [formattedData, setFormattedData] = useState<ParsedReward[]>([]);
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
    const fetchData = async () => {
      setLoading(true);
      const data = await syncUserGlobalRewards(userId);
      const formdData = parseRewards(data);
      setFormattedData(formdData);
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  return (
    <div className="bg-cyan-900/20 p-6 border-white backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition">
      <div className="flex items-center mb-6">
        {/* Gift icon for Rewards title */}
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h2 className="text-2xl font-extrabold text-yellow-300">Rewards</h2>
      </div>

      <div className="space-y-4">
        {/* Reward Item 1: Financial Newbie Badge */}
        {loading ? (
          <>
            {[...Array(4)].map((_, idx) => (
              <ChallengeItemSkeleton key={idx} />
            ))}
          </>
        ) : (
          <>
            {formattedData.map((reward, idx) => (
              <RewardItem key={idx} {...reward} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export function ChallengeItemSkeleton() {
  return (
    <div className="bg-gray-800/70 p-4 rounded-xl shadow-md animate-pulse">
      {/* Title */}
      <div className="flex items-center mb-2">
        <div className="h-5 w-40 bg-gray-700 rounded-md" />
        <div className="h-4 w-4 bg-gray-700 rounded-full ml-2" />
      </div>

      {/* Description */}
      <div className="h-3 w-60 bg-gray-700 rounded-md mb-4" />
      <div className="h-3 w-40 bg-gray-700 rounded-md mb-4" />

      {/* Reward Button */}
      <div className="h-6 w-24 bg-gray-700 rounded-full" />
    </div>
  );
}
