import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { DailyLog, User } from '../types';

const STORAGE_KEYS = {
  LOGS: 'zenwork_logs',
  USER: 'zenwork_user',
  PENDING_SYNCS: 'zenwork_pending_syncs'
};

// Mock data generator for demo mode
const generateMockLogs = (): DailyLog[] => {
  const logs: DailyLog[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    logs.push({
      id: `log-${i}`,
      date: d.toISOString(),
      mood: Math.floor(Math.random() * 3) + 3,
      stressLevel: Math.floor(Math.random() * 5) + 2,
      hoursWorked: Math.floor(Math.random() * 4) + 6,
      waterIntake: Math.floor(Math.random() * 5) + 3,
      notes: "Feeling okay."
    });
  }
  return logs;
};

export const storageService = {
  
  async getLogs(userId: string): Promise<DailyLog[]> {
    // 1. Try Local Storage First (Optimistic UI)
    const localLogsStr = localStorage.getItem(STORAGE_KEYS.LOGS);
    let localLogs: DailyLog[] = localLogsStr ? JSON.parse(localLogsStr) : [];

    // If empty and in demo mode, seed it
    if (localLogs.length === 0 && !isSupabaseConfigured) {
      localLogs = generateMockLogs();
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(localLogs));
    }

    // 2. If Supabase is active and we are online, fetch & sync
    if (isSupabaseConfigured && navigator.onLine) {
      try {
        const { data, error } = await supabase!
          .from('daily_logs')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });

        if (error) throw error;
        
        if (data) {
          // Merge logic could be here, for now, server wins
          localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(data));
          return data as DailyLog[];
        }
      } catch (error) {
        console.error("Supabase fetch error, falling back to local:", error);
      }
    }

    return localLogs;
  },

  async saveLog(log: DailyLog, userId: string): Promise<void> {
    // 1. Save Local
    const logs = await this.getLogs(userId);
    const updatedLogs = [...logs, log];
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updatedLogs));

    // 2. Try Remote
    if (isSupabaseConfigured && navigator.onLine) {
      try {
        const { error } = await supabase!
          .from('daily_logs')
          .insert([{ ...log, user_id: userId }]);
        
        if (error) throw error;
      } catch (error) {
        console.error("Sync failed, queuing for retry", error);
        this.queueForSync({ type: 'INSERT_LOG', payload: log });
      }
    } else if (isSupabaseConfigured) {
      this.queueForSync({ type: 'INSERT_LOG', payload: log });
    }
  },

  async deleteLog(logId: string, userId: string): Promise<void> {
    const logs = await this.getLogs(userId);
    const updatedLogs = logs.filter(l => l.id !== logId);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updatedLogs));

    if (isSupabaseConfigured && navigator.onLine) {
       await supabase!.from('daily_logs').delete().eq('id', logId);
    }
  },

  queueForSync(action: any) {
    const pending = JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_SYNCS) || '[]');
    pending.push(action);
    localStorage.setItem(STORAGE_KEYS.PENDING_SYNCS, JSON.stringify(pending));
  },

  async syncPending(userId: string) {
    if (!isSupabaseConfigured || !navigator.onLine) return;

    const pending = JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_SYNCS) || '[]');
    if (pending.length === 0) return;

    // Process queue
    const remaining = [];
    for (const action of pending) {
      try {
        if (action.type === 'INSERT_LOG') {
          await supabase!.from('daily_logs').insert([{ ...action.payload, user_id: userId }]);
        }
      } catch (e) {
        remaining.push(action); // Keep failed actions
      }
    }
    
    localStorage.setItem(STORAGE_KEYS.PENDING_SYNCS, JSON.stringify(remaining));
  }
};