import React from 'react'
import { cn } from '../../lib/utils/cn'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  startIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, startIcon, ...props }, ref) => {
    return (
      <div className='w-full flex flex-col gap-1.5'>
        {label && (
          <label className='text-[14px] font-semibold text-[#142044]'>
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
              'w-full h-11 bg-white text-[#142044] border border-[#dce3ef] rounded-[10px] px-4 py-3 text-[14px] font-normal placeholder:text-[#8290ad] transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed',
              startIcon ? 'pl-11' : '',
              error &&
                'border-red-500 focus:border-red-500 focus:ring-red-500/10',
              className
            )}
            {...props}
          />
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
