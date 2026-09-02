'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils/cn';

export interface TooltipProps {
  content?: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  className?: string;
  delayDuration?: number;
  disabled?: boolean;
}

export function Tooltip({
  content,
  children,
  side = 'top',
  sideOffset,
  className,
  delayDuration = 100,
  disabled = false,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unmountTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    let top = 0;
    let left = 0;

    const aside = triggerRef.current.closest('aside');

    switch (side) {
      case 'right':
        top = rect.top + rect.height / 2;
        if (aside) {
          const asideRect = aside.getBoundingClientRect();
          left = asideRect.right + (sideOffset ?? 12);
        } else {
          left = rect.right + (sideOffset ?? 10);
        }
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - (sideOffset ?? 10);
        break;
      case 'bottom':
        top = rect.bottom + (sideOffset ?? 8);
        left = rect.left + rect.width / 2;
        break;
      case 'top':
      default:
        top = rect.top - (sideOffset ?? 8);
        left = rect.left + rect.width / 2;
        break;
    }

    setCoords({ top, left });
  }, [side, sideOffset]);

  const showTooltip = useCallback(() => {
    if (disabled || !content) return;
    if (unmountTimeoutRef.current) clearTimeout(unmountTimeoutRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      updatePosition();
      setIsMounted(true);
      requestAnimationFrame(() => {
        setIsOpen(true);
      });
    }, delayDuration);
  }, [disabled, content, delayDuration, updatePosition]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(false);
    unmountTimeoutRef.current = setTimeout(() => {
      setIsMounted(false);
    }, 120);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (unmountTimeoutRef.current) clearTimeout(unmountTimeoutRef.current);
    };
  }, []);

  // Update position when window is scrolled or resized while open
  useEffect(() => {
    if (!isMounted) return;
    const handleScrollOrResize = () => {
      updatePosition();
    };
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isMounted, updatePosition]);

  if (!content || disabled) {
    return <>{children}</>;
  }

  const sideTransforms: Record<string, string> = {
    top: '-translate-x-1/2 -translate-y-full',
    bottom: '-translate-x-1/2 translate-y-0',
    right: 'translate-x-0 -translate-y-1/2',
    left: '-translate-x-full -translate-y-1/2',
  };

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-flex items-center justify-center shrink-0"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        onKeyDown={(e) => {
          if (e.key === 'Escape') hideTooltip();
        }}
      >
        {children}
      </div>

      {typeof document !== 'undefined' &&
        isMounted &&
        createPortal(
          <div
            role="tooltip"
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
            className={cn(
              'fixed z-[999999] pointer-events-none select-none',
              'px-2.5 py-1 text-[11px] font-medium leading-none whitespace-nowrap tracking-normal',
              'rounded-md',
              'bg-white text-slate-800 border border-slate-200/90 shadow-md shadow-slate-900/5',
              'dark:bg-[#15151F] dark:text-zinc-100 dark:border-zinc-800/80 dark:shadow-xl dark:shadow-black/50',
              sideTransforms[side],
              'transition-all duration-120 ease-out will-change-[opacity,transform]',
              isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
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
