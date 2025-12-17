import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserPreferences, Achievement } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default Mock User for Demo Mode
const MOCK_USER: User = {
  id: 'mock-u1',
  name: 'Sarah Jenkins',
  role: 'Remote Software Engineer',
  email: 'sarah@example.com',
  avatar: 'https://picsum.photos/200',
  level: {
    currentLevel: 3,
    currentXp: 350,
    nextLevelXp: 500,
    title: 'Zen Seeker'
  },
  preferences: {
    wellnessGoal: 'work_life_balance',
    waterGoal: 8,
    language: 'en',
    theme: 'light',
    notifications: { email: true, push: true, dailyReminder: true },
    integrations: { appleHealth: false, googleFit: true, slack: false }
  },
  achievements: [
    { id: '1', title: 'First Steps', description: 'Logged first check-in', icon: '🚀', unlocked: true },
    { id: '2', title: 'Hydration Hero', description: 'Hit water goal 3 days in a row', icon: '💧', unlocked: true },
  ]
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    setIsLoading(true);
    
    // 1. Check Supabase Session
    if (isSupabaseConfigured) {
      const { data: { session } } = await supabase!.auth.getSession();
      if (session) {
        // Fetch full profile logic would go here
        // For now, we mix the mock structure with the auth email
        setUser({ ...MOCK_USER, id: session.user.id, email: session.user.email || '' });
      }
    } else {
      // 2. Check Local Storage for demo persistence
      const savedUser = localStorage.getItem('zenwork_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setIsLoading(false);
  };

  const login = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        // Trigger Supabase Login (OAuth or Magic Link)
        // For MVP simplicity in a web container, we'll simulate a successful auth flow
        // In a real app: await supabase.auth.signInWithOAuth(...)
        const fakeId = 'sb-' + Date.now();
        const newUser = { ...MOCK_USER, id: fakeId, name: 'Supabase User' };
        setUser(newUser);
      } else {
        // Fallback Demo Login
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setUser(MOCK_USER);
        localStorage.setItem('zenwork_user', JSON.stringify(MOCK_USER));
      }
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase!.auth.signOut();
    }
    localStorage.removeItem('zenwork_user');
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('zenwork_user', JSON.stringify(updated));
      // In real app: Push updates to Supabase 'profiles' table here
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout,
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};