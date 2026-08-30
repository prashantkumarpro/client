import React, { useEffect } from 'react';
import { cn } from '../../lib/utils/cn';
import { Button } from './button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ isOpen, onClose, title, children, className }: DialogProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Dialog Frame */}
      <div 
        className={cn(
          "relative z-10 w-full max-w-md bg-card-bg border border-card-border rounded-2xl p-6 shadow-2xl transition-all duration-300 flex flex-col text-foreground",
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Subtle Brand Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#0056f7] rounded-t-2xl" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5 pt-1">
          {title && (
            <h3 className="text-base font-bold text-foreground">
              {title}
            </h3>
          )}
          <Button 
            variant="icon" 
            onClick={onClose} 
            className="w-8 h-8 bg-transparent border-transparent hover:bg-divider"
            aria-label="Close dialog"
          >
            <svg 
              className="w-4 h-4 text-text-muted hover:text-foreground" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Content */}
        <div className="text-text-secondary font-light text-sm leading-relaxed mb-4">
          {children}
        </div>
      </div>
    </div>
  );
}
