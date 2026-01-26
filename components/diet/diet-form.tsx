'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface DietFormProps {
  onAddMeal: (mealName: string, items: { name: string; quantity: string; calories: number }[]) => void;
  isLoading: boolean;
}

export function DietForm({ onAddMeal, isLoading }: DietFormProps) {
  const [mealName, setMealName] = useState('');
  const [items, setItems] = useState<string>('');
  const [estimatedCalories, setEstimatedCalories] = useState<number | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);

  const handleEstimate = async () => {
    if (!items.trim()) return;

    setIsEstimating(true);
    try {
      const response = await fetch('/api/estimate-calories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealItems: items }),
      });

      if (!response.ok) throw new Error('Failed to estimate');
      const data = await response.json();
      setEstimatedCalories(data.calories);
    } catch (error) {
      console.error('Error estimating calories:', error);
      setEstimatedCalories(null);
    } finally {
      setIsEstimating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim() || !items.trim() || estimatedCalories === null) return;

    const parsedItems = items.split(',').map((item) => {
      const trimmed = item.trim();
      return {
        name: trimmed.split(/\d+/).join('').trim() || trimmed,
        quantity: trimmed.match(/\d+\s*(g|ml|cup|tbsp)?/)?.[0] || '1 serving',
        calories: Math.round(estimatedCalories / items.split(',').length),
      };
    });

    onAddMeal(mealName, parsedItems);
    setMealName('');
    setItems('');
    setEstimatedCalories(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-card rounded-lg border border-border">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Meal Name</label>
        <Input
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          placeholder="e.g., Breakfast, Lunch, Dinner, Snack"
          className="bg-background"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Food Items</label>
        <textarea
          value={items}
          onChange={(e) => setItems(e.target.value)}
          placeholder="e.g., Rice 200g, Chicken 150g, Vegetables"
          className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground disabled:opacity-50 resize-none"
          rows={3}
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground mt-1">Separate items with commas</p>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleEstimate}
          disabled={isLoading || isEstimating || !items.trim()}
          className="flex-1 bg-transparent"
        >
          {isEstimating && <Loader2 size={16} className="mr-2 animate-spin" />}
          {isEstimating ? 'Estimating...' : 'Estimate Calories'}
        </Button>

        {estimatedCalories !== null && (
          <div className="flex items-center justify-center px-4 py-2 bg-accent/20 rounded-md">
            <span className="font-semibold text-accent">{estimatedCalories} kcal</span>
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading || estimatedCalories === null}
        className="w-full"
      >
        {isLoading && <Loader2 size={16} className="mr-2 animate-spin" />}
        {isLoading ? 'Adding...' : 'Add Meal'}
      </Button>
    </form>
  );
}
