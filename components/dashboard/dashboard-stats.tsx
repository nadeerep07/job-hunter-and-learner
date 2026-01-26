'use client';

import { AppState } from '@/lib/types';
import { getTodayDate } from '@/lib/storage';
import { TrendingDown, BookOpen, CheckSquare, Apple } from 'lucide-react';

interface DashboardStatsProps {
  state: AppState;
}

export function DashboardStats({ state }: DashboardStatsProps) {
  const today = getTodayDate();
  const todayTargets = state.targets.filter((t) => t.createdAt === today);
  const completedTargets = todayTargets.filter((t) => t.completed).length;
  const targetProgress = todayTargets.length > 0 ? Math.round((completedTargets / todayTargets.length) * 100) : 0;

  const todayDiet = state.dietLog.find((d) => d.date === today);
  const caloriesRemaining = Math.max(0, state.userProfile.dailyCalorieTarget - (todayDiet?.dailyTotal || 0));
  const weightToLose = Math.max(0, state.userProfile.currentWeight - state.userProfile.targetWeight);

  const stats = [
    {
      label: 'Today\'s Progress',
      value: `${targetProgress}%`,
      icon: CheckSquare,
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      subtitle: `${completedTargets}/${todayTargets.length} tasks`,
    },
    {
      label: 'Calories Remaining',
      value: caloriesRemaining,
      icon: Apple,
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      subtitle: 'kcal today',
    },
    {
      label: 'Learning Notes',
      value: state.learningNotes.length,
      icon: BookOpen,
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      subtitle: 'saved topics',
    },
    {
      label: 'Weight to Goal',
      value: `${weightToLose}kg`,
      icon: TrendingDown,
      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      subtitle: `Current: ${state.userProfile.currentWeight}kg`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="p-4 bg-card rounded-lg border border-border">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <Icon size={20} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
