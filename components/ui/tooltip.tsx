'use client';

import React, { useState } from 'react';
import { cn } from '../../lib/utils/cn';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const sideClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  };

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.5px] whitespace-nowrap pointer-events-none select-none animate-in fade-in zoom-in-95 duration-100 rounded-lg shadow-md border',
            'bg-white text-slate-800 border-slate-200/80',
            'dark:bg-zinc-950 dark:text-zinc-200 dark:border-zinc-800/80',
            sideClasses[side],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
