import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Lightbulb, CheckCircle2, RefreshCw, MessageSquareQuote, BrainCircuit } from 'lucide-react';
import { Button } from './Button';
import { getWellnessInsight } from '../services/geminiService';
import { DailyLog, AIInsight, WellnessMetrics } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface AICoachProps {
  logs: DailyLog[];
  metrics: WellnessMetrics;
  userName: string;
  userRole: string;
  userGoal: string;
}

export const AICoach: React.FC<AICoachProps> = ({ logs, metrics, userName, userRole, userGoal }) => {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionCompleted, setActionCompleted] = useState(false);
  const { t, language } = useLanguage();

  const handleGenerate = async () => {
    setLoading(true);
    setActionCompleted(false);
    try {
      const result = await getWellnessInsight(logs, userName, userRole, userGoal, metrics, language);
      setInsight(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate on first mount if we have logs
  useEffect(() => {
    if (logs.length > 0 && !insight && !loading) {
        handleGenerate();
    }
  }, [logs.length]); // Only re-trigger if log count changes significantly, mostly just on mount

  const getToneStyles = (tone: string) => {
    switch (tone) {
      case 'empathetic':
      case 'calm':
        return {
          bg: 'bg-teal-50 dark:bg-teal-900/10',
          border: 'border-teal-100 dark:border-teal-800',
          text: 'text-teal-800 dark:text-teal-200',
          icon: 'text-teal-600 dark:text-teal-400'
        };
      case 'energetic':
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/10',
          border: 'border-orange-100 dark:border-orange-800',
          text: 'text-orange-800 dark:text-orange-200',
          icon: 'text-orange-600 dark:text-orange-400'
        };
      case 'analytical':
      default:
        return {
          bg: 'bg-indigo-50 dark:bg-indigo-900/10',
          border: 'border-indigo-100 dark:border-indigo-800',
          text: 'text-indigo-800 dark:text-indigo-200',
          icon: 'text-indigo-600 dark:text-indigo-400'
        };
    }
  };

  if (loading) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm text-center min-h-[300px] flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-4" />
            <p className="text-slate-600 dark:text-slate-400 font-medium animate-pulse">{t('aiCoach.analyzing')}</p>
        </div>
    );
  }

  if (!insight) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm text-center min-h-[300px] flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-4">
                <BrainCircuit className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('aiCoach.title')}</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">{t('aiCoach.placeholder')}</p>
            <Button onClick={handleGenerate}>{t('aiCoach.analyze')}</Button>
        </div>
    );
  }

  const styles = getToneStyles(insight.tone);

  return (
    <div className={`rounded-2xl p-6 border shadow-sm transition-all duration-300 ${styles.bg} ${styles.border}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className={`w-5 h-5 ${styles.icon}`} />
          <h3 className={`font-bold text-lg ${styles.text}`}>Daily Briefing</h3>
        </div>
        <button 
          onClick={handleGenerate}
          className={`p-2 rounded-full hover:bg-white/50 dark:hover:bg-black/20 transition-colors ${styles.icon}`}
          title={t('aiCoach.refresh')}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Summary Section */}
        <div className="bg-white dark:bg-slate-900/80 p-5 rounded-xl border border-slate-100 dark:border-slate-800/50 shadow-sm">
            <p className="text-lg font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                {insight.summary}
            </p>
        </div>

        {/* Analysis Section */}
        <div className="flex gap-4 items-start">
            <MessageSquareQuote className={`w-6 h-6 shrink-0 mt-1 ${styles.icon}`} />
            <div>
                <h4 className="text-sm font-bold uppercase tracking-wider opacity-70 mb-1 text-slate-600 dark:text-slate-400">Why you feel this way</h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    {insight.analysis}
                </p>
            </div>
        </div>

        {/* Action Section */}
        <div className={`border p-4 rounded-xl flex items-start gap-4 transition-all ${actionCompleted ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'}`}>
             <div className={`p-2 rounded-lg shrink-0 ${actionCompleted ? 'bg-green-100 dark:bg-green-900/50' : 'bg-slate-100 dark:bg-slate-800'}`}>
                {actionCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                    <Lightbulb className={`w-5 h-5 ${styles.icon}`} />
                )}
             </div>
             <div className="flex-1">
                <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${actionCompleted ? 'text-green-600 dark:text-green-400' : styles.text}`}>
                   {actionCompleted ? "Completed" : t('aiCoach.recommendation')}
                </span>
                <p className={`font-medium ${actionCompleted ? 'text-green-900 dark:text-green-200 line-through opacity-70' : 'text-slate-900 dark:text-white'}`}>
                  {insight.actionableStep}
                </p>
             </div>
             {!actionCompleted && (
                 <button 
                   onClick={() => setActionCompleted(true)}
                   className="self-center text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                 >
                   Done
                 </button>
             )}
        </div>
      </div>
    </div>
  );
};