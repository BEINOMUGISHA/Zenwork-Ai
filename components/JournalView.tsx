import React, { useState } from 'react';
import { DailyLog } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, Trash2, Droplets, Briefcase, Smile, Frown, Filter } from 'lucide-react';

interface JournalViewProps {
  logs: DailyLog[];
  onDeleteLog: (id: string) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({ logs, onDeleteLog }) => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'highStress' | 'lowMood'>('all');

  const filteredLogs = logs.filter(log => {
    if (filter === 'highStress') return log.stressLevel >= 7;
    if (filter === 'lowMood') return log.mood <= 2;
    return true;
  });

  const sortedLogs = [...filteredLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (logs.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">{t('dashboard.emptyJournal')}</p>
      </div>
    );
  }

  const getMoodIcon = (level: number) => {
    if (level >= 4) return <Smile className="w-5 h-5 text-green-500" />;
    if (level <= 2) return <Frown className="w-5 h-5 text-red-500" />;
    return <Smile className="w-5 h-5 text-yellow-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t('dashboard.journalTitle')}</h2>
          <p className="text-slate-500 dark:text-slate-400">{t('dashboard.journalSubtitle')}</p>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-slate-800 text-white dark:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
          >
            All Logs
          </button>
          <button 
             onClick={() => setFilter('highStress')}
             className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === 'highStress' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
          >
            High Stress
          </button>
          <button 
             onClick={() => setFilter('lowMood')}
             className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === 'lowMood' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
          >
            Needs Attention
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedLogs.map((log) => (
          <div key={log.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    {new Date(log.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => onDeleteLog(log.id)}
                className="text-slate-400 hover:text-red-500 transition-colors"
                title={t('dashboard.delete')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                   {getMoodIcon(log.mood)}
                   <span className="text-xs text-slate-500 dark:text-slate-400">{t('dashboard.moodLabel')}</span>
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200">{log.mood}/5</span>
              </div>

              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{t('dashboard.stressLabel')}</span>
                 </div>
                 <span className="font-bold text-slate-700 dark:text-slate-200">{log.stressLevel}/10</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg text-center">
                   <Briefcase className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                   <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">{log.hoursWorked}h</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg text-center">
                   <Droplets className="w-4 h-4 text-cyan-500 mx-auto mb-1" />
                   <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">{log.waterIntake}</span>
                </div>
              </div>
            </div>

            {log.notes && (
              <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                <p className="text-slate-600 dark:text-slate-400 text-xs italic line-clamp-2">"{log.notes}"</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};