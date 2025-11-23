'use client';

import React from 'react';
import type { Achievement } from '@/lib/achievements';
import { getCategoryColor, getCategoryName } from '@/lib/achievements';

interface AchievementBadgeProps {
  achievement: Achievement;
  locked?: boolean;
}

export function AchievementBadge({ achievement, locked = false }: AchievementBadgeProps) {
  const color = getCategoryColor(achievement.category);
  const isUnlocked = !locked && achievement.unlockedAt;
  const hasProgress = achievement.progress !== undefined && achievement.total !== undefined;

  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
    pink: { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-800' },
    green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-800' },
    yellow: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-800' },
    orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
  };

  const styles = colorClasses[color];

  return (
    <div
      className={`relative p-4 rounded-lg border transition-all ${
        isUnlocked
          ? `${styles.bg} ${styles.border}`
          : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`text-3xl ${locked ? 'grayscale' : ''}`}>
          {locked ? '🔒' : achievement.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold mb-1 ${isUnlocked ? styles.text : 'text-gray-600 dark:text-gray-400'}`}>
            {achievement.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {achievement.description}
          </p>

          {/* Progress bar */}
          {hasProgress && !isUnlocked && (
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>{achievement.progress}/{achievement.total}</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${colorClasses[color].bg.replace('bg-', 'from-').replace('/20', '')} to-${color}-600 transition-all`}
                  style={{ width: `${((achievement.progress ?? 0) / (achievement.total ?? 1)) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${isUnlocked ? styles.text : 'text-gray-500 dark:text-gray-400'}`}>
              {getCategoryName(achievement.category)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600 dark:text-yellow-400">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {achievement.points}
            </span>
          </div>

          {/* Unlocked date */}
          {isUnlocked && achievement.unlockedAt && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
