'use client'

import React from 'react'
import { useApp } from '@/providers/app-provider'
import { FolderGrid } from '@/features/directory/components/folder-grid'
import { FileList } from '@/features/files/components/file-list'
import { cn } from '@/lib/utils/cn'

export default function MyFilesView () {
  const { setActiveFolderId, currentFolderBreadcrumbs } = useApp()
  
  return (
    <div className='flex flex-col gap-6'>
      {/* Header Breadcrumbs Row */}
      <div className='flex items-center justify-between border-b border-card-border pb-4 shrink-0 select-none'>
        <div className='flex items-center gap-2 flex-wrap'>
          {currentFolderBreadcrumbs.map((crumb, idx) => {
            const isLast = idx === currentFolderBreadcrumbs.length - 1
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <span className='text-text-muted text-xs'>/</span>}
                <button
                  disabled={isLast}
                  onClick={() => setActiveFolderId(crumb.id)}
                  className={cn(
                    'text-xs font-bold transition-colors focus:outline-none',
                    isLast
                      ? 'text-[#6E60EE] cursor-default'
                      : 'text-text-secondary hover:text-foreground cursor-pointer'
                  )}
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            )
          })}
        </div>

        <span className='text-[10px] font-bold uppercase tracking-[1px] text-text-muted'>
          Active Folder Workspace
        </span>
      </div>

      {/* Folders block */}
      <FolderGrid />

      {/* Files block */}
      <FileList title='Files' />
    </div>
  )
}
