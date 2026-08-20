import React from 'react';
import { cn } from '../../lib/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'icon' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none text-sm',
          // Size mappings (ignore for icon variant)
          variant !== 'icon' && {
            'px-4 py-2 text-xs h-9': size === 'sm',
            'px-6 py-3 h-11': size === 'md',
            'px-8 py-4 text-base h-13': size === 'lg',
          },
          // Variant mappings
          {
            // primary: vibrant blue bg, white text, rounded
            'bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-sm border border-transparent': variant === 'primary',
            // outline: border based on current theme, responsive text
            'bg-transparent text-foreground border border-card-border hover:bg-divider': variant === 'outline',
            // ghost: transparent bg, responsive text
            'bg-transparent text-foreground hover:bg-divider': variant === 'ghost',
            // icon: circular button, theme responsive
            'rounded-full bg-card-bg text-foreground border border-card-border hover:bg-divider w-10 h-10 p-0 flex items-center justify-center': variant === 'icon',
            // danger: solid red, white text
            'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
          },
          // Shape defaults: rounded-xl for standard, rounded-full for icon
          variant !== 'icon' ? 'rounded-xl' : 'rounded-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
