'use client'

import React from 'react'
import { useApp } from '@/providers/app-provider'
import { FolderGrid } from '@/features/directory/components/folder-grid'
import { FileList } from '@/features/files/components/file-list'
import { TrashView } from '@/features/trash/components/trash-view'
import { UploadModal } from '@/features/files/components/upload-modal'
import { CreateFolderModal } from '@/features/directory/components/create-folder-modal'
import { ShareModal } from '@/features/sharing/components/share-modal'
import { GetLinkModal } from '@/features/sharing/components/get-link-modal'
import { cn } from '@/lib/utils/cn'
import DashboardOverview from '@/features/dashboard/components/dashboard-overview'

export default function DashboardPage () {
  const { currentSection, setActiveFolderId, currentFolderBreadcrumbs } =
    useApp()

  return (
    <div className='flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans antialiased transition-colors duration-200'>
      {/* Main content viewport */}
      <div className='flex-1 flex flex-col min-w-0 h-full overflow-hidden'>
        {/* Dashboard Inner Scrollable Body */}
        <main className='flex-1 overflow-auto p-6 md:p-8 flex flex-col gap-6 md:gap-8'>
          {/* VIEW: Dashboard */}
          {currentSection === 'Dashboard' && <DashboardOverview />}

          {/* VIEW: My Files */}
          {currentSection === 'My Files' && (
            <div className='flex flex-col gap-6'>
              {/* Header Breadcrumbs Row */}
              <div className='flex items-center justify-between border-b border-card-border pb-4 shrink-0 select-none'>
                <div className='flex items-center gap-2 flex-wrap'>
                  {currentFolderBreadcrumbs.map((crumb, idx) => {
                    const isLast = idx === currentFolderBreadcrumbs.length - 1
                    return (
                      <React.Fragment key={idx}>
                        {idx > 0 && (
                          <span className='text-text-muted text-xs'>/</span>
                        )}
                        <button
                          disabled={isLast}
                          onClick={() => setActiveFolderId(crumb.id)}
                          className={cn(
                            'text-xs font-bold uppercase tracking-[0.5px] transition-colors focus:outline-none',
                            isLast
                              ? 'text-[#2563eb] cursor-default'
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
          )}

          {/* VIEW: Shared */}
          {currentSection === 'Shared' && <FileList title='Shared Assets' />}

          {/* VIEW: Recent */}
          {currentSection === 'Recent' && <FileList title='Recent Assets' />}

          {/* VIEW: Starred */}
          {currentSection === 'Starred' && <FileList title='Starred Assets' />}

          {/* VIEW: Trash */}
          {currentSection === 'Trash' && <TrashView />}

          {/* VIEW: Settings */}
          {currentSection === 'Settings' && (
            <div className='bg-card-bg border border-card-border rounded-2xl p-6 text-foreground flex flex-col gap-6 shadow-sm'>
              <div className='flex items-center justify-between border-b border-card-border pb-4 shrink-0 select-none'>
                <h3 className='text-xs font-bold uppercase tracking-[1px] text-text-muted'>
                  Application Settings
                </h3>
              </div>

              <div className='flex flex-col gap-4 font-light text-sm text-text-secondary'>
                <div className='flex items-center justify-between p-4 bg-background border border-card-border rounded-xl'>
                  <div>
                    <div className='text-xs font-bold text-foreground uppercase tracking-[0.5px]'>
                      Performance Mode
                    </div>
                    <div className='text-[11px] text-text-muted mt-1'>
                      Accelerates transitions and UI layouts.
                    </div>
                  </div>
                  <div className='w-10 h-6 bg-emerald-500 rounded-full flex items-center p-0.5 justify-end'>
                    <div className='w-5 h-5 bg-white rounded-full shadow' />
                  </div>
                </div>

                <div className='flex items-center justify-between p-4 bg-background border border-card-border rounded-xl'>
                  <div>
                    <div className='text-xs font-bold text-foreground uppercase tracking-[0.5px]'>
                      High Contrast Outlines
                    </div>
                    <div className='text-[11px] text-text-muted mt-1'>
                      Thicken borders for enhanced visibility.
                    </div>
                  </div>
                  <div className='w-10 h-6 bg-divider rounded-full flex items-center p-0.5 justify-start border border-card-border'>
                    <div className='w-5 h-5 bg-white rounded-full shadow' />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Global Dialog Overlays */}
      <UploadModal />
      <CreateFolderModal />
      <ShareModal />
      <GetLinkModal />
    </div>
  )
}
