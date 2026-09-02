'use client'

import React from 'react'
import { useApp } from '../../providers/app-provider'
import { SidebarSection } from '../../types'
import { cn } from '../../lib/utils/cn'
import { Tooltip } from '../ui/tooltip'
import Image from 'next/image'
import { getNavItems } from './nav-config'
import { Sun, Moon } from 'lucide-react'

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
  } = useApp()

  const mainNavItems = getNavItems()
  const isLight = theme === 'light'

  return (
    <aside
      style={{
        width: isSidebarCollapsed ? '64px' : '240px',
        minWidth: isSidebarCollapsed ? '64px' : '240px',
        transition: 'width 250ms cubic-bezier(0, 0, 0.2, 1), min-width 250ms cubic-bezier(0, 0, 0.2, 1)',
      }}
      className={cn(
        'flex flex-col justify-between h-full pb-2 md:pb-3 select-none shrink-0 relative border-r bg-sidebar-bg border-sidebar-border overflow-hidden',
        className
      )}
    >
      {/* Top Section: Header & Navigation */}
      <div className="flex flex-col w-full">
        {/* Brand Header - Height 16 (64px) matching top header baseline */}
        <div className="h-16 px-3 flex items-center shrink-0 w-full overflow-hidden">
          <Tooltip
            content={isSidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
            side={isSidebarCollapsed ? 'right' : 'bottom'}
          >
            <button
              onClick={toggleSidebar}
              style={{
                transition: 'all 250ms cubic-bezier(0, 0, 0.2, 1)',
              }}
              className={cn(
                'flex items-center cursor-pointer hover:opacity-85 select-none shrink-0 rounded-xl focus:outline-none min-w-0',
                isSidebarCollapsed ? 'w-10 h-10 justify-center mx-auto' : 'gap-2.5 w-full justify-start px-1'
              )}
              aria-label={isSidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
            >
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <Image
                  src="/images/cloudeLogo.png"
                  width={32}
                  height={28}
                  alt="cloudspacego logo"
                  className="w-8 h-auto object-contain shrink-0"
                  priority
                />
              </div>
              <div
                style={{
                  maxWidth: isSidebarCollapsed ? '0px' : '160px',
                  opacity: isSidebarCollapsed ? 0 : 1,
                  transform: isSidebarCollapsed ? 'translateX(-8px)' : 'translateX(0px)',
                  transition: 'all 250ms cubic-bezier(0, 0, 0.2, 1)',
                }}
                className="flex items-center overflow-hidden whitespace-nowrap"
              >
                <span className="text-xl font-bold tracking-tight font-sans text-foreground">
                  cloud<span className="font-extrabold text-[#6E60EE]">spacego</span>
                </span>
              </div>
            </button>
          </Tooltip>
        </div>

        {/* Navigation List */}
        <nav className="w-full px-2.5 mt-2 flex flex-col gap-1 select-none">
          {mainNavItems.map(item => {
            const isActive = currentSection === item.name
            const isTrash = item.name === 'Trash'

            return (
              <div key={item.name} className="w-full flex flex-col gap-1">
                {isTrash && (
                  <div
                    style={{
                      transition: 'all 250ms cubic-bezier(0, 0, 0.2, 1)',
                    }}
                    className={cn(
                      'h-[1px] bg-sidebar-border my-1 shrink-0',
                      isSidebarCollapsed ? 'w-8 mx-auto' : 'mx-2 w-auto'
                    )}
                  />
                )}
                <Tooltip
                  content={isSidebarCollapsed ? item.name : undefined}
                  side="right"
                >
                  <button
                    onClick={() => setCurrentSection(item.name as SidebarSection)}
                    style={{
                      transition: 'all 250ms cubic-bezier(0, 0, 0.2, 1)',
                    }}
                    className={cn(
                      'flex items-center rounded-xl font-sans cursor-pointer border border-transparent select-none group',
                      isSidebarCollapsed
                        ? 'w-10 h-10 justify-center p-0 mx-auto'
                        : 'w-full px-3.5 py-2.5 justify-start gap-3',
                      isActive
                        ? 'bg-sidebar-active-bg border-l-2 border-[#6E60EE] text-foreground font-bold'
                        : 'text-text-secondary hover:bg-sidebar-active-bg/50 hover:text-foreground font-semibold'
                    )}
                    aria-label={item.name}
                  >
                    <span
                      style={{
                        transition: 'color 250ms cubic-bezier(0, 0, 0.2, 1)',
                      }}
                      className={cn(
                        'w-5 h-5 flex items-center justify-center shrink-0',
                        isActive ? 'text-[#6E60EE] dark:text-white' : 'text-text-muted group-hover:text-foreground'
                      )}
                    >
                      {item.icon}
                    </span>
                    <span
                      style={{
                        maxWidth: isSidebarCollapsed ? '0px' : '140px',
                        opacity: isSidebarCollapsed ? 0 : 1,
                        transform: isSidebarCollapsed ? 'translateX(-8px)' : 'translateX(0px)',
                        transition: 'all 250ms cubic-bezier(0, 0, 0.2, 1)',
                      }}
                      className="text-[13px] overflow-hidden whitespace-nowrap min-w-0 text-left"
                    >
                      {item.name === 'Shared' ? 'Shared with me' : item.name}
                    </span>
                  </button>
                </Tooltip>
              </div>
            )
          })}
        </nav>
      </div>

      {/* Bottom Section: Storage & Theme Toggle */}
      <div className="flex flex-col w-full">
        {/* Separator above Storage */}
        <div
          style={{
            transition: 'all 250ms cubic-bezier(0, 0, 0.2, 1)',
          }}
          className={cn(
            'h-[1px] bg-sidebar-border my-1 shrink-0',
            isSidebarCollapsed ? 'w-8 mx-auto' : 'mx-6'
          )}
        />

        {/* Storage Details Panel */}
        <div className="w-full px-3 py-1.5 shrink-0 overflow-hidden">
          {isSidebarCollapsed ? (
            <Tooltip content="72% used  •  2.8 GB free" side="right">
              <div
                onClick={() => setCurrentSection('My Files')}
                style={{
                  transition: 'all 250ms cubic-bezier(0, 0, 0.2, 1)',
                }}
                className="w-10 h-14 rounded-xl py-2 px-1 mx-auto flex flex-col items-center justify-between select-none cursor-pointer border bg-card-bg border-card-border hover:bg-input-bg"
              >
                <svg
                  className="w-4 h-4 text-[#6E60EE]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
                <span className="text-[10px] font-bold text-foreground">72%</span>
                <div className="w-7 h-1.5 overflow-hidden relative border rounded-full bg-input-bg border-card-border">
                  <div className="h-full bg-[#6E60EE]" style={{ width: '72%' }} />
                </div>
              </div>
            </Tooltip>
          ) : (
            <div
              style={{
                transition: 'all 250ms cubic-bezier(0, 0, 0.2, 1)',
              }}
              className="w-full border rounded-2xl p-3 flex flex-col gap-2.5 select-none bg-card-bg border-card-border"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-input-bg text-[#6E60EE] border border-card-border">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                      />
                    </svg>
                  </div>
                  <span className="text-[11px] font-bold text-foreground">Storage</span>
                </div>
                <span className="text-[9px] font-bold text-[#FFFFFF] bg-[#6E60EE] px-2 py-0.5 rounded-full">
                  72%
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-text-secondary">
                  72% used &bull; 2.8 GB free
                </span>
                <div className="w-full h-2.5 overflow-hidden relative border rounded-full bg-input-bg border-card-border">
                  <div className="h-full bg-[#6E60EE]" style={{ width: '72%' }} />
                </div>
              </div>

              <button
                onClick={() => alert('Storage upgrade options coming soon!')}
                className="w-full flex items-center justify-between text-[10px] font-bold text-[#6E60EE] hover:text-[#6E60EE]/80 transition-colors pt-0.5 cursor-pointer group"
              >
                <span>Upgrade Storage</span>
                <svg
                  className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Separator above Switcher */}
        <div
          style={{
            transition: 'all 250ms cubic-bezier(0, 0, 0.2, 1)',
          }}
          className={cn(
            'h-[1px] bg-sidebar-border my-1 shrink-0',
            isSidebarCollapsed ? 'w-8 mx-auto' : 'mx-6'
          )}
        />

        {/* Theme Toggle Switcher */}
        <div className="w-full px-3 py-1.5 shrink-0 overflow-hidden">
          {isSidebarCollapsed ? (
            <Tooltip
              content={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              side="right"
            >
              <div
                style={{
                  transition: 'all 250ms cubic-bezier(0, 0, 0.2, 1)',
                }}
                className="w-10 p-0.5 border rounded-xl flex items-center justify-center select-none bg-input-bg border-card-border mx-auto"
              >
                <button
                  onClick={toggleTheme}
                  style={{
                    transition: 'all 250ms cubic-bezier(0, 0, 0.2, 1)',
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-lg cursor-pointer focus:outline-none border bg-card-bg border-card-border text-text-secondary hover:text-foreground"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? (
                    <Moon className="w-4 h-4" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-500" />
                  )}
                </button>
              </div>
            </Tooltip>
          ) : (
            <div
              style={{
                transition: 'all 250ms cubic-bezier(0, 0, 0.2, 1)',
              }}
              className="w-full p-0.5 border rounded-xl flex items-center justify-between select-none relative bg-input-bg border-card-border"
            >
              <button
                onClick={() => theme === 'dark' && toggleTheme()}
                className={cn(
                  'w-1/2 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer focus:outline-none border border-transparent transition-all duration-200',
                  isLight
                    ? 'bg-card-bg border-card-border text-[#6E60EE] font-bold shadow-sm'
                    : 'text-text-secondary hover:text-foreground'
                )}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light</span>
              </button>

              <div className="h-4 w-[1px] bg-sidebar-border shrink-0 self-center" />

              <button
                onClick={() => theme === 'light' && toggleTheme()}
                className={cn(
                  'w-1/2 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer focus:outline-none border border-transparent transition-all duration-200',
                  !isLight
                    ? 'bg-card-bg border-card-border text-white font-bold shadow-sm'
                    : 'text-text-secondary hover:text-foreground'
                )}
              >
                <Moon className="w-4 h-4 text-slate-400" />
                <span>Dark</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
