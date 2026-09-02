'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useApp } from '@/providers/app-provider'
import { Plus, FolderPlus, FileUp, FolderUp } from 'lucide-react'

export function MobilePlusButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { setActiveModal } = useApp()
  const containerRef = useRef<HTMLDivElement>(null)

  const toggle = () => setIsOpen(prev => !prev)
  const close = () => setIsOpen(false)

  // Close on outside click or escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const menuItems = [
    {
      label: 'New folder',
      onClick: () => {
        close()
        setActiveModal('create-folder')
      },
      icon: <FolderPlus className='w-4 h-4' strokeWidth={2.2} />
    },
    {
      label: 'File upload',
      onClick: () => {
        close()
        setActiveModal('upload-file')
      },
      icon: <FileUp className='w-4 h-4' strokeWidth={2.2} />
    },
    {
      label: 'Folder upload',
      onClick: () => {
        close()
        setActiveModal('upload-folder')
      },
      icon: <FolderUp className='w-4 h-4' strokeWidth={2.2} />
    }
  ]

  return (
    <>
      {/* Backdrop overlay for outside click dismissal on mobile */}
      {isOpen && (
        <div
          onClick={close}
          className='fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px] md:hidden transition-opacity animate-in fade-in duration-150'
          aria-hidden='true'
        />
      )}

      {/* Fixed Floating Container at bottom right */}
      <div
        ref={containerRef}
        className='fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] right-[calc(1.5rem+env(safe-area-inset-right,0px))] z-50 md:hidden'
      >
        {/* Menu opening upwards above the FAB */}
        {isOpen && (
          <div
            className='absolute bottom-full right-0 mb-3 w-56 bg-card-bg border border-card-border rounded-2xl shadow-2xl p-1.5 flex flex-col gap-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150'
            role='menu'
            aria-orientation='vertical'
          >
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className='w-full text-left px-3 py-2.5 text-sm font-semibold text-text-secondary hover:text-foreground hover:bg-input-bg active:bg-input-bg transition-colors flex items-center gap-3 rounded-xl cursor-pointer select-none'
                role='menuitem'
              >
                <div className='w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-input-bg text-[#6E60EE] border border-card-border'>
                  {item.icon}
                </div>
                <span className='truncate'>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Floating Circular Plus Action Button */}
        <button
          onClick={toggle}
          aria-expanded={isOpen}
          aria-label='Create or upload new item'
          className='w-14 h-14 rounded-full bg-[#6E60EE] hover:bg-[#6E60EE]/90 text-white flex items-center justify-center shadow-lg shadow-[#6E60EE]/35 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none'
        >
          <Plus
            className={`w-6 h-6 text-white transition-transform duration-200 ${
              isOpen ? 'rotate-45' : 'rotate-0'
            }`}
            strokeWidth={2.5}
          />
        </button>
      </div>
    </>
  )
}
