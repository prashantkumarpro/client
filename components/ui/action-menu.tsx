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
            'bg-card-bg hover:bg-input-bg w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border border-card-border cursor-pointer focus:outline-none transition-colors shrink-0',
            triggerClassName
          )}
          aria-label='More actions'
        >
          <svg className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-secondary' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M12 10a2 2 0 11-2 2 2 2 0 012-2zm0-6a2 2 0 11-2 2 2 2 0 012-2zm0 12a2 2 0 11-2 2 2 2 0 012-2z' />
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
