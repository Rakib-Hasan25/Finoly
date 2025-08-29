"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ChallengeItem from "./challengeItem";
import { syncUserRewards } from "@/lib/actions/rewards";
import { useAuth } from "@/hooks/useAuth";
import { getUserByEmail } from "@/lib/actions/users";
import TreasureChestLoader from "./treasureLoading";

type RawReward = {
  userID: number;
  rewardID: number;
  title: string;
  description: string;
  points?: number | null;
  health?: number | null;
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
  points: number;
  health: number;
  status: string;
};

export function parseRewards(rawRewards: any): ParsedReward[] {
  return rawRewards.map((r: any) => {
    let rewardText = "";

    if (r.points != null && r.points > 0) {
      rewardText = `+${r.points} XP`;
    } else if (r.health != null && r.health > 0) {
      rewardText = `+${r.health} Health`;
    } else if (r.badge) {
      rewardText = `🏅 ${r.badge}`;
    }

    return {
      userID: r.userID,
      rewardID: r.rewardID,
      title: r.title,
      description: r.description,
      rewardText,
      health: r.health,
      points: r.points,
      status: r.status,
    };
  });
}

export default function DailyChallenge() {
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
      const data = await syncUserRewards(userId);
      const formdData = parseRewards(data);
      setFormattedData(formdData);
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  return (
    <div className="bg-gray-900/80 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition">
      <h2 className="text-2xl font-extrabold mb-6 text-yellow-300">
        Daily Challenges
      </h2>
      <div className="space-y-4">
        {loading ? (
          <>
            {[...Array(3)].map((_, idx) => (
              <ChallengeItemSkeleton key={idx} />
            ))}
          </>
        ) : (
          <>
            {formattedData.map((reward, idx) => (
              <ChallengeItem key={idx} {...reward} />
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
