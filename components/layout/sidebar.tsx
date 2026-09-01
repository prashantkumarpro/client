'use client'

import React from 'react'
import { useApp } from '../../providers/app-provider'
import { SidebarSection } from '../../types'
import { cn } from '../../lib/utils/cn'
import { Tooltip } from '../ui/tooltip'
import { Dropdown } from '../ui/dropdown'
import Image from 'next/image'
import { getNavItems } from './nav-config'
import { Sun, Moon, Folder } from 'lucide-react'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const {
    currentSection,
    setCurrentSection,
    isSidebarCollapsed,
    toggleSidebar,
    theme,
    toggleTheme,
    setActiveModal,
  } = useApp()

  const percentageUsed = 72 // Enforce exactly 72% used as per specs

  const mainNavItems = getNavItems()

  // Theme-specific styles helper
  const isLight = theme === 'light'

  const uploadDropdownItems = [
    {
      label: 'New folder',
      onClick: () => setActiveModal('create-folder'),
      className: 'py-3 px-4 text-sm font-semibold border-b bg-card-bg hover:bg-input-bg text-foreground border-card-border',
      icon: (
        <div className='w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-input-bg text-[#6E60EE] border border-card-border'>
          <Folder className="w-5 h-5" />
        </div>
      )
    },
    {
      label: 'File upload',
      onClick: () => setActiveModal('upload-file'),
      className: 'py-3 px-4 text-sm font-semibold border-b bg-card-bg hover:bg-input-bg text-foreground border-card-border',
      icon: (
        <div className='w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-input-bg text-text-secondary border border-card-border'>
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
      className: 'py-3 px-4 text-sm font-semibold bg-card-bg hover:bg-input-bg text-foreground',
      icon: (
        <div className='w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-input-bg text-text-secondary border border-card-border'>
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

  if (isSidebarCollapsed) {
    // ----------------------------------------------------
    // COLLAPSED VIEW
    // ----------------------------------------------------
    return (
      <aside
        className={cn(
          'w-16 flex flex-col justify-between items-center h-full pb-2 md:pb-3 select-none shrink-0 transition-all duration-200 relative border-r bg-sidebar-bg border-sidebar-border',
          className
        )}
      >
        {/* Brand Logo - Height 16 matching top header baseline */}
        <div className='h-16 flex items-center justify-center shrink-0 w-full px-2'>
          <Tooltip content="open sidebar" side="right">
            <div
              onClick={toggleSidebar}
              className='w-10 h-10 flex items-center justify-center cursor-pointer hover:opacity-85 select-none shrink-0'
            >
              <Image
                src="/images/logo.png"
                width={36}
                height={36}
                alt="Logo"
                className="object-contain"
                priority
              />
            </div>
          </Tooltip>
        </div>

        {/* Collapsed + New dropdown button trigger */}
        <div className='w-full px-2 mt-4 flex justify-center'>
          <Tooltip content='New File/Folder' side='right'>
            <Dropdown
              align='left'
              items={uploadDropdownItems}
              trigger={
                <button
                  className='w-11 h-11 flex items-center justify-center rounded-xl bg-[#6E60EE] hover:bg-[#6E60EE]/90 text-white cursor-pointer transition-all duration-200 shadow-sm border border-transparent'
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
                    <div className='w-8 h-[1px] bg-sidebar-border my-0.5 shrink-0' />
                  )}
                  <button
                    onClick={() => {
                      setCurrentSection(item.name as SidebarSection)
                    }}
                    className={cn(
                      'w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer border border-transparent',
                      isActive
                        ? 'bg-sidebar-active-bg border-l-2 border-[#6E60EE] text-foreground'
                        : 'text-text-secondary hover:bg-sidebar-active-bg/50 hover:text-foreground'
                    )}
                  >
                    <span className={isActive ? 'text-[#6E60EE] dark:text-white' : 'text-text-muted'}>
                      {item.icon}
                    </span>
                  </button>
                </div>
              </Tooltip>
            )
          })}
        </nav>

        {/* Divider before Storage */}
        <div className='w-8 h-[1px] bg-sidebar-border my-1 shrink-0' />

        {/* Collapsed Storage details */}
        <div className='w-full px-2 flex justify-center py-1 shrink-0'>
          <Tooltip
            content="72% used  •  2.8 GB free"
            side='right'
          >
            <div
              onClick={() => setCurrentSection('My Files')}
              className='w-12 rounded-xl py-2 px-1 flex flex-col items-center gap-1.5 select-none cursor-pointer transition-all duration-200 border bg-card-bg border-card-border hover:bg-input-bg'
            >
              <svg
                className='w-5 h-5 text-[#6E60EE]'
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
              <span className='text-[10px] font-bold text-foreground'>
                72%
              </span>
              <div className='w-8 h-2 overflow-hidden relative border rounded-full bg-input-bg border-card-border'>
                <div
                  className='h-full bg-[#6E60EE]'
                  style={{ width: '72%' }}
                />
              </div>
            </div>
          </Tooltip>
        </div>

        {/* Divider before switcher */}
        <div className='w-8 h-[1px] bg-sidebar-border my-1 shrink-0' />

        {/* Collapsed Theme Switcher */}
        <div className="w-full px-2 flex justify-center py-1 shrink-0">
          <Tooltip
            content={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            side='right'
          >
            <div className='w-12 p-0.5 border rounded-xl flex items-center justify-center select-none bg-input-bg border-card-border'>
              <button
                onClick={toggleTheme}
                className='w-9 h-9 flex items-center justify-center rounded-lg transition-all cursor-pointer focus:outline-none border bg-card-bg border-card-border text-text-secondary hover:text-foreground'
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )}
              </button>
            </div>
          </Tooltip>
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
        'w-60 flex flex-col justify-between h-full pb-2 md:pb-3 select-none shrink-0 transition-all duration-200 text-foreground relative border-r bg-sidebar-bg border-sidebar-border',
        className
      )}
    >
      {/* Brand Header - Height 16 matching top header baseline */}
      <div className='h-16 px-4 flex items-center shrink-0 w-full'>
        <div
          className='flex w-full items-center justify-start select-none'
        >
          {/* Logo and text - clicking this toggles sidebar */}
          <Tooltip content="close sidebar" side="bottom">
            <div
              onClick={toggleSidebar}
              className='flex items-center gap-3 cursor-pointer hover:opacity-85 min-w-0'
            >
              <Image
                src="/images/logo.png"
                width={36}
                height={36}
                alt="Logo"
                className="object-contain"
                priority
              />
              <span className='text-xl font-semibold tracking-tight font-sans truncate text-foreground'>
                cloud<span className='font-black text-[#6E60EE]'>spacego</span>
              </span>
            </div>
          </Tooltip>
        </div>
      </div>

      {/* "+ New" Dropdown Button */}
      <div className='px-4 mt-4'>
        <Dropdown
          align='left'
          className='w-full'
          items={uploadDropdownItems}
          trigger={
            <button className='w-full flex items-center justify-between bg-[#6E60EE] hover:bg-[#6E60EE]/90 rounded-xl px-5 py-3.5 text-sm font-bold text-white cursor-pointer transition-all duration-200 shadow-sm border border-transparent'>
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
      <nav className='flex-1 px-3 mt-4 flex flex-col gap-1 select-none'>
        {mainNavItems.map(item => {
          const isActive = currentSection === item.name
          const isTrash = item.name === 'Trash'

          return (
            <div key={item.name} className='w-full flex flex-col gap-1'>
              {isTrash && (
                <div className='h-[1px] bg-sidebar-border my-1 mx-3' />
              )}
              <button
                onClick={() => setCurrentSection(item.name as SidebarSection)}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-r-xl border-l-2 font-sans transition-all duration-150 cursor-pointer',
                  isActive
                    ? 'bg-sidebar-active-bg border-[#6E60EE] text-foreground font-bold'
                    : 'border-transparent text-text-secondary hover:bg-sidebar-active-bg/50 hover:text-foreground font-semibold'
                )}
              >
                <span className='flex items-center gap-3 text-[13px]'>
                  <span
                    className={cn(
                      'transition-colors shrink-0',
                      isActive ? 'text-[#6E60EE] dark:text-white' : 'text-text-muted'
                    )}
                  >
                    {item.icon}
                  </span>
                  <span className="flex items-center gap-1.5 justify-between flex-1 min-w-0">
                    <span className="truncate">{item.name === 'Shared' ? 'Shared with me' : item.name}</span>
                  </span>
                </span>
              </button>
            </div>
          )
        })}
      </nav>

      {/* Separator above Storage */}
      <div className='h-[1px] bg-sidebar-border my-0.5 mx-6 shrink-0' />

      {/* Storage details panel (Show progress bar once with 72% used) */}
      <div className='px-4 py-1.5 shrink-0'>
        <div className='w-full border rounded-2xl p-3 flex flex-col gap-2.5 select-none bg-card-bg border-card-border'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-input-bg text-[#6E60EE] border border-card-border'>
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
              <span className='text-[11px] font-bold text-foreground'>
                Storage
              </span>
            </div>
            <span className='text-[9px] font-bold text-[#FFFFFF] bg-[#6E60EE] px-2 py-0.5 rounded-full'>
              72%
            </span>
          </div>

          <div className='flex flex-col gap-1'>
            <span className='text-[10px] font-bold text-text-secondary'>
              72% used &bull; 2.8 GB free
            </span>
            <div className='w-full h-2.5 overflow-hidden relative border rounded-full bg-input-bg border-card-border'>
              <div
                className='h-full bg-[#6E60EE]'
                style={{ width: '72%' }}
              />
            </div>
          </div>

          <button
            onClick={() => alert('Storage upgrade options coming soon!')}
            className='w-full flex items-center justify-between text-[10px] font-bold text-[#6E60EE] hover:text-[#6E60EE]/80 transition-colors pt-0.5 cursor-pointer group'
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
      <div className='h-[1px] bg-sidebar-border my-0.5 mx-6 shrink-0' />

      {/* Theme Toggle switcher (horizontal capsule tab) */}
      <div className='px-4 py-1.5 shrink-0'>
        <div className='w-full p-0.5 border rounded-xl flex items-center justify-between select-none relative bg-input-bg border-card-border'>
          <button
            onClick={() => theme === 'dark' && toggleTheme()}
            className={cn(
              'w-1/2 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer focus:outline-none border border-transparent',
              isLight
                ? 'bg-card-bg border-card-border text-[#6E60EE] font-bold shadow-sm'
                : 'text-text-secondary hover:text-foreground'
            )}
          >
            <Sun className='w-4 h-4 text-amber-500' />
            <span>Light</span>
          </button>

          <div className='h-4 w-[1px] bg-sidebar-border shrink-0 self-center' />

          <button
            onClick={() => theme === 'light' && toggleTheme()}
            className={cn(
              'w-1/2 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer focus:outline-none border border-transparent',
              !isLight
                ? 'bg-card-bg border-card-border text-white font-bold shadow-sm'
                : 'text-text-secondary hover:text-foreground'
            )}
          >
            <Moon className='w-4 h-4 text-slate-400' />
            <span>Dark</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
