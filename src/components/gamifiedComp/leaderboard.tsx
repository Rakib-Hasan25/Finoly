import React from "react";

export default function Leaderboard() {
  // Placeholder data for the leaderboard
  const leaderboardData = [
    { id: 1, rank: "1st", name: "Alice", score: "1200 XP" },
    { id: 2, rank: "2nd", name: "Bob", score: "1150 XP" },
    { id: 3, rank: "3rd", name: "Charlie", score: "1000 XP" },
    { id: 10, rank : "10th", name: "You", score: "250 XP"}
  ];

  return (
    <div className="bg-gray-900/80 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition">
      <div className="flex items-center mb-6">
        {/* Trophy icon for Leaderboard title */}
        <svg className="w-7 h-7 mr-3 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"></path>
        </svg>
        <h2 className="text-2xl font-extrabold text-yellow-300">Leaderboard</h2>
      </div>

      <div className="space-y-4">
        {leaderboardData.map((player) => (
          <div key={player.id} className="bg-gray-800/70 p-4 rounded-xl shadow-md flex items-center justify-between">
            <div className="flex items-center">
              {/* Rank */}
              <span className="text-xl font-bold text-white mr-4 w-10 text-center">{player.rank}</span>
              {/* Player Name */}
              <p className="text-lg font-semibold text-white">{player.name}</p>
            </div>
            {/* Player Score */}
            <span className="text-md font-medium text-yellow-400">
              {player.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
