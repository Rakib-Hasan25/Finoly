import React from "react";
import ChallengeItem from "./challengeItem";


export default function DailyChallenge() {
  return (
    <div className="bg-gray-900/80 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition">
      <h2 className="text-2xl font-extrabold mb-6 text-yellow-300">Daily Challenges</h2>
      <div className="space-y-4">
        <ChallengeItem/>
        <ChallengeItem/>
        <ChallengeItem/>
      </div>
    </div>
  );
}
