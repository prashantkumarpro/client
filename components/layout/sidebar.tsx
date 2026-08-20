'use client';

import React from 'react';
import { useApp } from '../../providers/app-provider';
import { SidebarSection } from '../../types';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils/cn';
import { formatBytes } from '../../lib/utils/format';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const {
    currentSection,
    setCurrentSection,
    storageStats,
    isSidebarCollapsed,
    toggleSidebar,
    theme,
  } = useApp();

  const percentageUsed = Math.round((storageStats.totalUsed / storageStats.totalCapacity) * 100);

  const mainNavItems: { name: SidebarSection; icon: React.ReactNode }[] = [
    {
      name: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2-2 0 01-2-2v-4z" />
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

  const subNavItems = [
    {
      name: 'Storage',
      badge: `${percentageUsed}%`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
      action: () => setCurrentSection('My Files'), // navigate to file viewer
    },
    {
      name: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      action: () => setCurrentSection('Settings'),
    },
    {
      name: 'Help & Support',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      action: () => alert('Support widget opened'),
    },
  ];

  // Cloud Logo Icon
  const logoIcon = (
    <svg className="w-8 h-8 text-[#2563eb] shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
    </svg>
  );

  if (isSidebarCollapsed) {
    // ----------------------------------------------------
    // COLLAPSED VIEW
    // ----------------------------------------------------
    return (
      <aside
        className={cn(
          'w-20 bg-sidebar-bg border-r border-sidebar-border flex flex-col justify-between items-center h-full py-6 select-none shrink-0 transition-all duration-200',
          className
        )}
      >
        {/* Brand Logo - Centered Icon */}
        <div className="flex flex-col items-center shrink-0">
          <div className="p-1 cursor-pointer" onClick={toggleSidebar}>
            {logoIcon}
          </div>
        </div>

        {/* Main Nav Icons */}
        <nav className="w-full flex-1 mt-8 px-2 flex flex-col gap-1.5 items-center">
          {mainNavItems.map(item => {
            const isActive = currentSection === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setCurrentSection(item.name)}
                title={item.name}
                className={cn(
                  'w-12 h-12 flex items-center justify-center rounded-xl transition-all cursor-pointer border border-transparent',
                  isActive
                    ? 'bg-sidebar-active-bg text-sidebar-active-text'
                    : 'text-text-secondary hover:bg-divider hover:text-foreground'
                )}
              >
                {item.icon}
              </button>
            );
          })}
        </nav>

        {/* Sub Nav Icons */}
        <div className="w-full px-2 flex flex-col gap-1.5 items-center py-4 border-t border-divider">
          {subNavItems.map(item => {
            const isActive = item.name === 'Storage' ? currentSection === 'My Files' : currentSection === item.name;
            return (
              <button
                key={item.name}
                onClick={item.action}
                title={item.name}
                className={cn(
                  'w-12 h-12 flex items-center justify-center rounded-xl transition-all cursor-pointer border border-transparent relative',
                  isActive
                    ? 'bg-sidebar-active-bg text-sidebar-active-text'
                    : 'text-text-secondary hover:bg-divider hover:text-foreground'
                )}
              >
                {item.icon}
              </button>
            );
          })}
        </div>

        {/* Bottom Collapsed Storage Card */}
        <div className="px-2 mt-auto shrink-0 w-full flex flex-col gap-3 items-center">
          <div
            onClick={toggleSidebar}
            className="w-14 bg-divider border border-card-border hover:border-text-muted rounded-2xl p-2.5 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200"
          >
            {/* Cloud Icon */}
            {logoIcon}

            {/* 72% Label Badge */}
            <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded-full">
              {percentageUsed}%
            </span>

            {/* Expand Chevron > */}
            <div className="w-6 h-6 rounded-full bg-white dark:bg-zinc-800 border border-card-border flex items-center justify-center text-text-secondary shadow-sm mt-1">
              <svg className="w-3.5 h-3.5 text-[#2563eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // ----------------------------------------------------
  // EXPANDED VIEW
  // ----------------------------------------------------
  return (
    <aside
      className={cn(
        'w-64 bg-sidebar-bg border-r border-sidebar-border flex flex-col justify-between h-full py-6 select-none shrink-0 transition-all duration-200 text-foreground',
        className
      )}
    >
      {/* Brand Header */}
      <div className="px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {logoIcon}
          <span className="text-lg font-bold text-foreground tracking-wide">
            Cloud<span className="text-[#2563eb] font-extrabold">E</span>
          </span>
        </div>

        {/* Collapse Button << */}
        <button
          onClick={toggleSidebar}
          className="w-7 h-7 rounded-lg border border-card-border hover:bg-divider flex items-center justify-center text-text-secondary cursor-pointer focus:outline-none transition-colors"
          title="Collapse sidebar"
        >
          <svg className="w-4 h-4 text-text-muted hover:text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 mt-8 px-4 flex flex-col gap-1 overflow-y-auto">
        {mainNavItems.map(item => {
          const isActive = currentSection === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setCurrentSection(item.name)}
              className={cn(
                'w-full flex items-center gap-3.5 px-4 py-3 text-xs font-semibold transition-all cursor-pointer rounded-xl border border-transparent',
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

      {/* Sub Navigation List */}
      <div className="px-4 flex flex-col gap-1 py-4 border-t border-divider select-none">
        {subNavItems.map(item => {
          const isActive = item.name === 'Storage' ? currentSection === 'My Files' : currentSection === item.name;
          return (
            <button
              key={item.name}
              onClick={item.action}
              className={cn(
                'w-full flex items-center gap-3.5 px-4 py-3 text-xs font-semibold transition-all cursor-pointer rounded-xl border border-transparent relative',
                isActive
                  ? 'bg-sidebar-active-bg text-sidebar-active-text font-bold'
                  : 'text-text-secondary hover:text-foreground hover:bg-divider'
              )}
            >
              <span className={isActive ? 'text-sidebar-active-text' : 'text-text-muted'}>{item.icon}</span>
              <span className="flex-1 text-left">{item.name}</span>
              {item.badge && (
                <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full ml-auto">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Storage details Card */}
      <div className="px-4 mt-auto shrink-0 flex flex-col pt-4 border-t border-divider">
        <div className="bg-background dark:bg-card-bg border border-card-border rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden select-none">
          {/* Header Row */}
          <div className="flex items-center gap-2">
            {logoIcon}
            <span className="text-xs font-bold text-foreground">Storage</span>
            <span className="ml-auto text-xs font-bold text-[#2563eb]">{percentageUsed}%</span>
          </div>

          {/* Usage Label */}
          <div className="text-[11px] font-light text-text-secondary leading-normal">
            <span className="font-extrabold text-foreground">{formatBytes(storageStats.totalUsed, 0)}</span> of{' '}
            {formatBytes(storageStats.totalCapacity, 0)} used
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-divider h-1.5 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-[#2563eb] rounded-full transition-all duration-300"
              style={{ width: `${percentageUsed}%` }}
            />
          </div>

          {/* Upgrade Storage Button (white pill shape with outline) */}
          <button
            onClick={() => alert('Storage Upgrade Plan initiated: Upgrading to 1 TB')}
            className="w-full bg-card-bg dark:bg-zinc-800 text-[#2563eb] border border-card-border hover:border-text-muted hover:bg-divider text-xs font-bold text-center py-2.5 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm"
          >
            <span>Upgrade Storage</span>
            <span className="text-[10px] ml-0.5">&gt;</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
