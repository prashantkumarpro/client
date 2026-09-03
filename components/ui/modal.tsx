'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
}

export function Modal ({
  open,
  onClose,
  title,
  description,
  children,
  className = '',
  showCloseButton = true
}: ModalProps) {
  useEffect(() => {
    if (!open) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm'
      onMouseDown={onClose}
      role='presentation'
    >
      <div
        className={`w-full max-w-lg rounded-xl border border-card-border bg-card-bg shadow-xl ${className}`}
        onMouseDown={event => event.stopPropagation()}
        role='dialog'
        aria-modal='true'
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        {(title || description || showCloseButton) && (
          <div className='flex items-start justify-between border-b border-card-border px-5 py-4'>
            <div className='min-w-0'>
              {title && (
                <h2
                  id='modal-title'
                  className='text-base font-bold text-foreground tracking-tight'
                >
                  {title}
                </h2>
              )}

              {description && (
                <p
                  id='modal-description'
                  className='mt-0.5 text-xs text-text-secondary'
                >
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type='button'
                onClick={onClose}
                className='ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-input-bg hover:text-foreground active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E60EE]/50'
                aria-label='Close modal'
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        <div className='p-5'>{children}</div>
      </div>
    </div>
  )
}
