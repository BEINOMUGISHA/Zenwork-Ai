import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid 
} from 'recharts';
import { Plus, Flame, Activity, Clock, Droplets, Settings, Wind, Trophy, Users, Heart, LayoutDashboard, Book, BrainCircuit, CheckCircle2, Circle, Zap, Battery, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { DailyLog, User, TeamUpdate, Quest, WellnessMetrics } from '../types';
import { CheckInModal } from './CheckInModal';
import { SettingsModal } from './SettingsModal';
import { BreathingModal } from './BreathingModal';
import { AICoach } from './AICoach';
import { StatCard } from './StatCard';
import { JournalView } from './JournalView';
import { useLanguage } from '../contexts/LanguageContext';
import { calculateWellnessMetrics } from '../utils/scoringEngine';

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

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(log => log.date.startsWith(todayStr));

  // Compute Wellness Metrics
  const metrics: WellnessMetrics = useMemo(() => {
    // Filter out today from previous logs to avoid double counting in averages
    const history = logs.filter(l => !l.date.startsWith(todayStr));
    return calculateWellnessMetrics(todayLog, history, user.preferences.waterGoal);
  }, [logs, todayLog, user.preferences.waterGoal, todayStr]);

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
    setBreatheCompleted(true);
  };

  const handleQuestClick = (quest: Quest) => {
    if (quest.completed) return;
    if (quest.type === 'checkin') setIsCheckInOpen(true);
    if (quest.type === 'water') setIsCheckInOpen(true);
    if (quest.type === 'breathe') setIsBreathingOpen(true);
  };

  const getNervousSystemColor = (state: string) => {
    switch (state) {
      case 'flow': return 'from-teal-500 to-emerald-600';
      case 'activated': return 'from-blue-500 to-indigo-600';
      case 'overdrive': return 'from-orange-500 to-red-600';
      case 'recharge': return 'from-slate-500 to-gray-600';
      default: return 'from-teal-500 to-emerald-600';
    }
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
               {/* Hook 1: Nervous System State (Replaces Zen Score) */}
               <div className={`bg-gradient-to-br ${getNervousSystemColor(metrics.nervousSystem.state)} rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between relative overflow-hidden h-[220px]`}>
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                  
                  <div className="flex justify-between items-start z-10">
                    <div>
                      <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">Nervous System State</p>
                      <h2 className="text-2xl font-bold">{metrics.nervousSystem.label}</h2>
                    </div>
                    {metrics.nervousSystem.state === 'overdrive' ? <AlertTriangle className="w-6 h-6 text-white animate-pulse" /> : <Zap className="w-6 h-6 text-white" />}
                  </div>

                  <p className="text-sm text-white/90 font-medium max-w-[80%] z-10">
                    {metrics.nervousSystem.description}
                  </p>
                  
                  {metrics.contributors.negative.length > 0 && (
                    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-2 mt-2 z-10">
                      <p className="text-xs text-white/80 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> 
                        Wait: {metrics.contributors.negative[0]}
                      </p>
                    </div>
                  )}

                  {/* Decorative Chart Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-white/10 opacity-30">
                    <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                      <path d="M0 15 Q 20 5, 40 10 T 80 15 T 100 10" stroke="white" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
               </div>

               {/* Hook 2: Dynamic Wellness Metrics */}
               <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-[220px]">
                 <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                   <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                   Today's Biometrics
                 </h3>
                 
                 <div className="space-y-4 flex-1 flex flex-col justify-center">
                   {/* Recovery Score */}
                   <div>
                     <div className="flex justify-between text-sm mb-1">
                       <span className="text-slate-500 dark:text-slate-400 font-medium">Recovery Readiness</span>
                       <span className={`font-bold ${metrics.recoveryScore > 70 ? 'text-green-600' : 'text-orange-500'}`}>{Math.round(metrics.recoveryScore)}%</span>
                     </div>
                     <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                       <div 
                         className={`h-full rounded-full transition-all duration-1000 ${metrics.recoveryScore > 70 ? 'bg-green-500' : 'bg-orange-500'}`} 
                         style={{ width: `${metrics.recoveryScore}%` }}
                       ></div>
                     </div>
                   </div>

                   {/* Energy Score */}
                   <div>
                     <div className="flex justify-between text-sm mb-1">
                       <span className="text-slate-500 dark:text-slate-400 font-medium">Energy Level</span>
                       <span className="font-bold text-blue-600">{Math.round(metrics.energyScore)}%</span>
                     </div>
                     <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                         style={{ width: `${metrics.energyScore}%` }}
                       ></div>
                     </div>
                   </div>

                   {/* Stress Score (Inverted Visual: High stress bar is bad) */}
                   <div>
                     <div className="flex justify-between text-sm mb-1">
                       <span className="text-slate-500 dark:text-slate-400 font-medium">Stress Load</span>
                       <span className={`font-bold ${metrics.stressScore > 60 ? 'text-red-500' : 'text-teal-600'}`}>{Math.round(metrics.stressScore)}</span>
                     </div>
                     <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                       <div 
                         className={`h-full rounded-full transition-all duration-1000 ${metrics.stressScore > 60 ? 'bg-red-500' : 'bg-teal-500'}`} 
                         style={{ width: `${metrics.stressScore}%` }}
                       ></div>
                     </div>
                   </div>
                 </div>
               </div>
            </div>

            {/* Daily Quests Strip */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4 overflow-x-auto">
                <div className="flex items-center gap-3 shrink-0">
                  <div className="bg-teal-100 dark:bg-teal-900/40 p-2 rounded-lg">
                    <Trophy className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">Daily Quests</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{completedQuests}/{quests.length} Completed</p>
                  </div>
                </div>

                <div className="flex gap-3 flex-1 justify-end">
                   {quests.map(quest => (
                     <button 
                       key={quest.id}
                       onClick={() => handleQuestClick(quest)}
                       className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all whitespace-nowrap ${quest.completed ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/20 dark:border-teal-800 dark:text-teal-400' : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}`}
                     >
                       {quest.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                       {quest.title}
                     </button>
                   ))}
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