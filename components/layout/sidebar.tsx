'use client';

import React from 'react';
import { useApp } from '../../providers/app-provider';
import { SidebarSection } from '../../types';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils/cn';
import { formatBytes } from '../../lib/utils/format';
import { Tooltip } from '../ui/tooltip';
import { Dropdown } from '../ui/dropdown';

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
    toggleTheme,
    setActiveModal,
  } = useApp();

  const percentageUsed = Math.round((storageStats.totalUsed / storageStats.totalCapacity) * 100);

  const mainNavItems = [
    {
      name: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2-2 0 01-2-2v-4z" />
        </svg>
      ),
    },
    {
      name: 'My Files',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
    },
    {
      name: 'Shared',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      name: 'Recent',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: 'Starred',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      name: 'Storage',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
    },
  ];

  const uploadDropdownItems = [
    {
      label: 'Upload Files',
      onClick: () => setActiveModal('upload-file'),
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: 'New folder',
      onClick: () => setActiveModal('create-folder'),
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Upload folder',
      onClick: () => setActiveModal('upload-folder'),
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      ),
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
          'w-16 bg-sidebar-bg border-r border-sidebar-border flex flex-col justify-between items-center h-full py-6 select-none shrink-0 transition-all duration-200 relative shadow-[1px_0_8px_rgba(0,0,0,0.02)]',
          className
        )}
      >
        {/* Brand Logo - Centered Icon */}
        <div className="flex flex-col items-center shrink-0">
          <button onClick={toggleSidebar} className="p-1 cursor-pointer focus:outline-none">
            {logoIcon}
          </button>
        </div>

        {/* Collapsed + New dropdown button trigger */}
        <div className="w-full px-2 mt-6 flex justify-center">
          <Dropdown
            align="left"
            items={uploadDropdownItems}
            trigger={
              <button
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-card-border hover:border-text-muted text-[#2563eb] shadow-sm cursor-pointer transition-all duration-200"
                title="New folder / upload"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            }
          />
        </div>

        {/* Main Nav Icons */}
        <nav className="w-full flex-1 mt-6 px-2 flex flex-col gap-3 items-center">
          {mainNavItems.map(item => {
            const isActive = item.name === 'Storage' ? false : currentSection === item.name;
            return (
              <Tooltip key={item.name} content={item.name} side="right">
                <button
                  onClick={() => {
                    if (item.name === 'Storage') {
                      setCurrentSection('My Files');
                    } else {
                      setCurrentSection(item.name as SidebarSection);
                    }
                  }}
                  className={cn(
                    'w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer border border-transparent',
                    isActive
                      ? 'bg-sidebar-active-bg text-sidebar-active-text font-medium'
                      : 'text-text-secondary hover:bg-divider hover:text-foreground hover:bg-slate-50'
                  )}
                >
                  {item.icon}
                </button>
              </Tooltip>
            );
          })}
        </nav>

        {/* Collapsed Theme Toggle Icon */}
        <div className="w-full px-2 flex justify-center py-2">
          <Tooltip content={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'} side="right">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-text-secondary hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-foreground transition-all cursor-pointer"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728A9 9 0 115.636 5.636a9 9 0 0112.728 12.728z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </Tooltip>
        </div>

        {/* Bottom Collapsed Storage details */}
        <div className="px-2 mt-auto shrink-0 w-full flex flex-col items-center pt-4 border-t border-divider">
          <Tooltip content={`Storage: ${percentageUsed}% used (${formatBytes(storageStats.totalUsed, 0)} of ${formatBytes(storageStats.totalCapacity, 0)})`}>
            <button
              onClick={() => setCurrentSection('My Files')}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-divider text-text-secondary hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer relative"
            >
              <svg className="w-5 h-5 text-[#2563eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="absolute -top-1 -right-1 text-[8px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1.5 rounded-full border border-white dark:border-zinc-900">
                {percentageUsed}%
              </span>
            </button>
          </Tooltip>
        </div>

        {/* Collapsed Avatar at bottom */}
        <div className="w-full px-2 mt-4 pt-4 border-t border-divider flex justify-center select-none">
          <Tooltip content="Personal Account" side="right">
            <div className="w-9 h-9 rounded-full bg-slate-900 dark:bg-zinc-800 text-white flex items-center justify-center font-bold text-sm shrink-0 cursor-pointer">
              N
            </div>
          </Tooltip>
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
        'w-60 bg-sidebar-bg border-r border-sidebar-border flex flex-col justify-between h-full py-6 select-none shrink-0 transition-all duration-200 text-foreground relative shadow-[1px_0_8px_rgba(0,0,0,0.02)]',
        className
      )}
    >
      {/* Brand Header with Integrated Collapse Button */}
      <div className="px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {logoIcon}
          <span className="text-lg font-bold text-foreground tracking-wide">
            Cloud<span className="text-[#2563eb] font-extrabold">E</span>
          </span>
        </div>
        <button
          onClick={toggleSidebar}
          className="text-text-muted hover:text-foreground cursor-pointer focus:outline-none transition-colors"
          title="Collapse sidebar"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* "+ New" Dropdown Button */}
      <div className="px-4 mt-6">
        <Dropdown
          align="left"
          className="w-full"
          items={uploadDropdownItems}
          trigger={
            <button className="w-full flex items-center justify-between bg-white dark:bg-zinc-900 border border-card-border hover:border-text-muted rounded-2xl px-5 py-3.5 shadow-sm text-sm font-bold text-foreground cursor-pointer transition-all duration-200">
              <span className="flex items-center gap-3.5">
                <svg className="w-4 h-4 text-[#2563eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>New</span>
              </span>
              <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          }
        />
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 mt-6 px-4 flex flex-col gap-2 overflow-y-auto">
        {mainNavItems.map(item => {
          const isActive = item.name === 'Storage' ? false : currentSection === item.name;
          return (
            <button
              key={item.name}
              onClick={() => {
                if (item.name === 'Storage') {
                  setCurrentSection('My Files');
                } else {
                  setCurrentSection(item.name as SidebarSection);
                }
              }}
              className={cn(
                'w-full flex items-center gap-3.5 px-4 py-3 text-xs font-semibold transition-all duration-200 cursor-pointer rounded-xl border border-transparent relative',
                isActive
                  ? 'bg-gradient-to-r from-blue-600/[0.08] to-indigo-600/[0.04] dark:from-blue-500/[0.12] dark:to-indigo-500/[0.06] text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-text-secondary hover:text-foreground hover:bg-slate-50'
              )}
            >
              <span className={isActive ? 'text-sidebar-active-text' : 'text-text-muted'}>{item.icon}</span>
              <span className="flex-1 text-left">{item.name}</span>
              {item.name === 'Storage' && (
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full ml-auto">
                  {percentageUsed}%
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Visual Separator Divider */}
      <div className="mx-4 h-[1px] bg-divider shrink-0 my-2" />

      {/* Stacked Theme Selector Tabs */}
      <div className="mx-4 my-2 p-1 bg-slate-100/70 dark:bg-zinc-900/50 rounded-2xl flex flex-col gap-1 select-none shrink-0 border border-slate-200/20">
        <button
          onClick={() => theme === 'dark' && toggleTheme()}
          className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold w-full transition-all cursor-pointer focus:outline-none justify-between",
            theme === 'light'
              ? "bg-white dark:bg-zinc-800 text-[#2563eb] shadow-sm"
              : "text-text-secondary hover:text-foreground"
          )}
        >
          <span className="flex items-center gap-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728A9 9 0 115.636 5.636a9 9 0 0112.728 12.728z" />
            </svg>
            <span>Light mode</span>
          </span>
          {theme === 'light' && <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] shrink-0" />}
        </button>
        <button
          onClick={() => theme === 'light' && toggleTheme()}
          className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold w-full transition-all cursor-pointer focus:outline-none justify-between",
            theme === 'dark'
              ? "bg-zinc-800 dark:bg-zinc-800 text-white shadow-sm"
              : "text-text-secondary hover:text-foreground"
          )}
        >
          <span className="flex items-center gap-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <span>Dark mode</span>
          </span>
          {theme === 'dark' && <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] shrink-0" />}
        </button>
      </div>

      {/* Bottom Storage Card - floating card layout container */}
      <div className="px-4 mt-auto shrink-0 flex flex-col pt-3">
        <div className="bg-white dark:bg-card-bg border border-card-border rounded-2xl p-4 flex flex-col gap-3 relative select-none shadow-sm">
          {/* Header Row */}
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="flex items-center gap-2">
              {logoIcon}
              <span>Storage</span>
            </span>
            <span className="font-bold text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded-full text-[10px]">
              {percentageUsed}%
            </span>
          </div>

          {/* Usage Label */}
          <div className="text-[11px] text-text-secondary font-normal">
            <span className="font-bold text-foreground">{formatBytes(storageStats.totalUsed, 0)}</span> of{' '}
            {formatBytes(storageStats.totalCapacity, 0)} used
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-divider h-1.5 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-[#2563eb] rounded-full transition-all duration-300"
              style={{ width: `${percentageUsed}%` }}
            />
          </div>

          {/* Upgrade Storage Button - Rounded White with Chevron Outline */}
          <button
            onClick={() => alert('Storage Upgrade Plan initiated: Upgrading to 1 TB')}
            className="w-full bg-white dark:bg-zinc-800 text-[#2563eb] border border-card-border hover:border-text-muted text-xs font-bold text-center py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm"
          >
            <svg className="w-4 h-4 text-[#2563eb] shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2 4l3 5 7-6 7 6 3-5-4 14H6L2 4z" />
            </svg>
            <span>Upgrade Storage</span>
            <svg className="w-3 h-3 text-[#2563eb] mt-0.5 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Profile Row */}
      <div className="px-6 mt-4 pt-4 border-t border-divider flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-900 dark:bg-zinc-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
            N
          </div>
          <span className="text-xs font-semibold text-foreground hidden md:block">
            Personal Account
          </span>
        </div>
        <svg className="w-4 h-4 text-text-muted hover:text-foreground cursor-pointer hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </aside>
  );
}
