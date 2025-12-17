import React, { useState } from 'react';
import { X, Settings, Watch, Bell, Shield, Moon, Sun, Target } from 'lucide-react';
import { Button } from './Button';
import { User, LanguageCode, WellnessGoal } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, user, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'integrations' | 'notifications'>('profile');
  
  // Profile State
  const [waterGoal, setWaterGoal] = useState(user.preferences.waterGoal);
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [wellnessGoal, setWellnessGoal] = useState<WellnessGoal>(user.preferences.wellnessGoal || 'work_life_balance');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(user.preferences.language);
  const [theme, setTheme] = useState<'light' | 'dark'>(user.preferences.theme);
  
  // Integrations State
  const [integrations, setIntegrations] = useState(user.preferences.integrations || {
    appleHealth: false,
    googleFit: false,
    slack: false
  });

  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      role,
      preferences: {
        ...user.preferences,
        wellnessGoal,
        waterGoal,
        language: selectedLanguage,
        theme,
        integrations
      }
    });
    onClose();
  };

  const toggleIntegration = (key: keyof typeof integrations) => {
    setIntegrations(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        <div className="bg-slate-800 dark:bg-slate-950 p-4 flex items-center justify-between shrink-0">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {t('settings.title')}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 shrink-0">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'profile' ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            Profile
          </button>
          <button 
            onClick={() => setActiveTab('integrations')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'integrations' ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            {t('settings.integrations')}
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            {t('settings.notifications')}
          </button>
        </div>

        <div className="p-6 overflow-y-auto bg-white dark:bg-slate-900">
          {activeTab === 'profile' && (
            <form id="settings-form" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Personalization Section */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 mb-2">
                  <Target className="w-4 h-4" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">AI Personalization</h3>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('settings.wellnessGoal')}</label>
                  <select 
                    value={wellnessGoal}
                    onChange={(e) => setWellnessGoal(e.target.value as WellnessGoal)}
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="reduce_stress">{t('settings.goals.reduce_stress')}</option>
                    <option value="improve_focus">{t('settings.goals.improve_focus')}</option>
                    <option value="better_sleep">{t('settings.goals.better_sleep')}</option>
                    <option value="work_life_balance">{t('settings.goals.work_life_balance')}</option>
                    <option value="boost_energy">{t('settings.goals.boost_energy')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('settings.role')}</label>
                  <input 
                    type="text" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Remote Designer, Team Lead"
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('settings.displayName')}</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('settings.waterGoal')}</label>
                <input 
                  type="number" 
                  min="1"
                  max="20"
                  value={waterGoal}
                  onChange={(e) => setWaterGoal(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('settings.waterRec')}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('settings.language')}</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as LanguageCode)}
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('settings.theme')}</label>
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all ${theme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      {t('settings.lightMode')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all ${theme === 'dark' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      {t('settings.darkMode')}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-4">
               <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Sync your activity data automatically.</p>
               
               <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                 <div className="flex items-center gap-3">
                   <div className="bg-red-50 dark:bg-red-900/30 p-2 rounded-lg"><Watch className="w-5 h-5 text-red-500" /></div>
                   <div>
                     <h4 className="font-bold text-slate-800 dark:text-slate-200">Apple Health</h4>
                     <p className="text-xs text-slate-500 dark:text-slate-400">Syncs steps and sleep</p>
                   </div>
                 </div>
                 <Button 
                   onClick={() => toggleIntegration('appleHealth')}
                   variant={integrations.appleHealth ? 'primary' : 'outline'}
                   className="text-sm py-1 px-3"
                 >
                   {integrations.appleHealth ? t('settings.connected') : t('settings.connect')}
                 </Button>
               </div>

               <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                 <div className="flex items-center gap-3">
                   <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg"><Watch className="w-5 h-5 text-blue-500" /></div>
                   <div>
                     <h4 className="font-bold text-slate-800 dark:text-slate-200">Google Fit</h4>
                     <p className="text-xs text-slate-500 dark:text-slate-400">Syncs activity</p>
                   </div>
                 </div>
                 <Button 
                   onClick={() => toggleIntegration('googleFit')}
                   variant={integrations.googleFit ? 'primary' : 'outline'}
                   className="text-sm py-1 px-3"
                 >
                   {integrations.googleFit ? t('settings.connected') : t('settings.connect')}
                 </Button>
               </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3">
                 <div className="flex items-center gap-3">
                   <Bell className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                   <span className="text-slate-700 dark:text-slate-300 font-medium">Daily Reminders</span>
                 </div>
                 <div className="w-10 h-6 bg-teal-600 rounded-full relative cursor-pointer">
                   <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                 </div>
              </div>
              <div className="flex items-center justify-between p-3">
                 <div className="flex items-center gap-3">
                   <Shield className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                   <span className="text-slate-700 dark:text-slate-300 font-medium">Weekly Reports</span>
                 </div>
                 <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative cursor-pointer">
                   <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                 </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
          <Button onClick={handleSubmit} fullWidth variant="primary">{t('common.save')}</Button>
        </div>
      </div>
    </div>
  );
};