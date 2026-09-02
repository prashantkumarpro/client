'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useApp } from '@/providers/app-provider'
import { Plus, Upload, FolderPlus, X } from 'lucide-react'

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

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          onClick={close}
          className='fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px] md:hidden transition-opacity duration-200 ease-out'
          aria-hidden='true'
        />
      )}

      {/* Speed Dial Container at bottom right, positioned above bottom navigation */}
      <div
        ref={containerRef}
        className='fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] right-[calc(1.25rem+env(safe-area-inset-right,0px))] z-40 md:hidden flex flex-col items-end'
      >
        {/* Actions speed-dial expanding vertically above the FAB */}
        <div
          className={`flex flex-col items-end gap-2.5 mb-3 transition-all duration-200 ease-out origin-bottom-right ${
            isOpen
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
          }`}
          role='menu'
          aria-orientation='vertical'
        >
          {/* Action 1: Upload */}
          <button
            onClick={() => {
              close()
              setActiveModal('upload-file')
            }}
            className='flex items-center gap-3 px-4 py-2.5 rounded-full bg-card-bg text-foreground border border-card-border shadow-xl hover:border-[#6E60EE]/50 active:bg-input-bg active:scale-95 transition-all text-sm font-semibold cursor-pointer select-none'
            role='menuitem'
          >
            <Upload className='w-4 h-4 text-[#6E60EE]' strokeWidth={2.2} />
            <span>Upload</span>
          </button>

          {/* Action 2: New folder */}
          <button
            onClick={() => {
              close()
              setActiveModal('create-folder')
            }}
            className='flex items-center gap-3 px-4 py-2.5 rounded-full bg-card-bg text-foreground border border-card-border shadow-xl hover:border-[#6E60EE]/50 active:bg-input-bg active:scale-95 transition-all text-sm font-semibold cursor-pointer select-none'
            role='menuitem'
          >
            <FolderPlus className='w-4 h-4 text-[#6E60EE]' strokeWidth={2.2} />
            <span>New folder</span>
          </button>
        </div>

        {/* Floating Action Button (FAB) */}
        <button
          onClick={toggle}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close actions menu' : 'Open actions menu'}
          className='w-14 h-14 rounded-full bg-[#6E60EE] hover:bg-[#6E60EE]/90 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-[#6E60EE]/35 transition-all duration-200 ease-out cursor-pointer focus:outline-none'
        >
          <div className='relative w-6 h-6 flex items-center justify-center'>
            <Plus
              className={`w-6 h-6 text-white absolute transition-all duration-200 ease-out ${
                isOpen ? 'rotate-90 opacity-0 scale-75' : 'rotate-0 opacity-100 scale-100'
              }`}
              strokeWidth={2.5}
            />
            <X
              className={`w-6 h-6 text-white absolute transition-all duration-200 ease-out ${
                isOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-75'
              }`}
              strokeWidth={2.5}
            />
          </div>
        </button>
      </div>
    </>
  )
}
