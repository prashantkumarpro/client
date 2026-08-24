'use client'

import { Modal } from '@/components/ui/modal'
import { useAuth } from '@/features/auth/hooks/use-auth'

interface AccountDetailsProps {
  open: boolean
  onClose: () => void
}

export default function AccountDetails ({ open, onClose }: AccountDetailsProps) {
  const { user } = useAuth()

  return (
    <Modal
      open={open}
      onClose={onClose}
      title='Account Details'
      description='Your account information'
      className='max-w-md'
    >
      {/* User identity */}
      <div className='flex items-center gap-4'>
        <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-card-border bg-divider'>
          <span className='text-lg font-bold uppercase text-foreground'>
            {user?.name?.charAt(0) || 'U'}
          </span>
        </div>

        <div className='min-w-0'>
          <h3 className='truncate text-sm font-semibold text-foreground'>
            {user?.name || 'User'}
          </h3>

          <p className='mt-1 truncate text-xs text-text-secondary'>
            {user?.email || 'No email available'}
          </p>
        </div>
      </div>

      {/* Account information */}
      <div className='mt-6 flex flex-col gap-4'>
        <div className='rounded-xl border border-card-border bg-background p-4'>
          <p className='text-[10px] font-bold uppercase tracking-[1px] text-text-muted'>
            Full Name
          </p>

          <p className='mt-1.5 text-sm text-foreground'>
            {user?.name || 'User'}
          </p>
        </div>

        <div className='rounded-xl border border-card-border bg-background p-4'>
          <p className='text-[10px] font-bold uppercase tracking-[1px] text-text-muted'>
            Email Address
          </p>

          <p className='mt-1.5 break-all text-sm text-foreground'>
            {user?.email || 'No email available'}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className='mt-6 flex justify-end'>
        <button
          type='button'
          onClick={onClose}
          className='h-10 rounded-lg bg-foreground px-5 text-xs font-bold uppercase tracking-[1px] text-background transition-opacity hover:opacity-90'
        >
          Close
        </button>
      </div>
    </Modal>
  )
}
