'use client'

import React from 'react'
import { Dialog, DialogProps } from './dialog'

export interface ModalProps {
  open?: boolean
  isOpen?: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
  maxWidth?: string
  headerDivider?: boolean
  icon?: React.ReactNode
}

export function Modal({
  open,
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  showCloseButton = true,
  maxWidth = 'max-w-[440px]',
  headerDivider = false,
  icon
}: ModalProps) {
  const active = Boolean(open ?? isOpen)

  return (
    <Dialog
      isOpen={active}
      onClose={onClose}
      title={title}
      description={description}
      className={className}
      showCloseButton={showCloseButton}
      maxWidth={maxWidth}
      headerDivider={headerDivider}
      icon={icon}
    >
      {children}
    </Dialog>
  )
}
