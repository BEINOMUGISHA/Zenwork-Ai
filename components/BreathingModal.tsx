import React, { useState, useEffect } from 'react';
import { X, Wind } from 'lucide-react';
import { Button } from './Button';
import { useLanguage } from '../contexts/LanguageContext';

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BreathingModal: React.FC<BreathingModalProps> = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'idle'>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycles, setCycles] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) {
      setPhase('idle');
      setCycles(0);
      return;
    }
    
    // Start cycle
    setPhase('inhale');
    setTimeLeft(4);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || phase === 'idle') return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Transition phases
      if (phase === 'inhale') {
        setPhase('hold');
        setTimeLeft(7);
      } else if (phase === 'hold') {
        setPhase('exhale');
        setTimeLeft(8);
      } else if (phase === 'exhale') {
        if (cycles < 3) {
          setCycles(prev => prev + 1);
          setPhase('inhale');
          setTimeLeft(4);
        } else {
          setPhase('idle'); // Done
        }
      }
    }
  }, [timeLeft, phase, isOpen, cycles]);

  if (!isOpen) return null;

  const getInstruction = () => {
    switch (phase) {
      case 'inhale': return t('breathe.inhale');
      case 'hold': return t('breathe.hold');
      case 'exhale': return t('breathe.exhale');
      default: return t('breathe.completed');
    }
  };

  const getCircleSize = () => {
    switch (phase) {
      case 'inhale': return 'scale-150';
      case 'hold': return 'scale-150';
      case 'exhale': return 'scale-100';
      default: return 'scale-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative border border-slate-700">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>

        <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-white font-bold text-xl mb-12 flex items-center gap-2">
            <Wind className="w-5 h-5 text-teal-400" />
            {t('breathe.title')}
          </h2>

          <div className="relative flex items-center justify-center mb-12">
            {/* Outer rings */}
            <div className={`absolute w-48 h-48 bg-teal-500/20 rounded-full transition-transform duration-[4000ms] ease-in-out ${phase === 'inhale' ? 'scale-150' : 'scale-100'}`}></div>
            <div className={`absolute w-32 h-32 bg-teal-500/30 rounded-full transition-transform duration-[4000ms] ease-in-out ${phase === 'inhale' ? 'scale-125' : 'scale-100'}`}></div>
            
            {/* Core Circle */}
            <div className={`w-24 h-24 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full shadow-[0_0_40px_rgba(45,212,191,0.5)] flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${getCircleSize()}`}>
              <span className="text-white font-bold text-2xl">{timeLeft > 0 ? timeLeft : '✓'}</span>
            </div>
          </div>

          <p className="text-2xl font-light text-slate-200 animate-pulse">
            {getInstruction()}
          </p>
          
          {phase === 'idle' && (
             <Button onClick={onClose} className="mt-8">{t('breathe.close')}</Button>
          )}
        </div>
      </div>
    </div>
  );
};
