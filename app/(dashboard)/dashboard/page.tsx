'use client'

import React from 'react'
import { useApp } from '@/providers/app-provider'
import { FileList } from '@/features/files/components/file-list'
import { TrashView } from '@/features/trash/components/trash-view'
import { UploadModal } from '@/features/files/components/upload-modal'
import { CreateFolderModal } from '@/features/directory/components/create-folder-modal'
import { ShareModal } from '@/features/sharing/components/share-modal'
import { GetLinkModal } from '@/features/sharing/components/get-link-modal'
import DashboardOverview from '@/features/dashboard/components/dashboard-overview'
import MyFilesView from '@/features/files/components/my-files-view'
import SettingsView from '@/features/settings/components/settings-view'

export default function DashboardPage () {
  const { currentSection } = useApp()

  return (
    <div className='flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans antialiased transition-colors duration-200'>
      {/* Main content viewport */}
      <div className='flex-1 flex flex-col min-w-0 h-full overflow-hidden'>
        {/* Dashboard Inner Scrollable Body */}
        <main className='flex-1 overflow-auto p-6 md:p-8 flex flex-col gap-6 md:gap-8'>
          {/* VIEW: Dashboard */}
          {currentSection === 'Dashboard' && <DashboardOverview />}

          {/* VIEW: My Files */}
          {currentSection === 'My Files' && <MyFilesView />}

          {/* VIEW: Shared */}
          {currentSection === 'Shared' && <FileList title='Shared Assets' />}

          {/* VIEW: Recent */}
          {currentSection === 'Recent' && <FileList title='Recent Assets' />}

          {/* VIEW: Starred */}
          {currentSection === 'Starred' && <FileList title='Starred Assets' />}

          {/* VIEW: Trash */}
          {currentSection === 'Trash' && <TrashView />}

          {/* VIEW: Settings */}
          {currentSection === 'Settings' && <SettingsView />}
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
