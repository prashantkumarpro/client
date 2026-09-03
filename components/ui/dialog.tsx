'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils/cn';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  maxWidth?: string;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  showCloseButton = true,
  maxWidth = 'max-w-[420px]',
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Card */}
      <div
        ref={dialogRef}
        className={cn(
          "relative z-10 w-full bg-card-bg border border-card-border rounded-[14px] p-5 sm:p-6 shadow-xl shadow-black/5 dark:shadow-2xl dark:shadow-black/40 transition-all duration-200 flex flex-col text-foreground animate-in fade-in zoom-in-95",
          maxWidth,
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
        aria-describedby={description ? 'dialog-description' : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col min-w-0 pr-2">
              {title && (
                <h3
                  id="dialog-title"
                  className="text-base font-bold text-foreground tracking-tight"
                >
                  {title}
                </h3>
              )}
              {description && (
                <p
                  id="dialog-description"
                  className="text-xs text-text-secondary mt-0.5"
                >
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-input-bg transition-colors cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E60EE]/50"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="w-full text-foreground text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
