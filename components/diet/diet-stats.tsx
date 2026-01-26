'use client';

import { DietDay, UserProfile } from '@/lib/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface DietStatsProps {
  todayDiet: DietDay | null;
  userProfile: UserProfile;
  onSuggestionReceived?: (suggestion: string) => void;
}

export function DietStats({ todayDiet, userProfile, onSuggestionReceived }: DietStatsProps) {
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const totalCalories = todayDiet?.dailyTotal || 0;
  const target = userProfile.dailyCalorieTarget;
  const remaining = Math.max(0, target - totalCalories);
  const percentageUsed = Math.round((totalCalories / target) * 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'text-green-600 dark:text-green-400';
      case 'under-target':
        return 'text-blue-600 dark:text-blue-400';
      case 'over-target':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-foreground';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 dark:bg-green-900/30';
      case 'under-target':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'over-target':
        return 'bg-orange-100 dark:bg-orange-900/30';
      default:
        return 'bg-muted';
    }
  };

  const handleGetSuggestion = async () => {
    setIsLoadingSuggestion(true);
    try {
      const response = await fetch('/api/diet-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentWeight: userProfile.currentWeight,
          targetWeight: userProfile.targetWeight,
          dailyIntake: totalCalories,
          age: userProfile.age,
        }),
      });

      if (!response.ok) throw new Error('Failed to get suggestion');
      const data = await response.json();
      setSuggestion(data.suggestion);
      onSuggestionReceived?.(data.suggestion);
    } catch (error) {
      console.error('Error getting suggestion:', error);
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-2">Consumed Today</p>
          <p className="text-3xl font-bold text-foreground">{totalCalories}</p>
          <p className="text-xs text-muted-foreground mt-1">of {target} kcal</p>
        </div>

        <div className="p-4 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-2">Remaining</p>
          <p className="text-3xl font-bold text-accent">{remaining}</p>
          <p className="text-xs text-muted-foreground mt-1">kcal available</p>
        </div>

        <div className={`p-4 rounded-lg border border-border ${getStatusBg(todayDiet?.status || 'under-target')}`}>
          <p className="text-sm font-medium mb-2">Status</p>
          <p className={`text-lg font-bold ${getStatusColor(todayDiet?.status || 'under-target')}`}>
            {todayDiet?.status === 'on-track'
              ? 'On Track'
              : todayDiet?.status === 'under-target'
                ? 'Under Target'
                : 'Over Target'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{percentageUsed}% of daily goal</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-4 bg-card rounded-lg border border-border space-y-3">
        <h3 className="font-semibold text-foreground">Daily Progress</h3>
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className="bg-accent h-3 rounded-full transition-all"
            style={{ width: `${Math.min(percentageUsed, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center">{percentageUsed}%</p>
      </div>

      {/* Weight Goal */}
      <div className="p-4 bg-card rounded-lg border border-border">
        <p className="text-sm text-muted-foreground mb-3">Weight Goal Progress</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">{userProfile.currentWeight}kg</span>
          <span className="text-sm font-medium">{userProfile.targetWeight}kg</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all"
            style={{
              width: `${((userProfile.currentWeight - userProfile.targetWeight) / (userProfile.currentWeight - userProfile.targetWeight)) * 100}%`,
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {Math.max(0, userProfile.currentWeight - userProfile.targetWeight)}kg to lose
        </p>
      </div>

      {/* AI Suggestion */}
      <div className="space-y-3">
        <Button
          onClick={handleGetSuggestion}
          disabled={isLoadingSuggestion}
          variant="outline"
          className="w-full bg-transparent"
        >
          {isLoadingSuggestion && <Loader2 size={16} className="mr-2 animate-spin" />}
          {isLoadingSuggestion ? 'Getting suggestion...' : 'Get AI Motivation & Tips'}
        </Button>

        {suggestion && (
          <div className="p-4 bg-accent/10 rounded-lg border border-accent/30 space-y-2">
            <p className="text-sm font-semibold text-accent">Today's Suggestion</p>
            <p className="text-sm text-foreground whitespace-pre-wrap">{suggestion}</p>
          </div>
        )}
      </div>
    </div>
  );
}
