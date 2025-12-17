import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid 
} from 'recharts';
import { Plus, Flame, Activity, Clock, Droplets, Settings, Wind, Trophy, Users, Heart, LayoutDashboard, Book, BrainCircuit, CheckCircle2, Circle, Zap } from 'lucide-react';
import { Button } from './Button';
import { DailyLog, User, TeamUpdate, Quest } from '../types';
import { CheckInModal } from './CheckInModal';
import { SettingsModal } from './SettingsModal';
import { BreathingModal } from './BreathingModal';
import { AICoach } from './AICoach';
import { StatCard } from './StatCard';
import { JournalView } from './JournalView';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  user: User;
  logs: DailyLog[];
  onAddLog: (log: Omit<DailyLog, 'id'>) => void;
  onLogout: () => void;
  onUpdateUser: (updates: Partial<User>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, logs, onAddLog, onLogout, onUpdateUser }) => {
  const [isCheckInOpen, setIsCheckInOpen] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isBreathingOpen, setIsBreathingOpen] = React.useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'journal' | 'coach'>('overview');
  const [breatheCompleted, setBreatheCompleted] = useState(false);
  const { t } = useLanguage();

  // Calculate Zen Score
  const calculateZenScore = (): number => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLog = logs.find(log => log.date.startsWith(todayStr));
    
    if (!todayLog) return 0;

    // Weight: Mood 40%, Stress 40%, Water 20%
    const moodScore = (todayLog.mood / 5) * 40;
    const stressScore = ((10 - todayLog.stressLevel) / 10) * 40;
    const waterScore = Math.min((todayLog.waterIntake / user.preferences.waterGoal), 1) * 20;

    return Math.round(moodScore + stressScore + waterScore);
  };

  const zenScore = calculateZenScore();
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(log => log.date.startsWith(todayStr));

  // Daily Quests Logic
  const quests: Quest[] = [
    { 
      id: 'q1', 
      title: t('dashboard.questCheckin'), 
      completed: !!todayLog, 
      xpReward: 50,
      type: 'checkin'
    },
    { 
      id: 'q2', 
      title: t('dashboard.questWater'), 
      completed: !!todayLog && todayLog.waterIntake >= user.preferences.waterGoal, 
      xpReward: 30,
      type: 'water'
    },
    { 
      id: 'q3', 
      title: t('dashboard.questBreathe'), 
      completed: breatheCompleted, 
      xpReward: 20,
      type: 'breathe'
    }
  ];

  const completedQuests = quests.filter(q => q.completed).length;
  const progressPercent = (completedQuests / quests.length) * 100;

  // Prepare data for charts
  const chartData = logs.slice(-7).map(log => ({
    name: new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' }),
    mood: log.mood,
    stress: log.stressLevel,
    work: log.hoursWorked
  }));

  // Calculate averages
  const avgMood = (logs.reduce((acc, log) => acc + log.mood, 0) / logs.length).toFixed(1);
  const avgWork = (logs.reduce((acc, log) => acc + log.hoursWorked, 0) / logs.length).toFixed(1);
  const streak = 3; // Mock streak calculation
  
  // Water stats
  const todayWater = todayLog ? todayLog.waterIntake : 0;
  const waterGoal = user.preferences.waterGoal;

  // Mock Team Updates
  const teamUpdates: TeamUpdate[] = [
    { id: '1', user: 'Alex', action: 'completed a 5-day streak!', time: '2h ago', type: 'milestone' },
    { id: '2', user: 'Maria', action: 'logged a great mood', time: '4h ago', type: 'wellness' },
    { id: '3', user: 'Team', action: 'reached 50 log check-ins', time: '1d ago', type: 'milestone' },
  ];

  // Mock delete
  const handleDeleteLog = (id: string) => {
    console.log("Delete log", id);
  };

  const handleBreatheClose = () => {
    setIsBreathingOpen(false);
    // In real app, check if session actually finished
    setBreatheCompleted(true);
  };

  const handleQuestClick = (quest: Quest) => {
    if (quest.completed) return;
    if (quest.type === 'checkin') setIsCheckInOpen(true);
    if (quest.type === 'water') setIsCheckInOpen(true); // Direct to modify log
    if (quest.type === 'breathe') setIsBreathingOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-teal-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-teal-200 dark:shadow-teal-900/30">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">{user.name}</h1>
                <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                   Lvl {user.level?.currentLevel || 1}
                </span>
              </div>
              <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full" 
                  style={{ width: `${((user.level?.currentXp || 0) / (user.level?.nextLevelXp || 100)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsSettingsOpen(true)} className="text-sm px-3 py-1 text-slate-500 dark:text-slate-400">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={onLogout} className="text-sm px-3 py-1">
              {t('common.signOut')}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="sticky top-[73px] z-20 bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex overflow-x-auto whitespace-nowrap min-w-[100px] transition-colors duration-200">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 min-w-[100px] ${activeTab === 'overview' ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            {t('dashboard.tabOverview')}
          </button>
          <button 
            onClick={() => setActiveTab('journal')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 min-w-[100px] ${activeTab === 'journal' ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            <Book className="w-4 h-4" />
            {t('dashboard.tabJournal')}
          </button>
          <button 
            onClick={() => setActiveTab('coach')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 min-w-[100px] ${activeTab === 'coach' ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            <BrainCircuit className="w-4 h-4" />
            {t('dashboard.tabCoach')}
          </button>
        </div>

        {/* Tab Content: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* HOOK: Daily Command Center */}
            <div className="grid md:grid-cols-2 gap-6">
               {/* Hook 1: Zen Score (The Trigger) */}
               <div className="bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-900 dark:to-slate-900 rounded-2xl p-6 text-white shadow-xl flex items-center justify-between relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                  <div>
                    <h2 className="text-3xl font-bold mb-1">{zenScore}</h2>
                    <p className="text-indigo-100 text-sm font-medium mb-4">{t('dashboard.zenScore')}</p>
                    <p className="text-xs text-indigo-200 opacity-80 max-w-[150px]">{t('dashboard.zenScoreDesc')}</p>
                  </div>
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path className="text-indigo-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path className="text-white drop-shadow-lg" strokeDasharray={`${zenScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    </svg>
                    <Zap className="w-8 h-8 absolute text-yellow-300 fill-yellow-300 animate-pulse" />
                  </div>
               </div>

               {/* Hook 2: Daily Quests (The Action) */}
               <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                     <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                     {t('dashboard.dailyQuests')}
                   </h3>
                   <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{completedQuests}/{quests.length}</span>
                 </div>
                 <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mb-4">
                   <div className="bg-teal-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                 </div>
                 <div className="space-y-3">
                   {quests.map(quest => (
                     <div 
                       key={quest.id} 
                       onClick={() => handleQuestClick(quest)}
                       className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${quest.completed ? 'bg-teal-50 border-teal-100 dark:bg-teal-900/20 dark:border-teal-800' : 'bg-white border-slate-100 hover:border-teal-300 dark:bg-slate-800/50 dark:border-slate-700 dark:hover:border-teal-600'}`}
                     >
                       <div className="flex items-center gap-3">
                         {quest.completed ? (
                           <div className="bg-teal-500 rounded-full p-0.5"><CheckCircle2 className="w-4 h-4 text-white" /></div>
                         ) : (
                           <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                         )}
                         <span className={`text-sm font-medium ${quest.completed ? 'text-teal-900 dark:text-teal-100 line-through opacity-70' : 'text-slate-700 dark:text-slate-300'}`}>{quest.title}</span>
                       </div>
                       <span className="text-xs font-bold text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-md">+{quest.xpReward} XP</span>
                     </div>
                   ))}
                 </div>
               </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                icon={<Flame className="w-5 h-5 text-orange-500" />}
                iconBgColor="bg-orange-100 dark:bg-orange-900/40"
                value={`${streak} ${t('common.days')}`}
                label={t('dashboard.streak')}
              />
              
              <StatCard 
                icon={<Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
                iconBgColor="bg-teal-100 dark:bg-teal-900/40"
                value={`${avgMood}/5`}
                label={t('dashboard.avgMood')}
              />
              
              <StatCard 
                icon={<Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                iconBgColor="bg-blue-100 dark:bg-blue-900/40"
                value={`${avgWork}h`}
                label={t('dashboard.avgWork')}
              />

              <StatCard 
                icon={<Droplets className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />}
                iconBgColor="bg-cyan-100 dark:bg-cyan-900/40"
                value={`${todayWater} / ${waterGoal}`}
                label={t('dashboard.hydration')}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Main Content - Left 2/3 */}
              <div className="md:col-span-2 space-y-6">
                {/* AI Section (Mini) */}
                <AICoach 
                  logs={logs} 
                  userName={user.name} 
                  userRole={user.role} 
                  userGoal={user.preferences.wellnessGoal || 'work_life_balance'}
                />

                {/* Charts Section */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-200">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6">{t('dashboard.chartMood')}</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                        <XAxis dataKey="name" tick={{fontSize: 12}} stroke="#94a3b8" />
                        <YAxis domain={[0, 10]} hide />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} 
                          itemStyle={{ color: '#f8fafc' }}
                        />
                        <Area type="monotone" dataKey="mood" stroke="#0d9488" fillOpacity={1} fill="url(#colorMood)" strokeWidth={2} />
                        <Area type="monotone" dataKey="stress" stroke="#f43f5e" fill="none" strokeWidth={2} strokeDasharray="5 5" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-200">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6">{t('dashboard.chartWork')}</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                        <XAxis dataKey="name" tick={{fontSize: 12}} stroke="#94a3b8" />
                        <YAxis hide />
                        <Tooltip 
                          cursor={{fill: 'transparent'}} 
                          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} 
                        />
                        <Bar dataKey="work" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Right Sidebar - 1/3 */}
              <div className="space-y-6">
                
                {/* Gamification / Achievements */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-200">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    {t('dashboard.achievements')}
                  </h3>
                  <div className="space-y-4">
                    {user.achievements.map(ach => (
                      <div key={ach.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors duration-200 ${ach.unlocked ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-900/30' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 grayscale opacity-60'}`}>
                        <div className="text-2xl">{ach.icon}</div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{ach.title}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{ach.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Pulse / Social */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-200">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-500" />
                    {t('dashboard.teamPulse')}
                  </h3>
                  <div className="space-y-4">
                    {teamUpdates.map(update => (
                      <div key={update.id} className="flex gap-3 items-start pb-3 border-b border-slate-50 dark:border-slate-800 last:border-0">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                          {update.user.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            <span className="font-bold">{update.user}</span> {update.action}
                          </p>
                          <span className="text-xs text-slate-400">{update.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" fullWidth className="mt-4 text-xs">View Team Board</Button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Journal */}
        {activeTab === 'journal' && (
           <div className="animate-fade-in">
             <JournalView logs={logs} onDeleteLog={handleDeleteLog} />
           </div>
        )}

        {/* Tab Content: Coach */}
        {activeTab === 'coach' && (
           <div className="animate-fade-in space-y-6">
             <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm text-center transition-colors duration-200">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BrainCircuit className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('aiCoach.title')}</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-8">
                  Your personal AI coach analyzes your mood logs, work hours, and stress levels to provide tailored advice for better work-life balance.
                </p>
                <AICoach 
                  logs={logs} 
                  userName={user.name} 
                  userRole={user.role} 
                  userGoal={user.preferences.wellnessGoal || 'work_life_balance'}
                />
             </div>
           </div>
        )}

      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsCheckInOpen(true)}
        className="fixed bottom-6 right-6 bg-slate-900 dark:bg-teal-600 text-white p-4 rounded-full shadow-lg shadow-slate-900/30 dark:shadow-teal-900/40 hover:scale-110 transition-transform focus:outline-none focus:ring-4 focus:ring-slate-900/20 z-50"
      >
        <Plus className="w-6 h-6" />
      </button>

      <CheckInModal 
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSubmit={onAddLog}
        waterGoal={user.preferences.waterGoal}
      />
      
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onUpdateUser={onUpdateUser}
      />

      <BreathingModal 
        isOpen={isBreathingOpen}
        onClose={handleBreatheClose}
      />
    </div>
  );
};