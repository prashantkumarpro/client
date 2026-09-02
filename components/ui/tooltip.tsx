'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils/cn';

interface TooltipProps {
  content?: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    let top = 0;
    let left = 0;

    if (side === 'right') {
      top = rect.top + rect.height / 2;
      left = rect.right + 10;
    } else if (side === 'left') {
      top = rect.top + rect.height / 2;
      left = rect.left - 10;
    } else if (side === 'bottom') {
      top = rect.bottom + 8;
      left = rect.left + rect.width / 2;
    } else {
      // top
      top = rect.top - 8;
      left = rect.left + rect.width / 2;
    }

    setCoords({ top, left });
  };

  const handleMouseEnter = () => {
    updatePosition();
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  if (!content) {
    return <>{children}</>;
  }

  const transformClasses = {
    top: '-translate-x-1/2 -translate-y-full',
    right: 'translate-y-[-50%]',
    bottom: '-translate-x-1/2',
    left: '-translate-x-full -translate-y-1/2',
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={cn("inline-flex items-center justify-center", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {children}
      </div>
      {mounted && isVisible && createPortal(
        <div
          style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
          className={cn(
            'fixed z-[99999] px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.5px] whitespace-nowrap pointer-events-none select-none rounded-lg shadow-xl border',
            'bg-white text-slate-800 border-slate-200/80',
            'dark:bg-zinc-950 dark:text-zinc-200 dark:border-zinc-800/80',
            transformClasses[side],
            className
          )}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
}
