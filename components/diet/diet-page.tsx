'use client';

import { useState } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { DietForm } from './diet-form';
import { DietStats } from './diet-stats';
import { DietLog } from './diet-log';

export function DietPage() {
  const { state, isHydrated, addMealToToday, getTodayDietDay } = useAppState();
  const [isLoading, setIsLoading] = useState(false);

  if (!isHydrated || !state) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const todayDiet = getTodayDietDay();

  const handleAddMeal = (
    mealName: string,
    items: { name: string; quantity: string; calories: number }[]
  ) => {
    setIsLoading(true);
    try {
      addMealToToday(mealName, items);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Diet & Weight Loss Planner</h1>
        <p className="text-muted-foreground">
          Track your daily calories and work towards your goal of {state.userProfile.targetWeight}kg
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <DietForm onAddMeal={handleAddMeal} isLoading={isLoading} />
          <DietLog dietDay={todayDiet} />
        </div>

        <div>
          <DietStats
            todayDiet={todayDiet}
            userProfile={state.userProfile}
          />
        </div>
      </div>
    </div>
  );
}
