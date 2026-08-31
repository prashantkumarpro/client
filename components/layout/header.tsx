'use client'

import { useApp } from '../../providers/app-provider'
import { SearchBar } from '../../features/search/components/search-bar'
import { Button } from '../ui/button'
import { Dropdown, DropdownItemType } from '../ui/dropdown'
import { cn } from '../../lib/utils/cn'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { useState } from 'react'
import AccountDetails from '@/features/auth/components/account-details'
import { Tooltip } from '../ui/tooltip'

interface HeaderProps {
  onMenuToggle?: () => void
  className?: string
}

export function Header({ onMenuToggle, className }: HeaderProps) {
  const { currentSection, setCurrentSection, isSidebarCollapsed, toggleSidebar } = useApp()
  const { user, logout } = useAuth()
  const [isAccountDetailsOpen, setIsAccountDetailsOpen] = useState(false)

  const profileDropdownItems: DropdownItemType[] = [
    {
      label: 'Account Details',
      onClick: () => setIsAccountDetailsOpen(true)
    },
    {
      label: 'Storage Settings',
      onClick: () => alert('Storage plan details opened')
    },
    {
      label: 'Sign Out',
      onClick: logout,
      className: 'text-red-500 hover:bg-red-500/10'
    }
  ]

  return (
    <>
      <header
        className={cn(
          'h-16 w-full bg-card-bg border-b border-card-border flex items-center justify-between px-6 text-foreground select-none relative transition-all duration-200 shrink-0 z-20',
          className
        )}
      >

        {/* Left Side: Search Bar & Actions */}
        <div className='flex items-center gap-3.5 flex-1 z-10 min-w-0'>
          {/* Hamburger Menu Toggle Button (visible on mobile only) */}
          <Tooltip content="open sidebar" side="bottom">
            <button
              onClick={onMenuToggle}
              className='flex md:hidden w-10 h-10 bg-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl items-center justify-center cursor-pointer hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-colors shrink-0'
              aria-label='Open navigation menu'
            >
              <svg
                className='w-5.5 h-5.5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2.5}
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M4 8h16M4 16h10' />
              </svg>
            </button>
          </Tooltip>

          {/* Mobile Viewport Section Title */}
          <span className="flex md:hidden text-xs font-bold text-slate-850 dark:text-white uppercase tracking-[1px] select-none shrink-0 border-r border-slate-200 dark:border-zinc-800 pr-3.5 mr-0.5">
            {currentSection === 'Shared' ? 'Shared with me' : currentSection}
          </span>

          {/* Search Bar - responsive, fluid */}
          <div className='flex-1 max-w-lg min-w-0'>
            <SearchBar />
          </div>


        </div>

        {/* Header Actions cluster */}
        <div className='flex items-center gap-4 ml-auto shrink-0 z-10'>
          {/* Notifications Icon Button */}
          <div className='relative shrink-0'>
            <button
              className='w-10 h-10 bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-all duration-200 relative'
              onClick={() => alert('Viewing 3 mock notifications')}
              aria-label='View notifications'
            >
              <svg
                className='w-5.5 h-5.5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                />
              </svg>
              {/* Blue badge corresponding to screenshot design */}
              <span className='absolute top-1.5 right-1.5 bg-[#6E60EE] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-sm pointer-events-none'>
                3
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className='h-6 w-[1px] bg-slate-200 dark:bg-zinc-800 shrink-0 self-center' />

          {/* Settings Icon Button */}
          <button
            className='w-10 h-10 bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-all duration-200 shrink-0'
            onClick={() => setCurrentSection('Settings')}
            aria-label='Open settings'
          >
            <svg
              className='w-5.5 h-5.5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={1.8}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
          </button>

          {/* Divider */}
          <div className='h-6 w-[1px] bg-slate-200 dark:bg-zinc-800 shrink-0 self-center' />

          {/* User profile dropdown - Avatar and status circle indicator */}
          <Dropdown
            align='right'
            items={profileDropdownItems}
            trigger={
              <div className='flex items-center gap-2 px-1.5 py-1 rounded-full hover:bg-slate-50 dark:hover:bg-zinc-800/40 cursor-pointer select-none transition-colors group relative shrink-0'>
                <div className='w-9 h-9 rounded-full bg-slate-200 overflow-hidden relative shrink-0 shadow-[inset_0_0_0_1px_var(--color-card-border)]'>
                  <img
                    src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop'
                    alt='User Profile'
                    className='w-full h-full object-cover'
                  />
                  <span className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm pointer-events-none' />
                </div>
                <svg
                  className='w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white transition-transform duration-200 group-hover:translate-y-0.5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </div>
            }
          />
        </div>
      </header>
      <AccountDetails
        open={isAccountDetailsOpen}
        onClose={() => setIsAccountDetailsOpen(false)}
      />
    </>
  )
}
