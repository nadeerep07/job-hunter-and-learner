import { AppState, Target, LearningNote, DietDay, UserProfile } from './types';

const STORAGE_KEY = 'productivity_app_state';

const DEFAULT_STATE: AppState = {
  targets: [],
  learningNotes: [],
  dietLog: [],
  userProfile: {
    currentWeight: 115,
    targetWeight: 70,
    dailyCalorieTarget: 2000,
    age: 23,
  },
};

export function getStorageState(): AppState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_STATE;
    return JSON.parse(stored);
  } catch {
    console.error('Failed to parse storage state');
    return DEFAULT_STATE;
  }
}

export function saveStorageState(state: AppState): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}
