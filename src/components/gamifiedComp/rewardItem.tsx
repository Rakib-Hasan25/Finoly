"use client"; 
import React, { useState } from "react";
import { updateUserRewardStatus } from "@/lib/actions/rewards";
import { getUser, updateUser } from "@/lib/actions/users";


const badgeLevels: Record<string, number> = {
 "Unrated": 0,
 "Newbie": 1,
 "Skilled": 2,
 "Master": 3,
 "Perfectionist": 4,
};

interface RewardItemProp {
  userID : number;
  rewardID : number;
  title: string;
  description: string;
  rewardText: string;
  badge: string;
  status: string; // e.g. "pending" | "completed" | "claimed"
}

export default function RewardItem(item: RewardItemProp) {
 const [currentReward, setCurrentReward] = useState({
  userID : item.userID,
  rewardID : item.rewardID,
  title: item.title,
  description: item.description,
  rewardText: item.rewardText,
  badge : item.badge,
  status: item.status,
  claimed: item.status === "CLAIMED",
  done: item.status === "COMPLETE" || item.status === "CLAIMED",
 });

 const isDoneButNotClaimed = currentReward.done && !currentReward.claimed;
 const isClaimed = currentReward.done && currentReward.claimed;

 const itemClasses = `
  bg-gray-800/70 p-4 rounded-xl shadow-md
  ${isDoneButNotClaimed ? "animate-flicker" : ""}
  ${isClaimed ? "bg-green-800/70" : ""}
 `;

 const titleClasses = `
  text-lg font-semibold flex items-center mb-1
  ${isDoneButNotClaimed ? "text-yellow-400" : "text-white"}
 `;

 // Handle claim like ChallengeItem
 const handleClaim = async () => {
  if (isDoneButNotClaimed) {
    const { badge } = await getUser(currentReward.userID);
    const newBadgeLevel = badgeLevels[currentReward.badge] || 0;
    const currentBadgeLevel = badgeLevels[badge] || 0;
    const updatedBadge = newBadgeLevel > currentBadgeLevel ? currentReward.badge : badge;
    const data = {
      badge: updatedBadge,
    };
    await updateUser(currentReward.userID, data);
    await updateUserRewardStatus(currentReward.userID, currentReward.rewardID, "CLAIMED");
    setCurrentReward({ ...currentReward, claimed: true, status: "CLAIMED" });
  }
 };

 return (
  <div className={itemClasses}>
   <style>{`
     @keyframes flicker {
       0%, 100% { opacity: 1; }
       50% { opacity: 0.8; }
     }
     .animate-flicker {
       animation: flicker 1.5s infinite alternate;
     }
   `}</style>

   {/* Title + Icon */}
   <h3 className={titleClasses}>
    {currentReward.title}
    {!isDoneButNotClaimed &&
     (isClaimed ? (
      <svg
       className="w-4 h-4 ml-2 text-green-400"
       fill="none"
       stroke="currentColor"
       viewBox="0 0 24 24"
       xmlns="http://www.w3.org/2000/svg"
      >
       <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
       ></path>
      </svg>
     ) : (
      <svg
       className="w-4 h-4 ml-2 text-gray-400"
       fill="none"
       stroke="currentColor"
       viewBox="0 0 24 24"
       xmlns="http://www.w3.org/2000/svg"
      >
       <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm0-11V6a4 4 0 014-4h4a4 4 0 014 4v3"
       ></path>
      </svg>
     ))}
   </h3>

   {/* Description */}
   <p className="text-gray-400 text-sm mb-3">{currentReward.description}</p>

   {/* Reward Button */}
   <button
    onClick={handleClaim}
    disabled={!isDoneButNotClaimed}
    className={`
      inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition
      ${
       isClaimed
        ? "bg-green-600/80 text-white cursor-not-allowed opacity-80"
        : isDoneButNotClaimed
        ? "bg-yellow-600 text-white hover:bg-yellow-500"
        : "bg-gray-600 text-white cursor-not-allowed"
      }
    `}
   >
    { currentReward.rewardText }
   </button>
  </div>
 );
}
