'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface SectionActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export const SectionAction = React.forwardRef<
  HTMLButtonElement,
  SectionActionProps
>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type='button'
      className={cn(
        'inline-flex items-center justify-center font-semibold text-xs text-[#6E60EE] dark:text-[#8E82F8] bg-[#6E60EE]/10 hover:bg-[#6E60EE]/15 dark:bg-[#6E60EE]/15 dark:hover:bg-[#6E60EE]/25 hover:text-[#6052E6] dark:hover:text-[#A499FA] px-3.5 py-1.5 rounded-[11px] border border-transparent transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E60EE]/50 select-none active:scale-[0.98]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})

SectionAction.displayName = 'SectionAction'
