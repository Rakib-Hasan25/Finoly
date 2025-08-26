import React from "react";
import ChallengeItem from "./challengeItem";
import { syncUserRewards } from "@/lib/actions/rewards";



type RawReward = {
  userID : number;
  rewardID : number;
  title: string;
  description: string;
  points?: number | null;
  health?: number | null;
  badge?: string | null;
  progress?: number | null;
  status: string;
};

type ParsedReward = {
  userID : number;
  rewardID : number;
  title: string;
  description: string;
  rewardText:string;
  points : number,
  health : number,
  status : string;
};

export function parseRewards(rawRewards: any): ParsedReward[] {
  return rawRewards.map((r : any) => {
    let rewardText = "";

    if (r.points != null && r.points > 0) {
      rewardText = `+${r.points} XP`;
    } else if (r.health != null && r.health > 0) {
      rewardText = `+${r.health} Health`;
    } else if (r.badge) {
      rewardText = `🏅 ${r.badge}`;
    }

    return {
      userID : r.userID,
      rewardID : r.rewardID,
      title: r.title,
      description: r.description,
      rewardText,
      health : r.health,
      points : r.points,
      status: r.status,
    };
  });
}




export default async function DailyChallenge() {
  const data = await syncUserRewards(1);
  const formattedData = parseRewards(data);
  // console.log(data);
  // console.log(formattedData);

  return (
    <div className="bg-gray-900/80 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition">
      <h2 className="text-2xl font-extrabold mb-6 text-yellow-300">Daily Challenges</h2>
      <div className="space-y-4">
        {formattedData.map((reward, idx) => (
          <ChallengeItem key={idx} {...reward} />
        ))}
      </div>
    </div>
  );
}

