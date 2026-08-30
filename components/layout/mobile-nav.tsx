'use client';

import React, { useEffect } from 'react';
import { useApp } from '../../providers/app-provider';
import { SidebarSection } from '../../types';

import { cn } from '../../lib/utils/cn';
import { formatBytes } from '../../lib/utils/format';
import { Dropdown } from '../ui/dropdown';
import Image from 'next/image';
import { getNavItems } from './nav-config';
import { Tooltip } from '../ui/tooltip';
import { Sun, Moon } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { 
    currentSection, 
    setCurrentSection, 
    storageStats, 
    files, 
    theme, 
    toggleTheme,
    setActiveModal 
  } = useApp();

  const menuItems = getNavItems();
  const percentageUsed = Math.round((storageStats.totalUsed / storageStats.totalCapacity) * 100);
  const isTrashEmpty = !files.some(f => f.deleted);

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

  const uploadDropdownItems = [
    {
      label: 'Upload File',
      onClick: () => {
        setActiveModal('upload-file');
        onClose();
      },
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: 'Upload Folder',
      onClick: () => {
        setActiveModal('upload-folder');
        onClose();
      },
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      label: 'New Folder',
      onClick: () => {
        setActiveModal('create-folder');
        onClose();
      },
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={cn(
      "fixed inset-0 z-50 lg:hidden transition-all duration-300",
      isOpen ? "visible" : "invisible pointer-events-none"
    )}>
      {/* Backdrop overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-slate-900/30 dark:bg-black/60 transition-opacity duration-300 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Navigation panel */}
      <div className={cn(
        "fixed inset-y-0 left-0 w-64 bg-card-bg border-r border-card-border flex flex-col justify-between pt-2.5 pb-3 px-4 shadow-2xl transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand Header */}
        <div className='flex shrink-0 w-full mt-1.5'>
          <div className='flex w-full items-center justify-between min-w-0'>
            <div className='flex items-center gap-3 min-w-0'>
              <Image
                src="/images/logo.png"
                width={44}
                height={44}
                alt="Logo"
                className="object-contain"
                priority
              />
              <span className='text-lg font-semibold text-[#0056f7] tracking-tight font-sans truncate select-none'>
                cloud<span className='font-black'>spacego</span>
              </span>
            </div>
            {/* Close Drawer Button */}
            <Tooltip content="close sidebar" side="bottom">
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors"
                aria-label="Close menu"
              >
                <svg
                  className="w-5.5 h-5.5 text-[#0056f7] dark:text-blue-400 font-extrabold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M9 3v18" />
                </svg>
              </button>
            </Tooltip>
          </div>
        </div>

        {/* "+ New" Dropdown Button */}
        <div className='mt-4 shrink-0'>
          <Dropdown
            align='left'
            className='w-full'
            items={uploadDropdownItems}
            trigger={
              <button className='w-full flex items-center justify-between bg-[#0056f7] hover:bg-[#004bd6] rounded-xl px-5 py-3.5 shadow-md hover:shadow-lg text-sm font-bold text-white cursor-pointer transition-all duration-200'>
                <span className='flex items-center gap-3.5'>
                  <svg
                    className='w-4 h-4 text-white'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 4v16m8-8H4'
                    />
                  </svg>
                  <span>New File/Folder</span>
                </span>
                <svg
                  className='w-4 h-4 text-white opacity-80'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </button>
            }
          />
        </div>

        {/* Navigation List */}
        <nav className='flex-1 mt-4 flex flex-col gap-1 select-none overflow-y-auto min-h-0'>
          {menuItems.map(item => {
            const isActive = currentSection === item.name;
            const isTrash = item.name === 'Trash';

            return (
              <div key={item.name} className='w-full flex flex-col gap-1'>
                {isTrash && (
                  <div className='h-[1px] bg-slate-100 dark:bg-zinc-800/80 my-1 mx-3' />
                )}
                <button
                  onClick={() => {
                    setCurrentSection(item.name as SidebarSection);
                    onClose();
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer border border-transparent font-sans',
                    isActive
                      ? 'bg-[#eef4ff] dark:bg-blue-950/40 text-[#0056f7] dark:text-blue-400 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50/80 dark:hover:bg-zinc-900/40 hover:text-slate-900 dark:hover:text-white font-semibold'
                  )}
                >
                  <span className='flex items-center gap-3 text-[13px]'>
                    <span
                      className={cn(
                        'transition-colors shrink-0',
                        isActive
                          ? 'text-[#0056f7] dark:text-blue-400 font-extrabold'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                      )}
                    >
                      {item.icon}
                    </span>
                    <span className="flex items-center gap-1.5 justify-between flex-1 min-w-0">
                      <span className="truncate">{item.name === 'Shared' ? 'Shared with me' : item.name}</span>
                      {item.name === 'Trash' && (
                        <span className={cn(
                          "text-[9px] font-bold uppercase tracking-[0.5px] px-1.5 py-0.5 shrink-0 select-none",
                          isTrashEmpty
                            ? "text-slate-450 dark:text-zinc-650 bg-slate-100 dark:bg-zinc-800/40"
                            : "text-[#e22718] bg-rose-50 dark:bg-red-950/20"
                        )}>
                          {isTrashEmpty ? 'Empty' : `${files.filter(f => f.deleted).length}`}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              </div>
            );
          })}
        </nav>

        {/* Separator above Storage */}
        <div className='h-[1px] bg-slate-100 dark:bg-zinc-800/80 my-0.5 mx-3 shrink-0' />

        {/* Storage details panel */}
        <div className='py-1.5 shrink-0'>
          <div className='w-full bg-white dark:bg-zinc-900/60 rounded-2xl p-3 shadow-[inset_0_0_0_1px_var(--color-card-border)] flex flex-col gap-2.5 select-none'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-[#0056f7] dark:text-blue-400 shrink-0 shadow-sm'>
                  <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' />
                  </svg>
                </div>
                <span className='text-[11px] font-bold text-slate-800 dark:text-slate-200'>
                  Storage
                </span>
              </div>
              <span className='text-[9px] font-bold text-[#0056f7] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full shadow-sm'>
                {percentageUsed}%
              </span>
            </div>

            <div className='flex flex-col gap-1'>
              <span className='text-[10px] font-bold text-slate-650 dark:text-slate-400'>
                {percentageUsed}% used &bull; {formatBytes(storageStats.totalCapacity - storageStats.totalUsed, 0)} free
              </span>
              <div className='w-full bg-slate-100 dark:bg-zinc-950/80 h-2.5 overflow-hidden relative border border-card-border'>
                <div
                  className='h-full bg-gradient-to-r from-blue-500 to-[#0056f7]'
                  style={{ width: `${percentageUsed}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => alert('Storage upgrade options coming soon!')}
              className='w-full flex items-center justify-between text-[10px] font-bold text-[#0056f7] dark:text-blue-400 hover:text-[#004bd6] transition-colors pt-0.5 cursor-pointer group'
            >
              <span>Upgrade Storage</span>
              <svg className='w-3 h-3 transform group-hover:translate-x-0.5 transition-transform' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
              </svg>
            </button>
          </div>
        </div>

        {/* Separator above Switcher */}
        <div className='h-[1px] bg-slate-100 dark:bg-zinc-800/80 my-0.5 mx-3 shrink-0' />

        {/* Theme Toggle switcher (capsule tab layout) */}
        <div className='py-1.5 shrink-0'>
          <div className='w-full p-0.5 bg-slate-50/50 dark:bg-zinc-950/40 rounded-xl flex items-center justify-between select-none shadow-[inset_0_0_0_1px_var(--color-card-border)] relative border border-card-border'>
            <button
              onClick={() => theme === 'dark' && toggleTheme()}
              className={cn(
                'w-1/2 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer focus:outline-none',
                theme === 'light'
                  ? 'bg-white dark:bg-zinc-800 text-[#0056f7] dark:text-blue-400 shadow-sm border border-slate-100 dark:border-zinc-700/50 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <Sun className='w-4.5 h-4.5 text-amber-500' />
              <span>Light</span>
            </button>

            <div className='h-4 w-[1px] bg-slate-200 dark:bg-zinc-800 shrink-0 self-center' />

            <button
              onClick={() => theme === 'light' && toggleTheme()}
              className={cn(
                'w-1/2 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer focus:outline-none',
                theme === 'dark'
                  ? 'bg-white dark:bg-zinc-800 text-[#0056f7] dark:text-blue-400 shadow-sm border border-slate-100 dark:border-zinc-700/50 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <Moon className='w-4.5 h-4.5 text-slate-700 dark:text-slate-300' />
              <span>Dark</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
