'use client';

import React, { useEffect } from 'react';
import { useApp } from '../../providers/app-provider';
import { SidebarSection } from '../../types';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils/cn';
import { formatBytes } from '../../lib/utils/format';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { currentSection, setCurrentSection, storageStats } = useApp();

  const menuItems: { name: SidebarSection; icon: React.ReactNode }[] = [
    {
      name: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      ),
    },
    {
      name: 'My Files',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
    },
    {
      name: 'Shared',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      name: 'Recent',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: 'Starred',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      name: 'Trash',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
    },
  ];

  const percentageUsed = Math.round((storageStats.totalUsed / storageStats.totalCapacity) * 100);

  // Prevent background scrolling when open
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Navigation panel */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-black border-r border-[#3c3c3c] flex flex-col justify-between p-6 shadow-2xl transition-transform duration-300">
        
        {/* Header Section */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-7 h-7 font-extrabold text-sm tracking-tighter bg-transparent text-foreground border border-card-border rounded-lg">
              C
            </div>
            <span className="text-base font-bold tracking-[2px] uppercase text-foreground">
              Cloud<span className="text-[#2563eb] font-extrabold">E</span>
            </span>
          </div>
          <Button
            variant="icon"
            onClick={onClose}
            className="w-8 h-8 hover:bg-divider border-transparent bg-transparent text-text-secondary"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* M-Stripe highlight line */}
        <div className="mt-4 h-[2px] bg-gradient-to-r from-[#0066b1] via-[#1c69d4] to-[#e22718] w-12 shrink-0" />

        {/* Links Navigation */}
        <nav className="flex-1 mt-8 flex flex-col gap-1 overflow-y-auto">
          {menuItems.map(item => {
            const isActive = currentSection === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setCurrentSection(item.name);
                  onClose();
                }}
                className={cn(
                  'w-full flex items-center gap-4 px-4 py-3.5 text-xs font-semibold uppercase tracking-[1px] transition-all cursor-pointer rounded-xl border border-transparent',
                  isActive
                    ? 'bg-sidebar-active-bg text-sidebar-active-text font-bold shadow-sm'
                    : 'text-text-secondary hover:text-foreground hover:bg-divider'
                )}
              >
                <span className={isActive ? 'text-sidebar-active-text' : 'text-text-muted'}>{item.icon}</span>
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Storage status & Upgrade */}
        <div className="mt-auto pt-6 border-t border-divider shrink-0 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[1px] text-text-muted">
              Storage
              <span className="ml-auto text-[#2563eb]">{percentageUsed}%</span>
            </div>
            <div className="text-xs font-light text-text-secondary">
              <span className="font-extrabold text-foreground">{formatBytes(storageStats.totalUsed, 0)}</span> of{' '}
              {formatBytes(storageStats.totalCapacity, 0)}
            </div>
            <div className="w-full bg-divider h-1.5 rounded-full overflow-hidden relative border border-card-border">
              <div
                className="h-full bg-[#2563eb] rounded-full"
                style={{ width: `${percentageUsed}%` }}
              />
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full border-[#3c3c3c] text-white text-[9px] py-3.5 tracking-[1px]"
            onClick={() => alert('Storage Upgrade Plan initiated: Upgrading to 1 TB')}
          >
            Upgrade Storage →
          </Button>
        </div>
      </div>
    </div>
  );
}
