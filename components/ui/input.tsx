import React from 'react';
import { cn } from '../../lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-[10px] font-bold uppercase tracking-[1px] text-text-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full bg-input-bg text-foreground border border-card-border rounded-xl px-4 py-3 text-sm font-light placeholder-text-muted transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-red-500">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
