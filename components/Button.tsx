import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-600/20 dark:shadow-none dark:hover:bg-teal-500",
    secondary: "bg-slate-800 text-white hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600",
    outline: "border-2 border-slate-200 text-slate-700 hover:border-teal-600 hover:text-teal-600 bg-white dark:bg-transparent dark:border-slate-700 dark:text-slate-300 dark:hover:border-teal-500 dark:hover:text-teal-500",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};