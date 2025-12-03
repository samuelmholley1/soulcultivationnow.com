import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', children, className = '', ...props }, ref) => {
    const baseStyles = 'px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] flex items-center justify-center';
    
    const variantStyles = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500 shadow-sm hover:shadow-md active:shadow-sm',
      secondary: 'border-2 border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 active:bg-slate-100 focus:ring-slate-500 shadow-sm hover:shadow-md active:shadow-sm',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
