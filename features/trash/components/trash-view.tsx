'use client'

import React, { useState } from 'react'
import { useApp } from '../../../providers/app-provider'
import { FileGrid } from '@/features/files/components/file-grid'
import { FileTable } from '@/features/files/components/file-table'
import { FilePreview } from '@/features/files/components/file-preview'
import { FilePreviewModal } from '@/features/files/components/file-preview-modal'
import { ViewToggle } from '@/components/ui/view-toggle'
import { ActionMenuItem } from '@/components/ui/action-menu'
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

  const getTrashDropdownItems = (file: UnifiedFileItem): ActionMenuItem[] => {
    const fileId = file.id || file._id || ''
    return [
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
        /* REFINED TRASH LIST / TABLE VIEW (Clean, unboxed workspace table using reusable FileTable) */
        <FileTable
          files={deletedFiles}
          onFileClick={file => setPreviewFile(file)}
          customActions={getTrashDropdownItems}
          showLocation={false}
          showDate={true}
          showSize={true}
          dateLabel='Deleted Date'
          allFiles={files as UnifiedFileItem[]}
        />
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
