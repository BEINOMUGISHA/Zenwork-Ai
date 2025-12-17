export enum Mood {
  Great = 5,
  Good = 4,
  Okay = 3,
  Bad = 2,
  Terrible = 1
}

export interface DailyLog {
  id: string;
  date: string;
  mood: number;
  stressLevel: number; // 1-10
  hoursWorked: number;
  waterIntake: number; // glasses
  notes: string;
}

export type LanguageCode = 'en' | 'es' | 'fr' | 'de';

export type WellnessGoal = 'reduce_stress' | 'improve_focus' | 'better_sleep' | 'work_life_balance' | 'boost_energy';

export interface UserPreferences {
  wellnessGoal: WellnessGoal;
  waterGoal: number;
  language: LanguageCode;
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    dailyReminder: boolean;
  };
  integrations: {
    appleHealth: boolean;
    googleFit: boolean;
    slack: boolean;
  };
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  dateUnlocked?: string;
}

export interface UserLevel {
  currentLevel: number;
  currentXp: number;
  nextLevelXp: number;
  title: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  preferences: UserPreferences;
  achievements: Achievement[];
  level: UserLevel;
}

export interface AIInsight {
  title: string;
  content: string;
  actionableStep: string;
}

export interface TeamUpdate {
  id: string;
  user: string;
  action: string;
  time: string;
  type: 'wellness' | 'work' | 'milestone';
}

export interface Quest {
  id: string;
  title: string;
  completed: boolean;
  xpReward: number;
  type: 'checkin' | 'water' | 'breathe';
}