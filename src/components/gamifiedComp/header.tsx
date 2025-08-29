"use client";
import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react"; // Importing an icon from lucide-react
import { getUser, getUserByEmail } from "@/lib/actions/users";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  courseName: string;
}

export default function Header({ courseName }: HeaderProps) {
  const { user } = useAuth();
  const [userId, setUserId] = useState<number | null>(null);
  const [level, setLevel] = useState(0);
  const [health, setHealth] = useState(0);
  const [xp, setXp] = useState(0);
  const [badge, setBadge] = useState("");
  const [currentXp, setCurrentXp] = useState(0);
  const [xpToNextLevel, setxpToNextLevel] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);

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
    const fetchdata = async () => {
      const user = await getUser(userId);
      setBadge(user.badge);
      setXp(user.xp);
      setHealth(user.health);
      const lvl = Math.round(user.xp / 1000);
      const cxp = user.xp - lvl * 1000;
      const nxp = 1000 - cxp;
      setLevel(lvl + 1);
      setCurrentXp(cxp);
      setxpToNextLevel(nxp);
      setLoading(false);
    };
    fetchdata();
  }, [userId]);

  return (
    <header className="flex justify-between items-center mb-8">
      {loading ? (
        <> <HeaderSkeleton/> </>
      ) : (
        <>
          {/* Level & XP */}
          <div className="p-6 w-80">
            <XpBar
              level={level}
              currentXp={currentXp}
              xpToNextLevel={xpToNextLevel}
            />
          </div>
          <span className="text-2xl font-bold text-white drop-shadow-md">
            {courseName}
          </span>

          {/* Badge & Health */}
          <div className="flex items-center gap-6">
            <span className="text-lg font-bold text-yellow-300">
              {badge} 🏅
            </span>
            <span className="text-lg font-bold text-red-400">{health} ❤️</span>
          </div>
        </>
      )}
    </header>
  );
}

// XpBar Component definition
const XpBar = ({
  level,
  currentXp,
  xpToNextLevel,
}: {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
}) => {
  // Calculate the percentage of the XP bar filled
  const percentageFilled = (currentXp / xpToNextLevel) * 100;

  return (
    <div className="flex items-center space-x-4">
      {" "}
      {/* Use flexbox to put level and bar side-by-side */}
      {/* Level Display */}
      <div className="flex items-center text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 min-w-[100px] justify-center">
        <Sparkles size={12} className="mr-1 text-yellow-300" />
        Level {level}
      </div>
      {/* XP Bar Container */}
      <div className="relative flex-grow bg-gray-700 rounded-full h-8 overflow-hidden shadow-inner group transition-all duration-300 ease-in-out hover:scale-[1.02]">
        {/* Filled part of the XP bar */}
        <div
          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-end px-2 transition-all duration-500 ease-out"
          style={{ width: `${percentageFilled}%` }}
        >
          {/* Only show XP text inside if there's enough space */}
          {percentageFilled > 15 && (
            <span className="text-sm font-bold text-white whitespace-nowrap hidden group-hover:inline-block md:inline-block"></span>
          )}
        </div>

        {/* Hover Text / Tooltip */}
        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-70 rounded-full">
          {currentXp}/{xpToNextLevel} XP
        </div>
      </div>
    </div>
  );
};

function HeaderSkeleton() {
  return (
    <header className="flex justify-between items-center mb-8 animate-pulse w-full">
      {/* Level & XP (left side) */}
      <div className="p-6 w-80">
        <XpBarSkeleton />
      </div>

      {/* Course Name (center) */}
      <div className="h-8 w-80 bg-gray-700 rounded-md" />

      {/* Badge & Health (right side) */}
      <div className="flex items-center gap-6">
        <div className="h-7 w-24 bg-gray-700 rounded-md" />
        <div className="h-7 w-20 bg-gray-700 rounded-md" />
      </div>
    </header>
  );
}

const XpBarSkeleton = () => {
  return (
    <div className="flex items-center space-x-4">
      {/* Level Display */}
      <div className="flex items-center min-w-[100px] justify-center">
        <Sparkles size={12} className="mr-1 text-gray-500" />
        <div className="h-6 w-20 bg-gray-700 rounded-md" />
      </div>

      {/* XP Bar Container */}
      <div className="relative flex-grow bg-gray-700 rounded-full h-8 overflow-hidden">
        {/* Simulate partially filled XP bar */}
        <div className="h-full w-2/5 bg-gray-600 rounded-full" />
      </div>
    </div>
  );
};

