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
  const { setActiveModal, setSelectedFileId, theme, toggleTheme } = useApp();

  const uploadDropdownItems: DropdownItemType[] = [
    {
      label: 'Upload files',
      onClick: () => {
        setSelectedFileId(null);
        setActiveModal('upload-file');
      },
      icon: (
        <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      ),
    },
    {
      label: 'Upload folder',
      onClick: () => {
        setSelectedFileId(null);
        setActiveModal('upload-folder');
      },
      icon: (
        <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

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
        'h-20 bg-card-bg border-b border-card-border flex items-center justify-between px-6 text-foreground select-none relative transition-colors duration-200',
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
      <div className="hidden sm:block flex-1 max-w-md">
        <SearchBar />
      </div>

      {/* Header Actions cluster */}
      <div className="flex items-center gap-3.5 ml-auto shrink-0">
        {/* Upload Dropdown Component */}
        <Dropdown
          align="right"
          items={uploadDropdownItems}
          trigger={
            <Button
              variant="primary"
              size="sm"
              className="h-10 px-5 text-xs flex items-center gap-2 font-bold"
            >
              <span className="text-sm font-light">+</span>
              <span>Upload</span>
              <svg className="w-3.5 h-3.5 ml-1 text-current opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
          }
        />



        {/* Theme Toggle Button */}
        <Button
          variant="icon"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          aria-label="Toggle theme mode"
          className="w-10 h-10 border-card-border bg-transparent text-text-secondary hover:bg-divider hover:text-foreground"
        >
          {theme === 'light' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728A9 9 0 115.636 5.636a9 9 0 0112.728 12.728z" />
            </svg>
          )}
        </Button>

        {/* Notifications Icon Button */}
        <div className="relative">
          <Button
            variant="icon"
            className="w-10 h-10 border-card-border bg-transparent text-text-secondary hover:bg-divider hover:text-foreground"
            onClick={() => alert('Viewing 3 mock notifications')}
            aria-label="View notifications"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </Button>
          {/* Blue badge corresponding to screenshot design */}
          <span className="absolute -top-1 -right-1 bg-[#2563eb] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-card-bg shadow-sm">
            3
          </span>
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-[1px] bg-card-border hidden md:block" />

        {/* User profile dropdown */}
        <Dropdown
          align="right"
          items={profileDropdownItems}
          trigger={
            <div className="flex items-center gap-2.5 cursor-pointer group hover:opacity-85 select-none">
              <div className="w-9 h-9 rounded-full bg-divider border border-card-border overflow-hidden relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Prashant avatar"
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-xs font-bold text-foreground hidden md:block select-none">
                Prashant
              </span>
              <svg className="w-3 h-3 text-text-muted hidden md:block group-hover:text-foreground transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          }
        />
      </div>
    </header>
  );
}
