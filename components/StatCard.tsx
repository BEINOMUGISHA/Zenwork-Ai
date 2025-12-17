import React, { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, iconBgColor }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center hover:shadow-md transition-all duration-200">
      <div className={`p-2 rounded-full mb-2 ${iconBgColor}`}>
        {icon}
      </div>
      <span className="text-2xl font-bold text-slate-800 dark:text-white">{value}</span>
      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</span>
    </div>
  );
};