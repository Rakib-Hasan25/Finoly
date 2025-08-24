"use client";
import React, { useState } from "react";

export default function ChallengeItem() {
  const challenge = {
    title: "Study Streak",
    description: "Complete a lesson for 3 consecutive days",
    rewardText: "+2 Health",
    actionText: "Claim Challenge",
    done: false,
    claimed: false,
  };
  const [currentChallenge, setCurrentChallenge] = useState(challenge);

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

  const handleClaim = () => {
    if (isDoneButNotClaimed) {
      setCurrentChallenge({ ...currentChallenge, claimed: true });
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
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          ></path>
        </svg>
        {currentChallenge.rewardText}
      </button>
    </div>
  );
}
