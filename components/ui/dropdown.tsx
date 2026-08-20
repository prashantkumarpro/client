import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils/cn';

export interface DropdownItemType {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItemType[];
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({ trigger, items, align = 'right', className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen(prev => !prev);
  const close = () => setIsOpen(false);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cn("relative inline-block text-left", className)} ref={containerRef}>
      {/* Trigger Button Wrapper */}
      <div onClick={toggle} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-30 mt-2 w-56 bg-card-bg border border-card-border rounded-xl shadow-xl focus:outline-none transition-all duration-150 overflow-hidden",
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {/* Dropdown Items list */}
          <div className="py-1" role="menu" aria-orientation="vertical">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick();
                    close();
                  }
                }}
                disabled={item.disabled}
                className={cn(
                  "w-full text-left px-4 py-3 text-xs font-semibold text-text-secondary hover:text-foreground hover:bg-divider transition-colors flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
                  item.className
                )}
                role="menuitem"
              >
                {item.icon && <span className="text-text-muted shrink-0 group-hover:text-foreground">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
