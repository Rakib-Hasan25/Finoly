import React, { useState } from "react";

export default function RewardItem() {
  const reward = {
    title: "Financial Newbie Badge",
    description: "Awarded for completing your first financial lesson.",
    task: "Complete Lesson 1",
    rewardText: "🏅 Newbie Badge",
    done: true,
    claimed: false,
  };

  const [currentReward, setCurrentReward] = useState(reward);

  // Determine state
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

  // Handle claim
  const handleClaim = () => {
    if (isDoneButNotClaimed) {
      setCurrentReward({ ...currentReward, claimed: true });
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
      <p className="text-gray-400 text-sm mb-3">{currentReward.description}</p>

      {/* Show task text if not done, else show reward pill */}
      {!currentReward.done ? (
        <span className="px-4 py-2 bg-gray-700 text-gray-300 text-sm font-medium rounded-full">
          {currentReward.task}
        </span>
      ) : (
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
          {isClaimed ? "Claimed" : currentReward.rewardText}
        </button>
      )}
    </div>
  );
}
