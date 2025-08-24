import React from "react";
import RewardItem from "./rewardItem";

export default function Reward() {
  return (
    <div className="bg-gray-900/80 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition">
      <div className="flex items-center mb-6">
        {/* Gift icon for Rewards title */}
        <svg className="w-7 h-7 mr-3 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 className="text-2xl font-extrabold text-yellow-300">Rewards</h2>
      </div>

      <div className="space-y-4">
        {/* Reward Item 1: Financial Newbie Badge */}
        <RewardItem/>
        <RewardItem/>
        <RewardItem/>
        <RewardItem/>
      </div>
    </div>
  );
}
