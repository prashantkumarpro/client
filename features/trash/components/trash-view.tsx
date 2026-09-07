'use client'

import React, { useState } from 'react'
import { useApp } from '../../../providers/app-provider'
import { FileGrid } from '@/features/files/components/file-grid'
import { FilePreview } from '@/features/files/components/file-preview'
import { FilePreviewModal } from '@/features/files/components/file-preview-modal'
import { ViewToggle } from '@/components/ui/view-toggle'
import { ActionMenu, ActionMenuItem } from '@/components/ui/action-menu'
import { formatBytes, formatDate } from '../../../lib/utils/format'
import { UnifiedFileItem } from '@/features/files/components/file-list'
import { RotateCcw, Trash, Trash2, Search } from 'lucide-react'

export function TrashView() {
  const { files, restoreFile, deletePermanently, searchQuery } = useApp()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [previewFile, setPreviewFile] = useState<UnifiedFileItem | null>(null)

  const deletedFiles = React.useMemo(() => {
    return (files as UnifiedFileItem[]).filter(
      f =>
        f.deleted &&
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [files, searchQuery])

  const handleRestore = (fileId: string) => {
    restoreFile(fileId)
  }

  const handleDeletePermanently = (file: UnifiedFileItem) => {
    const fileId = file.id || file._id || ''
    if (
      confirm(
        `Are you sure you want to permanently delete "${file.name}"? This action cannot be undone.`
      )
    ) {
      deletePermanently(fileId)
    }
  }

  if (deletedFiles.length === 0) {
    if (searchQuery) {
      return (
        <div className='bg-card-bg border border-card-border rounded-xl p-16 flex flex-col items-center justify-center text-center select-none shadow-xs'>
          <div className='w-10 h-10 rounded-full bg-input-bg flex items-center justify-center text-text-muted mb-2.5'>
            <Search className='w-5 h-5' />
          </div>
          <h4 className='text-xs sm:text-sm font-bold text-foreground'>
            No results found
          </h4>
          <p className='text-xs text-text-secondary mt-1 max-w-[240px] leading-normal font-normal'>
            We couldn&apos;t find any matches in trash for &ldquo;{searchQuery}&rdquo;.
          </p>
        </div>
      )
    }
    return (
      <div className='bg-card-bg border border-card-border rounded-xl p-16 flex flex-col items-center justify-center text-center select-none shadow-xs'>
        <div className='w-12 h-12 rounded-full bg-input-bg flex items-center justify-center text-text-muted mb-3'>
          <Trash2 className='w-6 h-6 text-text-secondary' />
        </div>
        <h4 className='text-xs sm:text-sm font-bold text-foreground'>
          Trash is empty
        </h4>
        <p className='text-xs text-text-secondary mt-1 max-w-[240px] leading-normal font-normal'>
          Deleted files and folders will appear here until they are permanently removed.
        </p>
      </div>
    )
  }

  return (
    <div className='w-full flex flex-col gap-3.5'>
      {/* Header Row with Title + Count + ViewToggle */}
      <div className='flex items-center justify-between gap-3 select-none'>
        <div className='flex items-center gap-2'>
          <h3 className='text-sm sm:text-base font-bold text-foreground tracking-tight'>
            Trash Bin
          </h3>
          <span className='text-xs font-semibold text-text-muted bg-input-bg border border-card-border px-2 py-0.5 rounded-full'>
            {deletedFiles.length} {deletedFiles.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <ViewToggle
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* View Content (Grid vs List) */}
      {viewMode === 'grid' ? (
        <FileGrid
          files={deletedFiles}
          isTrash
          onFileClick={file => setPreviewFile(file)}
          onRestore={file => handleRestore(file.id || file._id || '')}
          onDeletePermanently={handleDeletePermanently}
        />
      ) : (
        <div className='w-full flex flex-col select-none bg-card-bg border border-card-border rounded-xl overflow-hidden shadow-xs'>
          {/* Column Header Row */}
          <div className='flex items-center justify-between px-3 sm:px-4 py-2 text-[11px] font-semibold text-text-secondary/70 border-b border-card-border bg-input-bg/40 select-none'>
            <div className='flex-1 min-w-0 pr-4'>
              <span>Name</span>
            </div>
            <div className='hidden md:block w-48 text-left pr-4'>
              <span>Deleted Date</span>
            </div>
            <div className='hidden sm:block w-28 text-right pr-6'>
              <span>Size</span>
            </div>
            <div className='w-16 text-right pr-2'>
              <span>Actions</span>
            </div>
          </div>

          {/* Deleted Item Rows */}
          <div className='flex flex-col divide-y divide-card-border/50'>
            {deletedFiles.map((file, idx) => {
              const fileId = file.id || file._id || `trash-${idx}`
              const dropdownItems: ActionMenuItem[] = [
                {
                  label: 'Restore',
                  onClick: () => handleRestore(fileId),
                  icon: <RotateCcw className='w-4 h-4 text-text-secondary' />
                },
                {
                  label: 'Delete Forever',
                  onClick: () => handleDeletePermanently(file),
                  icon: <Trash className='w-4 h-4 text-rose-500' />,
                  danger: true
                }
              ]

              return (
                <div
                  key={fileId}
                  onClick={() => setPreviewFile(file)}
                  className='flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-input-bg/70 active:bg-input-bg transition-colors duration-150 group cursor-pointer select-none min-w-0'
                >
                  {/* Name Column with Thumbnail */}
                  <div className='flex items-center gap-3 min-w-0 flex-1 pr-3'>
                    <FilePreview file={file} variant='list' />
                    <div className='flex flex-col min-w-0 flex-1'>
                      <span
                        className='text-xs sm:text-sm font-semibold text-foreground group-hover:text-[#6E60EE] truncate transition-colors duration-150'
                        title={file.name}
                      >
                        {file.name}
                      </span>
                      <div className='flex items-center gap-1.5 text-[11px] sm:hidden text-text-secondary mt-0.5 truncate'>
                        <span>{formatBytes(file.size || 0)}</span>
                        <span>&bull;</span>
                        <span>Deleted {formatDate(file.updatedAt || '')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Date Column */}
                  <div className='hidden md:block w-48 text-xs text-text-secondary truncate pr-4 text-left shrink-0'>
                    {formatDate(file.updatedAt || file.createdAt || '')}
                  </div>

                  {/* Size Column */}
                  <div className='hidden sm:block w-28 text-xs font-semibold text-text-secondary text-right pr-6 shrink-0'>
                    {formatBytes(file.size || 0)}
                  </div>

                  {/* Actions Menu */}
                  <div
                    className='flex items-center justify-end w-16 shrink-0'
                    onClick={e => e.stopPropagation()}
                  >
                    <ActionMenu
                      placement='bottom-right'
                      items={dropdownItems}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <FilePreviewModal
        isOpen={Boolean(previewFile)}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
        files={deletedFiles}
        onNavigate={file => setPreviewFile(file as UnifiedFileItem)}
      />
    </div>
  )
}
