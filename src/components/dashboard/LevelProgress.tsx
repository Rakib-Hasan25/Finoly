'use client';

import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Tracker-ui/card';
import { Badge } from '@/components/Tracker-ui/badge';
import { ProgressLiquid } from '@/components/Tracker-animations/ProgressLiquid';
import { UserLevel } from '@/tracker-types';

interface LevelProgressProps {
  userLevel: UserLevel;
}

export function LevelProgress({ userLevel }: LevelProgressProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-purple-400" />
            Your Level
          </CardTitle>
          <Badge variant="secondary" className="bg-purple-900/30 text-purple-300 border-purple-700/50">
            Level {userLevel.level}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Level Title */}
        <div className="text-center">
          <motion.h3 
            className="text-xl font-bold text-purple-300"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {userLevel.title}
          </motion.h3>
          <p className="text-sm text-gray-400 mt-1">
            {userLevel.currentPoints} / {userLevel.requiredPoints} XP
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <ProgressLiquid 
            percentage={userLevel.progress}
            color="rgb(192, 132, 252)" // violet-400
            height="50px"
          />
        </div>

        {/* Stars */}
        <div className="flex justify-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: i < userLevel.level ? 1 : 0.3,
                scale: i < userLevel.level ? 1 : 0.8
              }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            >
              <Star 
                className={`h-4 w-4 ${
                  i < userLevel.level 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-600'
                }`} 
              />
            </motion.div>
          ))}
        </div>

        {/* Motivational Text */}
        <motion.div 
          className="text-center p-3 bg-slate-700/30 rounded-lg border border-slate-600/50"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <p className="text-sm font-medium text-gray-300">
            {userLevel.progress < 50 
              ? "Keep tracking to level up!" 
              : userLevel.progress < 90
              ? "Almost there! You're doing great!"
              : "Level up incoming! 🚀"
            }
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}