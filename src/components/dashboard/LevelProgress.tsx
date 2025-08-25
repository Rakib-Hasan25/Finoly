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
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-purple-600" />
            Your Level
          </CardTitle>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
            Level {userLevel.level}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Level Title */}
        <div className="text-center">
          <motion.h3 
            className="text-xl font-bold text-purple-700"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {userLevel.title}
          </motion.h3>
          <p className="text-sm text-purple-600 mt-1">
            {userLevel.currentPoints} / {userLevel.requiredPoints} XP
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <ProgressLiquid 
            percentage={userLevel.progress}
            color="rgb(147, 51, 234)"
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
                    : 'text-gray-300'
                }`} 
              />
            </motion.div>
          ))}
        </div>

        {/* Motivational Text */}
        <motion.div 
          className="text-center p-3 bg-white/50 rounded-lg"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <p className="text-sm font-medium text-purple-700">
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