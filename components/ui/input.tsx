import React from 'react'

import { cn } from '../../lib/utils/cn'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  startIcon?: React.ReactNode
  endAction?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = 'text', label, error, startIcon, endAction, ...props },
    ref
  ) => {
    return (
      <div className='w-full flex flex-col gap-1.5'>
        {label && (
          <label className='text-[11px] font-bold tracking-[1.5px] uppercase text-text-secondary'>
            {label}
          </label>
        )}

        <div className='relative'>
          {startIcon && (
            <span className='absolute left-4 top-1/2 -translate-y-1/2 text-text-muted'>
              {startIcon}
            </span>
          )}

          <input
            ref={ref}
            type={type}
            className={cn(
              'w-full h-11 bg-input-bg text-foreground rounded-none px-4 py-2.5 text-[14px] font-light placeholder:text-text-muted transition-all duration-150 focus:bg-divider focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
              startIcon ? 'pl-12' : '',
              endAction ? 'pr-12' : '',
              error
                ? 'shadow-[inset_0_0_0_1px_#ef4444] focus:shadow-[inset_0_0_0_2px_#ef4444]'
                : 'shadow-[inset_0_0_0_1px_var(--color-card-border)] focus:shadow-[inset_0_0_0_2px_var(--foreground)]',
              className
            )}
            {...props}
          />

          {endAction && (
            <div className='absolute right-4 top-1/2 -translate-y-1/2'>
              {endAction}
            </div>
          )}
        </div>

        {error && (
          <span className='text-[10px] font-bold uppercase tracking-[0.5px] text-red-500'>
            {error}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
