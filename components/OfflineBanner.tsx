import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white py-2 px-4 text-center z-50 flex items-center justify-center gap-2 text-sm animate-fade-in-up">
      <WifiOff className="w-4 h-4 text-slate-400" />
      <span>You are currently offline. Changes will sync when connection is restored.</span>
    </div>
  );
};