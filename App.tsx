import React, { useState, useEffect } from 'react';
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';
import { DailyLog } from './types';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineBanner } from './components/OfflineBanner';
import { storageService } from './services/storageService';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { Loader2 } from 'lucide-react';

// Inner App Component to use the auth hook
const ZenWorkApp: React.FC = () => {
  const { user, isAuthenticated, login, logout, updateUser, isLoading: authLoading } = useAuth();
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const { setLanguage } = useLanguage();
  const isOnline = useOnlineStatus();

  // Sync language and theme
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
      document.documentElement.classList.remove('dark');
    }
  }, [user, setLanguage]);

  // Fetch Logs when user changes or comes online
  useEffect(() => {
    const fetchLogs = async () => {
      if (user) {
        setDataLoading(true);
        try {
          // Attempt sync if online
          if (isOnline) {
             await storageService.syncPending(user.id);
          }
          const data = await storageService.getLogs(user.id);
          setLogs(data);
        } catch (error) {
          console.error("Failed to fetch logs", error);
        } finally {
          setDataLoading(false);
        }
      }
    };
    fetchLogs();
  }, [user, isOnline]);

  const handleAddLog = async (newLogData: Omit<DailyLog, 'id'>) => {
    if (!user) return;
    
    const newLog: DailyLog = {
      ...newLogData,
      id: `log-${Date.now()}` // Temporary ID, real DB would generate UUID
    };
    
    // Optimistic Update
    setLogs(prev => [newLog, ...prev]); // Add to top
    
    // Persist
    await storageService.saveLog(newLog, user.id);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Landing onLogin={login} />;
  }

  return (
    <>
      <Dashboard 
        user={user} 
        logs={logs} 
        onAddLog={handleAddLog} 
        onLogout={logout}
        onUpdateUser={updateUser}
      />
      <OfflineBanner />
    </>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <ZenWorkApp />
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;