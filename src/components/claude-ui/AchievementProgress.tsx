'use client';

import React from 'react';
import type { UserProgress } from '@/lib/achievements';
import { getPointsForNextLevel } from '@/lib/achievements';

interface AchievementProgressProps {
  progress: UserProgress;
  onClick: () => void;
}

export function AchievementProgress({ progress, onClick }: AchievementProgressProps) {
  const nextLevelPoints = getPointsForNextLevel(progress.level);
  const currentLevelPoints = progress.level > 1 ? getPointsForNextLevel(progress.level - 1) : 0;
  const levelProgress = ((progress.totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
  const recentAchievements = progress.achievements
    .filter(a => a.unlockedAt)
    .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
    .slice(0, 3);

  return (
    <button
      onClick={onClick}
      className="w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
    >
      {/* Level and Points */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
            {progress.level}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              Level {progress.level}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {progress.totalPoints} points
            </div>
          </div>
        </div>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Progress to Level {progress.level + 1}</span>
          <span>{Math.round(levelProgress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
            style={{ width: `${Math.min(levelProgress, 100)}%` }}
          />
        </div>
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Recent Achievements</div>
          <div className="flex gap-2">
            {recentAchievements.map(achievement => (
              <div
                key={achievement.id}
                className="text-2xl"
                title={achievement.title}
              >
                {achievement.icon}
              </div>
            ))}
          </div>
        </div>
      )}
    </button>
  );
}
