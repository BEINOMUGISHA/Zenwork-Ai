import React, { useState } from 'react';
import { X, Droplets, Briefcase, Frown, Smile } from 'lucide-react';
import { Button } from './Button';
import { DailyLog } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (log: Omit<DailyLog, 'id'>) => void;
  waterGoal: number;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ isOpen, onClose, onSubmit, waterGoal }) => {
  const [mood, setMood] = useState(3);
  const [stressLevel, setStressLevel] = useState(5);
  const [hoursWorked, setHoursWorked] = useState(8);
  const [waterIntake, setWaterIntake] = useState(4);
  const [notes, setNotes] = useState('');
  
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date: new Date().toISOString(),
      mood,
      stressLevel,
      hoursWorked,
      waterIntake,
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="bg-teal-600 dark:bg-teal-700 p-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">{t('checkIn.title')}</h2>
          <button onClick={onClose} className="text-teal-100 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Mood Slider */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('checkIn.question')}</label>
            <div className="flex items-center justify-between px-2 mb-2">
              <Frown className={`w-6 h-6 ${mood <= 2 ? 'text-red-500' : 'text-slate-300 dark:text-slate-600'}`} />
              <Smile className={`w-6 h-6 ${mood >= 4 ? 'text-green-500' : 'text-slate-300 dark:text-slate-600'}`} />
            </div>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={mood} 
              onChange={(e) => setMood(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{t('checkIn.struggling')}</span>
              <span>{t('checkIn.thriving')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Hours Worked */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Briefcase className="w-4 h-4 text-slate-400" />
                {t('checkIn.workHours')}
              </label>
              <input 
                type="number" 
                value={hoursWorked}
                onChange={(e) => setHoursWorked(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            {/* Water Intake */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Droplets className="w-4 h-4 text-blue-400" />
                {t('checkIn.water')}
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={waterIntake}
                  onChange={(e) => setWaterIntake(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none flex-1"
                />
                <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap font-medium">/ {waterGoal} {t('common.goal')}</span>
              </div>
            </div>
          </div>

          {/* Stress Level */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('checkIn.stressLevel')}</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setStressLevel(num)}
                  className={`flex-1 h-8 rounded text-xs font-bold transition-colors ${
                    stressLevel === num 
                      ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" fullWidth>{t('checkIn.submit')}</Button>
        </form>
      </div>
    </div>
  );
};