import React, { useState } from 'react';
import { Sparkles, Loader2, Lightbulb, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import { getWellnessInsight } from '../services/geminiService';
import { DailyLog, AIInsight } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface AICoachProps {
  logs: DailyLog[];
  userName: string;
  userRole: string;
  userGoal: string;
}

export const AICoach: React.FC<AICoachProps> = ({ logs, userName, userRole, userGoal }) => {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionCompleted, setActionCompleted] = useState(false);
  const { t, language } = useLanguage();

  const handleGenerate = async () => {
    setLoading(true);
    setActionCompleted(false);
    try {
      const result = await getWellnessInsight(logs, userName, userRole, userGoal, language);
      setInsight(result);
    } catch (e) {
      console.error(e);
      setInsight({
        title: t('aiCoach.errorTitle'),
        content: t('aiCoach.errorMessage'),
        actionableStep: t('aiCoach.errorAction')
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/50 shadow-sm transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{t('aiCoach.title')}</h3>
        </div>
        {!insight && (
          <Button onClick={handleGenerate} disabled={loading} variant="primary" className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('aiCoach.analyze')}
          </Button>
        )}
      </div>

      {loading && (
        <div className="py-8 text-center text-slate-500 dark:text-slate-400 animate-pulse">
          {t('aiCoach.analyzing')}
        </div>
      )}

      {insight && !loading && (
        <div className="animate-fade-in space-y-4 text-left">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-indigo-100 dark:border-slate-800 shadow-sm transition-colors duration-200">
            <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-lg mb-2">{insight.title}</h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{insight.content}</p>
            
            <div className={`border p-3 rounded-lg flex items-start gap-3 transition-colors ${actionCompleted ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-teal-50 border-teal-100 dark:bg-teal-900/20 dark:border-teal-800'}`}>
              {actionCompleted ? (
                 <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
              ) : (
                 <Lightbulb className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${actionCompleted ? 'text-green-600 dark:text-green-400' : 'text-teal-600 dark:text-teal-400'}`}>
                   {actionCompleted ? "Completed" : t('aiCoach.recommendation')}
                </span>
                <p className={`font-medium ${actionCompleted ? 'text-green-900 dark:text-green-200 line-through opacity-70' : 'text-teal-900 dark:text-teal-100'}`}>
                  {insight.actionableStep}
                </p>
              </div>
              {!actionCompleted && (
                 <button 
                   onClick={() => setActionCompleted(true)}
                   className="text-xs bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-700 px-2 py-1 rounded hover:bg-teal-50 dark:hover:bg-teal-900/50 transition-colors"
                 >
                   Mark Done
                 </button>
              )}
            </div>
          </div>
          <Button onClick={handleGenerate} variant="outline" fullWidth className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:bg-transparent dark:text-indigo-300 dark:border-indigo-800 dark:hover:bg-indigo-900/30 dark:hover:border-indigo-700">
            {t('aiCoach.refresh')}
          </Button>
        </div>
      )}
      
      {!insight && !loading && (
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {t('aiCoach.placeholder')}
        </p>
      )}
    </div>
  );
};