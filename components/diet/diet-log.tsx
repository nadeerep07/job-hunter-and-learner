'use client';

import { DietDay } from '@/lib/types';
import { Trash2 } from 'lucide-react';

interface DietLogProps {
  dietDay: DietDay | null;
}

export function DietLog({ dietDay }: DietLogProps) {
  if (!dietDay || dietDay.meals.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>No meals logged yet. Add your first meal to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Today's Meals</h3>

      {dietDay.meals.map((meal) => (
        <div key={meal.mealId} className="p-4 bg-card rounded-lg border border-border space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">{meal.name}</h4>
            <span className="text-sm font-semibold text-accent">{meal.totalCalories} kcal</span>
          </div>

          <div className="space-y-2">
            {meal.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.name} ({item.quantity})
                </span>
                <span className="font-medium text-foreground">{item.calories} kcal</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
