import React from 'react'
import { cn } from '../../lib/utils/cn'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'soft' | 'outline' | 'icon' | 'ghost' | 'danger'

  size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none',

          // Size mappings
          variant !== 'icon' && {
            'px-4 h-9 text-xs': size === 'sm',
            'px-5 h-11 text-sm': size === 'md',
            'px-6 h-12 text-base': size === 'lg'
          },

          // Variant mappings
          {
            // Primary
            'bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-sm border border-transparent':
              variant === 'primary',

            // Soft
            'bg-[#e9efff] text-[#0667ff] hover:bg-[#dfe8ff] border border-transparent':
              variant === 'soft',

            // Outline
            'bg-transparent text-foreground border border-card-border hover:bg-divider':
              variant === 'outline',

            // Ghost
            'bg-transparent text-foreground hover:bg-divider':
              variant === 'ghost',

            // Icon
            'rounded-full bg-card-bg text-foreground border border-card-border hover:bg-divider w-10 h-10 p-0 flex items-center justify-center':
              variant === 'icon',

            // Danger
            'bg-red-600 text-white hover:bg-red-700': variant === 'danger'
          },

          // Shape
          variant !== 'icon' ? 'rounded-[10px]' : 'rounded-full',

          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
