import { Suspense } from "react";
import LevelsMap from "@/components/gamifiedComp/levelMap";
import Header from "@/components/gamifiedComp/header";
import Leaderboard from "@/components/gamifiedComp/leaderboard";
import DailyChallenge from "@/components/gamifiedComp/dailyChallenge";
import Reward from "@/components/gamifiedComp/reward";
import { getCourses } from "@/lib/actions/course";

export default async function GamifiedLearning() {
  const courses = await getCourses();
  const firstCourse = courses[0]; // Using the first course as requested

  if (!firstCourse) {
    return (
      <div className="p-6 text-white">
        <p>No courses available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-b from-[#2a003f] via-[#1a1a6b] to-[#0d1b2a] text-white">
      {/* Top Header */}
      <Header courseName={firstCourse.name} />
      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8 h-[calc(100%-6rem)]">
        {/* Left: Levels Map */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="w-full h-[80lvh] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-indigo-950/60 to-blue-900/50">
            <Suspense fallback={<div>Loading levels...</div>}>
              <LevelsMap courseId={firstCourse.id} />
            </Suspense>
          </div>
          <DailyChallenge />
        </div>

        {/* Right: Sections */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <Leaderboard />
          <Reward />
        </div>
      </div>
    </div>
  );
}
