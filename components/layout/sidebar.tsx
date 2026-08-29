'use client'

import React from 'react'
import { useApp } from '../../providers/app-provider'
import { SidebarSection } from '../../types'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils/cn'
import { formatBytes } from '../../lib/utils/format'
import { Tooltip } from '../ui/tooltip'
import { Dropdown } from '../ui/dropdown'

interface SidebarProps {
  className?: string
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
    setActiveModal
  } = useApp()

  const percentageUsed = Math.round(
    (storageStats.totalUsed / storageStats.totalCapacity) * 100
  )

  const mainNavItems = [
    {
      name: 'Dashboard',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.8}
            d='M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2-2 0 01-2-2v-4z'
          />
        </svg>
      )
    },
    {
      name: 'My Files',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.8}
            d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
          />
        </svg>
      )
    },
    {
      name: 'Shared',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.8}
            d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
          />
        </svg>
      )
    },
    {
      name: 'Recent',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.8}
            d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      )
    },
    {
      name: 'Starred',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.8}
            d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
          />
        </svg>
      )
    },
    {
      name: 'Trash',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.8}
            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
          />
        </svg>
      )
    }
  ]

  const uploadDropdownItems = [
    {
      label: 'New folder',
      onClick: () => setActiveModal('create-folder'),
      className: 'shadow-[0_1px_0_0_var(--color-divider)] py-3 px-4 hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 text-slate-800 dark:text-slate-200 text-sm font-semibold',
      icon: (
        <div className='w-9 h-9 rounded-xl bg-[#eef4ff] dark:bg-blue-950/40 text-[#0056f7] dark:text-blue-400 flex items-center justify-center shrink-0'>
          <svg
            className='w-5 h-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M9 13h6M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z'
            />
          </svg>
        </div>
      )
    },
    {
      label: 'File upload',
      onClick: () => setActiveModal('upload-file'),
      className: 'shadow-[0_1px_0_0_var(--color-divider)] py-3 px-4 hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 text-slate-800 dark:text-slate-200 text-sm font-semibold',
      icon: (
        <div className='w-9 h-9 rounded-xl bg-[#eefbf2] dark:bg-emerald-950/40 text-[#0ca654] dark:text-emerald-400 flex items-center justify-center shrink-0'>
          <svg
            className='w-5 h-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 19V5m0 0l-7 7m7-7l7 7'
            />
          </svg>
        </div>
      )
    },
    {
      label: 'Folder upload',
      onClick: () => setActiveModal('upload-folder'),
      className: 'py-3 px-4 hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 text-slate-800 dark:text-slate-200 text-sm font-semibold',
      icon: (
        <div className='w-9 h-9 rounded-xl bg-[#fbf2ff] dark:bg-purple-950/40 text-[#b848ff] dark:text-purple-400 flex items-center justify-center shrink-0'>
          <svg
            className='w-5 h-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 19V5m0 0l-7 7m7-7l7 7'
            />
          </svg>
        </div>
      )
    }
  ]

  // Cloud Logo Icon
  const logoIcon = (
    <svg
      className='w-10 h-10 text-[#0056f7] shrink-0'
      fill='currentColor'
      viewBox='0 0 24 24'
    >
      <path d='M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z' />
    </svg>
  )

  if (isSidebarCollapsed) {
    // ----------------------------------------------------
    // COLLAPSED VIEW
    // ----------------------------------------------------
    return (
      <aside
        className={cn(
          'w-16 bg-sidebar-bg flex flex-col justify-between items-center h-full pt-5 pb-4 md:pt-6 md:pb-5 select-none shrink-0 transition-all duration-200 relative shadow-[inset_-1px_0_0_0_var(--sidebar-border)]',
          className
        )}
      >
        {/* Brand Logo - Centered Icon & Desktop Expand Chevron */}
        <div className='flex flex-col items-center shrink-0 w-full px-2'>
          <div
            onClick={toggleSidebar}
            className='flex w-full shrink-0 flex-col gap-3.5 items-center justify-center cursor-pointer hover:opacity-85 select-none'
            title='Expand sidebar'
          >
            <div className='w-10 h-10 text-[#0056f7] flex items-center justify-center shrink-0'>
              <svg
                className='w-10 h-10'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z' />
              </svg>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSidebar();
              }}
              className='text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer focus:outline-none transition-colors'
            >
              <svg
                className='w-7 h-7'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2.8}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M13 5l7 7-7 7M5 5l7 7-7 7'
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Collapsed + New dropdown button trigger */}
        <div className='w-full px-2 mt-4 flex justify-center'>
          <Tooltip content='New' side='right'>
            <Dropdown
              align='left'
              items={uploadDropdownItems}
              trigger={
                <button
                  className='w-11 h-11 flex items-center justify-center rounded-xl bg-[#0056f7] hover:bg-[#004bd6] text-white shadow-md cursor-pointer transition-all duration-200'
                >
                  <svg
                    className='w-5 h-5 text-white'
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
                </button>
              }
            />
          </Tooltip>
        </div>

        {/* Main Nav Icons */}
        <nav className='w-full flex-1 mt-4 px-2 flex flex-col gap-1 items-center'>
          {mainNavItems.map(item => {
            const isActive = currentSection === item.name
            const isTrash = item.name === 'Trash'
            return (
              <Tooltip key={item.name} content={item.name} side='right'>
                <div className='w-full flex flex-col items-center gap-1'>
                  {isTrash && (
                    <div className='w-8 h-[1px] bg-slate-100 dark:bg-zinc-800/80 my-0.5' />
                  )}
                  <button
                    onClick={() => {
                      setCurrentSection(item.name as SidebarSection)
                    }}
                    className={cn(
                      'w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer border border-transparent',
                      isActive
                        ? 'bg-[#eef4ff] dark:bg-blue-950/40 text-[#0056f7] dark:text-blue-400 font-medium'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800/40 hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                    {item.icon}
                  </button>
                </div>
              </Tooltip>
            )
          })}
        </nav>

        {/* Divider before Storage */}
        <div className='w-8 h-[1px] bg-slate-100 dark:bg-zinc-800/80 my-1 shrink-0' />

        {/* Collapsed Storage details */}
        <div className='w-full px-2 flex justify-center py-1 shrink-0'>
          <Tooltip
            content={`Storage: ${percentageUsed}% used (${formatBytes(
              storageStats.totalUsed,
              0
            )} of ${formatBytes(storageStats.totalCapacity, 0)})`}
            side='right'
          >
            <div
              onClick={() => setCurrentSection('My Files')}
              className='w-12 bg-white dark:bg-zinc-900/60 shadow-[inset_0_0_0_1px_var(--color-card-border)] rounded-xl py-2 px-1 flex flex-col items-center gap-1.5 select-none shadow-sm cursor-pointer hover:shadow-md transition-all duration-200'
            >
              <svg
                className='w-5 h-5 text-[#0056f7]'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z'
                />
              </svg>
              <span className='text-[10px] font-bold text-[#0056f7] dark:text-blue-400'>
                {percentageUsed}%
              </span>
              <div className='w-8 bg-slate-100 dark:bg-zinc-800 h-1 rounded-full overflow-hidden relative'>
                <div
                  className='h-full bg-[#0056f7] rounded-full'
                  style={{ width: `${percentageUsed}%` }}
                />
              </div>
            </div>
          </Tooltip>
        </div>

        {/* Divider before switcher */}
        <div className='w-8 h-[1px] bg-slate-100 dark:bg-zinc-800/80 my-1 shrink-0' />

        {/* Collapsed Theme Switcher */}
        <div className="w-full px-2 flex justify-center py-1 shrink-0">
          <div className="w-12 p-0.5 bg-slate-50/50 dark:bg-zinc-950/40 rounded-xl flex items-center justify-center select-none shadow-[inset_0_0_0_1px_var(--color-card-border)]">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-all cursor-pointer focus:outline-none bg-white dark:bg-zinc-800 shadow-sm border border-slate-100 dark:border-zinc-700/50"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? (
                <svg
                  className="w-5 h-5 text-slate-700 dark:text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728A9 9 0 115.636 5.636a9 9 0 0112.728 12.728z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </aside>
    )
  }

  // ----------------------------------------------------
  // EXPANDED VIEW
  // ----------------------------------------------------
  return (
    <aside
      className={cn(
        'w-60 bg-sidebar-bg flex flex-col justify-between h-full pt-5 pb-4 md:pt-6 md:pb-5 select-none shrink-0 transition-all duration-200 text-foreground relative shadow-[inset_-1px_0_0_0_var(--sidebar-border)]',
        className
      )}
    >
      {/* Brand Header with Integrated Collapse Button */}
      <div className='px-4 flex shrink-0 w-full'>
        <div
          className='flex w-full flex-col lg:flex-row lg:items-center lg:justify-between items-center justify-center gap-2 select-none'
        >
          {/* Logo and text - clicking this toggles sidebar */}
          <div
            onClick={toggleSidebar}
            className='flex items-center gap-2 cursor-pointer hover:opacity-85 min-w-0'
            title='Collapse sidebar'
          >
            {logoIcon}
            <span className='text-base font-bold text-slate-900 dark:text-white tracking-tight font-sans truncate'>
              Cloud<span className='font-extrabold'>SpaceGo</span>
            </span>
          </div>

          {/* Collapse chevron button */}
          <button
            onClick={toggleSidebar}
            className='text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer focus:outline-none transition-colors shrink-0'
            title='Collapse sidebar'
          >
            <svg
              className='w-7 h-7'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2.8}
            >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M11 19l-7-7 7-7m8 14l-7-7 7-7'
            />
          </svg>
        </button>
      </div>
    </div>

      {/* "+ New" Dropdown Button */}
      <div className='px-4 mt-4'>
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
                <span>New</span>
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
      <nav className='flex-1 px-3 mt-4 flex flex-col gap-1 select-none'>
        {mainNavItems.map(item => {
          const isActive = currentSection === item.name
          const isTrash = item.name === 'Trash'

          return (
            <div key={item.name} className='w-full flex flex-col gap-1'>
              {isTrash && (
                <div className='h-[1px] bg-slate-100 dark:bg-zinc-800/80 my-1 mx-3' />
              )}
              <button
                onClick={() => setCurrentSection(item.name as SidebarSection)}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2 rounded-xl transition-all duration-150 cursor-pointer border border-transparent font-sans',
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
                        ? 'text-[#0056f7] dark:text-blue-400'
                        : 'text-slate-400 dark:text-slate-500'
                    )}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </span>
              </button>
            </div>
          )
        })}
      </nav>

      {/* Separator above Storage */}
      <div className='h-[1px] bg-slate-100 dark:bg-zinc-800/80 my-0.5 mx-6 shrink-0' />

      {/* Storage details panel */}
      <div className='px-4 py-1.5 shrink-0'>
        <div className='w-full bg-white dark:bg-zinc-900/60 rounded-2xl p-3 shadow-[inset_0_0_0_1px_var(--color-card-border)] flex flex-col gap-2.5 select-none'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-[#0056f7] dark:text-blue-400 shrink-0 shadow-sm'>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z'
                  />
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
            <span className='text-[10px] font-bold text-slate-800 dark:text-slate-350'>
              {formatBytes(storageStats.totalUsed, 1)} of{' '}
              {formatBytes(storageStats.totalCapacity, 0)} used
            </span>
            <div className='w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden relative'>
              <div
                className='h-full bg-[#0056f7] rounded-full'
                style={{ width: `${percentageUsed}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => alert('Storage upgrade options coming soon!')}
            className='w-full flex items-center justify-between text-[10px] font-bold text-[#0056f7] dark:text-blue-400 hover:text-[#004bd6] transition-colors pt-0.5 cursor-pointer group'
          >
            <span>Upgrade Storage</span>
            <svg
              className='w-3 h-3 transform group-hover:translate-x-0.5 transition-transform'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2.5}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Separator above Switcher */}
      <div className='h-[1px] bg-slate-100 dark:bg-zinc-800/80 my-0.5 mx-6 shrink-0' />

      {/* Theme Toggle switcher (horizontal capsule tab) */}
      <div className='px-4 py-1.5 shrink-0'>
        <div className='w-full p-0.5 bg-slate-50/50 dark:bg-zinc-950/40 rounded-xl flex items-center justify-between select-none shadow-[inset_0_0_0_1px_var(--color-card-border)] relative'>
          <button
            onClick={() => theme === 'dark' && toggleTheme()}
            className={cn(
              'w-1/2 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer focus:outline-none',
              theme === 'light'
                ? 'bg-white dark:bg-zinc-800 text-[#0056f7] dark:text-blue-400 shadow-sm border border-slate-100 dark:border-zinc-700/50 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            <svg
              className='w-4 h-4 text-amber-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728A9 9 0 115.636 5.636a9 9 0 0112.728 12.728z'
              />
            </svg>
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
            <svg
              className='w-4 h-4 text-slate-700 dark:text-slate-300'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
              />
            </svg>
            <span>Dark</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
