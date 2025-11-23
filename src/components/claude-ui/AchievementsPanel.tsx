'use client';

import React, { useState } from 'react';
import type { UserProgress, AchievementCategory } from '@/lib/achievements';
import { ACHIEVEMENTS, calculateLevel, getPointsForNextLevel, getCategoryName } from '@/lib/achievements';
import { AchievementBadge } from './AchievementBadge';

interface AchievementsPanelProps {
  progress: UserProgress;
  onClose: () => void;
}

export function AchievementsPanel({ progress, onClose }: AchievementsPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');

  const categories: (AchievementCategory | 'all')[] = [
    'all',
    'prompt-engineering',
    'creative-collaboration',
    'critical-thinking',
    'task-decomposition',
    'effective-questioning',
    'artifact-mastery',
    'conversation-skills',
  ];

  const filteredAchievements = ACHIEVEMENTS.filter(
    a => selectedCategory === 'all' || a.category === selectedCategory
  );

  const unlockedIds = new Set(progress.achievements.map(a => a.id));
  const unlockedAchievements = filteredAchievements.map(a => {
    const unlocked = progress.achievements.find(ua => ua.id === a.id);
    return unlocked || a;
  });

  const nextLevelPoints = getPointsForNextLevel(progress.level);
  const currentLevelPoints = progress.level > 1 ? getPointsForNextLevel(progress.level - 1) : 0;
  const levelProgress = ((progress.totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              AI Literacy Achievements
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track your progress as you develop AI interaction skills
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Level */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Level</div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {progress.level}
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>Next level</span>
                  <span>{progress.totalPoints}/{nextLevelPoints}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                    style={{ width: `${Math.min(levelProgress, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Total Points */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Points</div>
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {progress.totalPoints}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {progress.achievements.filter(a => a.unlockedAt).length} achievements unlocked
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Activity</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Messages</span>
                  <span className="font-medium text-gray-900 dark:text-white">{progress.stats.totalMessages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Conversations</span>
                  <span className="font-medium text-gray-900 dark:text-white">{progress.stats.conversationCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Artifacts</span>
                  <span className="font-medium text-gray-900 dark:text-white">{progress.stats.artifactsCreated}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <div className="flex gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category === 'all' ? 'All' : getCategoryName(category)}
              </button>
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedAchievements.map(achievement => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                locked={!unlockedIds.has(achievement.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
