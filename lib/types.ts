// Daily Targets
export interface Target {
  id: string;
  title: string;
  purpose: string;
  category: 'Career' | 'Learning' | 'Health';
  startTime?: string;
  endTime?: string;
  completed: boolean;
  createdAt: string;
}

// Learning Notes
export interface LearningNote {
  id: string;
  topic: string;
  category: 'Dart' | 'Flutter' | 'JavaScript' | 'Node.js' | 'MongoDB' | 'AI' | string;
  definition: string;
  purpose: string;
  example: string;
  createdAt: string;
}

// Diet Log
export interface DietItem {
  id: string;
  name: string;
  quantity: string;
  calories: number;
}

export interface Meal {
  mealId: string;
  name: string;
  items: DietItem[];
  totalCalories: number;
}

export interface DietDay {
  id: string;
  date: string;
  meals: Meal[];
  dailyTotal: number;
  status: 'under-target' | 'on-track' | 'over-target';
}

// User Profile
export interface UserProfile {
  currentWeight: number;
  targetWeight: number;
  dailyCalorieTarget: number;
  age: number;
}

// App State
export interface AppState {
  targets: Target[];
  learningNotes: LearningNote[];
  dietLog: DietDay[];
  userProfile: UserProfile;
}
