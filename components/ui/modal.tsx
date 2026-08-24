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
        className={`w-full rounded-2xl border border-card-border bg-card-bg shadow-xl ${className}`}
        onMouseDown={event => event.stopPropagation()}
        role='dialog'
        aria-modal='true'
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        {(title || description || showCloseButton) && (
          <div className='flex items-start justify-between border-b border-card-border px-6 py-5'>
            <div className='min-w-0'>
              {title && (
                <h2
                  id='modal-title'
                  className='text-sm font-bold uppercase tracking-[1px] text-foreground'
                >
                  {title}
                </h2>
              )}

              {description && (
                <p
                  id='modal-description'
                  className='mt-1 text-xs text-text-secondary'
                >
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type='button'
                onClick={onClose}
                className='ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background hover:text-foreground'
                aria-label='Close modal'
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        <div className='p-6'>{children}</div>
      </div>
    </div>
  )
}
