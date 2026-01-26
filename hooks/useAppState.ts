'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppState, Target, LearningNote, DietDay, UserProfile } from '@/lib/types';
import { getStorageState, saveStorageState, generateId, getTodayDate } from '@/lib/storage';

const DEFAULT_PLAN: Omit<Target, 'id' | 'completed' | 'createdAt'>[] = [
  { startTime: '09:00', endTime: '10:00', title: 'Morning Workout', purpose: 'Physical energy & mental clarity.', category: 'Health' },
  { startTime: '11:00', endTime: '12:30', title: 'Applying to Companies', purpose: '10 high-quality applications with tailored notes.', category: 'Career' },
  { startTime: '12:30', endTime: '13:30', title: 'Calling HRs / Networking', purpose: 'Direct follow-ups and lead warming.', category: 'Career' },
  { startTime: '14:30', endTime: '16:00', title: 'Flutter & Dart Deep Dive', purpose: 'Solve 1 logic challenge or widget exercise.', category: 'Learning' },
  { startTime: '16:00', endTime: '17:30', title: 'State Management (Bloc/Provider)', purpose: 'Refactor 1 screen using Bloc or Provider.', category: 'Learning' },
  { startTime: '18:00', endTime: '19:30', title: 'REST APIs & JS Basics', purpose: 'Successfully fetch and parse 1 external API.', category: 'Learning' },
  { startTime: '19:30', endTime: '21:30', title: 'Project: DrPlus App', purpose: 'Complete 1 specific feature (Auth UI, Profile).', category: 'Career' },
  { startTime: '22:30', endTime: '23:30', title: 'Lead Generation / Research', purpose: 'List 15 new companies for tomorrow.', category: 'Career' },
];

export function useAppState() {
  const [state, setState] = useState<AppState | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize and check for daily routine injection
  useEffect(() => {
    const currentState = getStorageState();
    const today = getTodayDate();
    
    const hasTodayTargets = currentState.targets.some(t => t.createdAt === today);

    if (!hasTodayTargets) {
      const defaultTargets: Target[] = DEFAULT_PLAN.map(plan => ({
        ...plan,
        id: generateId(),
        completed: false,
        createdAt: today
      }));
      
      const updatedState = {
        ...currentState,
        targets: [...currentState.targets, ...defaultTargets]
      };
      
      setState(updatedState);
      saveStorageState(updatedState);
    } else {
      setState(currentState);
    }
    
    setIsHydrated(true);
  }, []);

  const saveState = useCallback((newState: AppState) => {
    setState(newState);
    saveStorageState(newState);
  }, []);

  const addTarget = useCallback(
    (title: string, category: 'Career' | 'Learning' | 'Health', startTime?: string, endTime?: string, purpose?: string) => {
      if (!state) return;
      const newTarget: Target = {
        purpose: purpose || '',
        id: generateId(),
        title,
        category,
        startTime,
        endTime,
        completed: false,
        createdAt: getTodayDate(),
      };
      saveState({ ...state, targets: [...state.targets, newTarget] });
    },
    [state, saveState]
  );

  const toggleTarget = useCallback((id: string) => {
    if (!state) return;
    const targets = state.targets.map((t) => t.id === id ? { ...t, completed: !t.completed } : t);
    saveState({ ...state, targets });
  }, [state, saveState]);

  const deleteTarget = useCallback((id: string) => {
    if (!state) return;
    const targets = state.targets.filter((t) => t.id !== id);
    saveState({ ...state, targets });
  }, [state, saveState]);

  const getTodayTargets = useCallback(() => {
    if (!state) return [];
    const today = getTodayDate();
    return state.targets
      .filter((t) => t.createdAt === today)
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  }, [state]);

  const addLearningNote = useCallback((topic: string, category: string, definition: string, purpose: string, example: string) => {
    if (!state) return;
    const newNote: LearningNote = { id: generateId(), topic, category, definition, purpose, example, createdAt: new Date().toISOString() };
    saveState({ ...state, learningNotes: [...state.learningNotes, newNote] });
  }, [state, saveState]);

  const deleteLearningNote = useCallback((id: string) => {
    if (!state) return;
    const learningNotes = state.learningNotes.filter((n) => n.id !== id);
    saveState({ ...state, learningNotes });
  }, [state, saveState]);

  const getLearningNotesByCategory = useCallback((category: string) => {
    if (!state) return [];
    return state.learningNotes.filter((n) => n.category === category);
  }, [state]);

  const getTodayDietDay = useCallback(() => {
    if (!state) return null;
    const today = getTodayDate();
    return state.dietLog.find((d) => d.date === today) || null;
  }, [state]);

  const addMealToToday = useCallback((mealName: string, items: { name: string; quantity: string; calories: number }[]) => {
    if (!state) return;
    const today = getTodayDate();
    const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);
    let updatedDietLog = [...state.dietLog];
    let todayDiet = updatedDietLog.find((d) => d.date === today);
    const newMeal = { mealId: generateId(), name: mealName, items: items.map((item) => ({ id: generateId(), ...item })), totalCalories };

    if (todayDiet) {
      todayDiet.meals.push(newMeal);
      todayDiet.dailyTotal += totalCalories;
    } else {
      updatedDietLog.push({ id: generateId(), date: today, meals: [newMeal], dailyTotal: totalCalories, status: 'on-track' });
    }
    saveState({ ...state, dietLog: updatedDietLog });
  }, [state, saveState]);

  const updateUserProfile = useCallback((profile: Partial<UserProfile>) => {
    if (!state) return;
    saveState({ ...state, userProfile: { ...state.userProfile, ...profile } });
  }, [state, saveState]);

  return { state, isHydrated, addTarget, toggleTarget, deleteTarget, getTodayTargets, addLearningNote, deleteLearningNote, getLearningNotesByCategory, getTodayDietDay, addMealToToday, updateUserProfile };
}