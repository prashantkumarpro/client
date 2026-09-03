'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'
import { Tooltip } from './tooltip'

export interface ActionMenuItem {
  label: string
  onClick: () => void
  icon: React.ReactNode
  danger?: boolean
}

interface ActionMenuProps {
  items: ActionMenuItem[]
  className?: string
  triggerClassName?: string
  align?: 'left' | 'right'
  placement?: 'top' | 'bottom' | 'right' | 'bottom-right'
  onOpenChange?: (isOpen: boolean) => void
}

export function ActionMenu ({ items, className, triggerClassName, align = 'right', placement = 'bottom', onOpenChange }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggle = () => {
    const nextState = !isOpen
    setIsOpen(nextState)
    if (onOpenChange) {
      onOpenChange(nextState)
    }
  }

  const close = () => {
    setIsOpen(false)
    if (onOpenChange) {
      onOpenChange(false)
    }
  }

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className={cn('relative inline-block text-left', className)} ref={containerRef}>
      {/* Three-dots trigger button */}
      <Tooltip content="More actions" side="top">
        <button
          onClick={toggle}
          className={cn(
            'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-card-bg hover:bg-input-bg active:bg-[#6E60EE]/10 border border-card-border hover:border-[#6E60EE]/40 text-text-secondary hover:text-foreground active:text-[#6E60EE] active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E60EE]/50 focus-visible:ring-offset-1 focus-visible:ring-offset-card-bg shrink-0 shadow-xs',
            isOpen && 'border-[#6E60EE]/50 text-[#6E60EE] bg-[#6E60EE]/10',
            triggerClassName
          )}
          aria-label='More actions'
          aria-expanded={isOpen}
        >
          <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
            <circle cx='12' cy='5' r='1.75' />
            <circle cx='12' cy='12' r='1.75' />
            <circle cx='12' cy='19' r='1.75' />
          </svg>
        </button>
      </Tooltip>

      {/* Context menu dropdown overlay */}
      {isOpen && (
        <div
          className={cn(
            'absolute w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-slate-100 dark:border-zinc-700/80 py-1 z-40',
            placement === 'top' && 'bottom-9 right-0 animate-in fade-in slide-in-from-bottom-2 duration-150',
            placement === 'bottom' && 'top-8 right-0 animate-in fade-in slide-in-from-top-2 duration-150',
            placement === 'right' && 'left-full top-0 ml-2.5 animate-in fade-in slide-in-from-left-2 duration-150',
            placement === 'bottom-right' && 'left-0 top-8 animate-in fade-in slide-in-from-top-2 duration-150'
          )}
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                item.onClick()
                close()
              }}
              className={cn(
                'w-full px-4 py-2 text-left text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer focus:outline-none',
                item.danger
                  ? 'text-red-500 hover:bg-red-500/10'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-700/50'
              )}
            >
              <span className={item.danger ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
