'use client';

import React from 'react';
import { useApp } from '../../providers/app-provider';
import { SearchBar } from '../../features/search/components/search-bar';
import { Button } from '../ui/button';
import { Dropdown, DropdownItemType } from '../ui/dropdown';
import { cn } from '../../lib/utils/cn';

interface HeaderProps {
  onMenuToggle?: () => void;
  className?: string;
}

export function Header({ onMenuToggle, className }: HeaderProps) {
  const { setActiveModal, setSelectedFileId, theme, toggleTheme, setCurrentSection } = useApp();

  const profileDropdownItems: DropdownItemType[] = [
    {
      label: 'Account Details',
      onClick: () => alert('Mock profile details opened for Prashant'),
    },
    {
      label: 'Storage Settings',
      onClick: () => alert('Storage plan details opened'),
    },
    {
      label: 'Sign Out',
      onClick: () => alert('Mock Sign Out initiated'),
      className: 'text-red-500 hover:bg-red-500/10',
    },
  ];

  return (
    <header
      className={cn(
        'h-20 bg-card-bg border-b border-slate-100 dark:border-zinc-800/60 flex items-center justify-between px-8 text-foreground select-none relative transition-colors duration-200',
        className
      )}
    >
      {/* Mobile Menu Toggle & Brand Logo for Small Viewports */}
      <div className="flex items-center gap-4 lg:hidden shrink-0">
        <button
          onClick={onMenuToggle}
          className="text-foreground hover:text-text-secondary focus:outline-none cursor-pointer"
          aria-label="Open navigation menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-sm font-bold tracking-wide">
          Cloud<span className="text-[#2563eb] font-extrabold">E</span>
        </span>
      </div>

      {/* Search Bar */}
      <div className="hidden sm:block flex-1 max-w-lg">
        <SearchBar />
      </div>

      {/* Header Actions cluster */}
      <div className="flex items-center gap-5 ml-auto shrink-0">
        {/* Notifications Icon Button */}
        <div className="relative">
          <Button
            variant="icon"
            className="w-10 h-10 border-none bg-transparent text-text-secondary hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-foreground transition-colors"
            onClick={() => alert('Viewing 3 mock notifications')}
            aria-label="View notifications"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </Button>
          {/* Blue badge corresponding to screenshot design */}
          <span className="absolute top-1.5 right-1.5 bg-[#2563eb] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white dark:border-zinc-900 shadow-sm pointer-events-none">
            3
          </span>
        </div>

        {/* Help Icon Button */}
        <Button
          variant="icon"
          className="w-10 h-10 border-none bg-transparent text-text-secondary hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-foreground transition-colors"
          onClick={() => alert('Opening Help widget')}
          aria-label="Help & support"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </Button>

        {/* Settings Icon Button */}
        <Button
          variant="icon"
          className="w-10 h-10 border-none bg-transparent text-text-secondary hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-foreground transition-colors"
          onClick={() => setCurrentSection('Settings')}
          aria-label="Open settings"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Button>

        {/* User profile dropdown - with subtle hover background and chevron dropdown indicator */}
        <Dropdown
          align="right"
          items={profileDropdownItems}
          trigger={
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900/60 cursor-pointer select-none transition-colors group">
              <div className="w-8.5 h-8.5 rounded-full bg-divider border border-card-border overflow-hidden relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Prashant avatar"
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-xs font-semibold text-foreground hidden md:block select-none">
                Prashant
              </span>
              <svg className="w-3 h-3 text-text-muted hidden md:block group-hover:text-foreground transition-transform duration-200 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          }
        />
      </div>
    </header>
  );
}
