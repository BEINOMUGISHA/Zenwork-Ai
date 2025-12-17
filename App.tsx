import React, { useState, useEffect } from 'react';
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';
import { User, DailyLog, LanguageCode } from './types';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// Mock Data Generator
const generateMockLogs = (): DailyLog[] => {
  const logs: DailyLog[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    logs.push({
      id: `log-${i}`,
      date: d.toISOString(),
      mood: Math.floor(Math.random() * 3) + 3, // 3-5 range mostly
      stressLevel: Math.floor(Math.random() * 5) + 2, // 2-7 range
      hoursWorked: Math.floor(Math.random() * 4) + 6, // 6-10 hours
      waterIntake: Math.floor(Math.random() * 5) + 3,
      notes: "Feeling okay."
    });
  }
  return logs;
};

// Inner App Component to use the hook
const ZenWorkApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const { setLanguage } = useLanguage();

  // Initialize mock data on load
  useEffect(() => {
    setLogs(generateMockLogs());
  }, []);

  // Sync language and theme when user loads or updates
  useEffect(() => {
    if (user) {
      if (user.preferences.language) {
        setLanguage(user.preferences.language);
      }
      
      if (user.preferences.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Default to light if no user
      document.documentElement.classList.remove('dark');
    }
  }, [user, setLanguage]);

  const handleLogin = () => {
    // Simulate Auth
    setUser({
      id: 'u1',
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
        notifications: {
          email: true,
          push: true,
          dailyReminder: true
        },
        integrations: {
          appleHealth: false,
          googleFit: true,
          slack: false
        }
      },
      achievements: [
        { id: '1', title: 'First Steps', description: 'Logged first check-in', icon: '🚀', unlocked: true },
        { id: '2', title: 'Hydration Hero', description: 'Hit water goal 3 days in a row', icon: '💧', unlocked: true },
        { id: '3', title: 'Zen Master', description: 'Maintained low stress for a week', icon: '🧘', unlocked: false }
      ]
    });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setLanguage('en'); // Reset to default on logout
    document.documentElement.classList.remove('dark');
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      // Immediate language sync handled in effect
    }
  };

  const handleAddLog = (newLogData: Omit<DailyLog, 'id'>) => {
    const newLog: DailyLog = {
      ...newLogData,
      id: `log-${Date.now()}`
    };
    setLogs(prev => [...prev, newLog]);
  };

  if (!isAuthenticated || !user) {
    return <Landing onLogin={handleLogin} />;
  }

  return (
    <Dashboard 
      user={user} 
      logs={logs} 
      onAddLog={handleAddLog} 
      onLogout={handleLogout}
      onUpdateUser={handleUpdateUser}
    />
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ZenWorkApp />
    </LanguageProvider>
  );
};

export default App;