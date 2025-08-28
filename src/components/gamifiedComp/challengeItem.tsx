"use client";
import { updateUserRewardStatus } from "@/lib/actions/rewards";
import { getUser, updateUser } from "@/lib/actions/users";
import React, { useState } from "react";

interface ChallengeItemProp {
  userID : number;
  rewardID : number;
  title: string;
  description: string;
  rewardText: string;
  health : number;
  points : number;
  status: string; // e.g. "pending" | "completed" | "claimed"
}

export default function ChallengeItem(item: ChallengeItemProp) {
  // ✅ initialize from props instead of static challenge
  const [currentChallenge, setCurrentChallenge] = useState({
    userID : item.userID,
    rewardID : item.rewardID,
    title: item.title,
    description: item.description,
    rewardText: item.rewardText,
    health : item.health,
    points : item.points,
    status: item.status,
    claimed: item.status === "CLAIMED",
    done: item.status === "COMPLETE" || item.status === "CLAIMED",
  });

  const isDoneButNotClaimed =
    currentChallenge.done && !currentChallenge.claimed;
  const isClaimed = currentChallenge.done && currentChallenge.claimed;

  const itemClasses = `
    bg-gray-800/70 p-4 rounded-xl shadow-md
    ${isDoneButNotClaimed ? "border-2 border-yellow-400 animate-flicker" : ""}
    ${isClaimed ? "bg-green-800/70" : ""}
  `;

  const titleClasses = `
    text-lg font-semibold flex items-center mb-1
    ${isDoneButNotClaimed ? "text-yellow-400" : "text-white"}
  `;

  const handleClaim = async() => {
    if (isDoneButNotClaimed) {
      const { xp, health } = await getUser(currentChallenge.userID);
      const data = {
        xp : xp + currentChallenge.points,
        health : health + currentChallenge.health,
      }
      await updateUser(currentChallenge.userID, data);
      await updateUserRewardStatus(currentChallenge.userID, currentChallenge.rewardID, "CLAIMED");
      setCurrentChallenge({ ...currentChallenge, claimed: true, status: "claimed" });
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
        {currentChallenge.title}
        {!isDoneButNotClaimed &&
          (isClaimed ? (
            // ✅ Done icon
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
            // 🔒 Lock icon
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
      <p className="text-gray-400 text-sm mb-2">
        {currentChallenge.description}
      </p>

      {/* Reward Button (acts as claim) */}
      <button
        onClick={handleClaim}
        disabled={!isDoneButNotClaimed}
        className={`
          inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition
          ${
            isClaimed
              ? "bg-green-600 text-white cursor-not-allowed opacity-80"
              : isDoneButNotClaimed
              ? "bg-yellow-600 text-white hover:bg-yellow-500"
              : "bg-red-600 text-white cursor-not-allowed"
          }
        `}
      >
        {currentChallenge.rewardText}
      </button>
    </div>
  );
}
