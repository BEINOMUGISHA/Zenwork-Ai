import React from 'react';
import { Activity, ShieldCheck, Zap, Globe } from 'lucide-react';
import { Button } from './Button';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageCode } from '../types';

interface LandingProps {
  onLogin: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onLogin }) => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
      <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl text-teal-700 dark:text-teal-400">
          <Activity className="w-6 h-6" />
          <span>{t('common.appName')}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <button className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium">
              <Globe className="w-4 h-4" />
              <span className="uppercase">{language}</span>
            </button>
            <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-100 dark:border-slate-800 hidden group-hover:block z-10">
              {(['en', 'es', 'fr', 'de'] as LanguageCode[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 ${language === lang ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  {lang === 'en' ? 'English' : lang === 'es' ? 'Español' : lang === 'fr' ? 'Français' : 'Deutsch'}
                </button>
              ))}
            </div>
          </div>
          <button className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium">{t('landing.pricing')}</button>
          <button onClick={onLogin} className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium">{t('common.login')}</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-semibold text-sm mb-6">
          {t('landing.newFeature')}
        </span>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
          {t('landing.titleStart')}<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600 dark:from-teal-400 dark:to-blue-500">
            {t('landing.titleEnd')}
          </span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
          {t('landing.subtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button onClick={onLogin} className="w-full sm:w-auto px-8 py-4 text-lg">
            {t('landing.startTrial')}
          </Button>
          <Button variant="outline" className="w-full sm:w-auto px-8 py-4 text-lg dark:bg-transparent dark:text-white dark:border-slate-700 dark:hover:bg-slate-800">
            {t('landing.viewDemo')}
          </Button>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl transition-colors duration-200">
            <div className="bg-white dark:bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm mb-4">
              <Zap className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">{t('landing.featureCoaching')}</h3>
            <p className="text-slate-600 dark:text-slate-400">{t('landing.featureCoachingDesc')}</p>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl transition-colors duration-200">
            <div className="bg-white dark:bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm mb-4">
              <Activity className="w-6 h-6 text-teal-500" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">{t('landing.featureMood')}</h3>
            <p className="text-slate-600 dark:text-slate-400">{t('landing.featureMoodDesc')}</p>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl transition-colors duration-200">
            <div className="bg-white dark:bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm mb-4">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">{t('landing.featurePrivacy')}</h3>
            <p className="text-slate-600 dark:text-slate-400">{t('landing.featurePrivacyDesc')}</p>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800">
          <p className="text-sm text-slate-400 dark:text-slate-600 font-medium uppercase tracking-widest mb-6">{t('landing.trustedBy')}</p>
          <div className="flex justify-center gap-12 opacity-50 grayscale dark:invert">
            <span className="font-bold text-xl">ACME Corp</span>
            <span className="font-bold text-xl">Stark Ind</span>
            <span className="font-bold text-xl">Globex</span>
          </div>
        </div>
      </div>
    </div>
  );
};