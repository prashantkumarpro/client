'use client'

import React, { useState, useEffect } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trash2, AlertTriangle } from 'lucide-react'

export interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  itemName: string
  itemType?: 'file' | 'folder'
  isPermanent?: boolean
  onConfirm: () => Promise<void> | void
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  itemName,
  itemType = 'file',
  isPermanent = false,
  onConfirm
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setIsDeleting(false)
      setError('')
    }
  }, [isOpen])

  const handleClose = () => {
    if (isDeleting) return
    setError('')
    onClose()
  }

  const handleConfirm = async () => {
    try {
      setIsDeleting(true)
      setError('')
      await onConfirm()
      handleClose()
    } catch (err) {
      console.error('Failed to delete:', err)
      setError(`Failed to delete ${itemType}. Please try again.`)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-[420px]"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
            {isPermanent ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h3 className="text-base font-bold text-foreground tracking-tight leading-snug break-words">
              Delete &ldquo;{itemName}&rdquo;?
            </h3>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              {isPermanent
                ? `Are you sure you want to permanently delete this ${itemType}? This action cannot be undone.`
                : `This item will be moved to Trash.`}
            </p>
            {error && (
              <p className="text-xs text-rose-500 font-medium mt-2">
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-card-border/60">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isDeleting}
            className="h-9 px-4 text-xs font-semibold text-text-secondary hover:text-foreground hover:bg-input-bg"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="h-9 px-4 text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting
              ? 'Deleting...'
              : isPermanent
              ? 'Delete Forever'
              : 'Move to Trash'}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
