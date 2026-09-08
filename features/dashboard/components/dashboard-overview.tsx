'use client'

import React, { useMemo, useState } from 'react'
import { useApp } from '@/providers/app-provider'
import { useToast } from '@/providers/toast-provider'
import { FolderCard } from '@/features/directory/components/folder-card'
import { FileList } from '@/features/files/components/file-list'
import { RenameModal } from '@/features/files/components/rename-modal'
import { SectionAction } from '@/components/ui/section-action'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { Folder, ChevronRight, Eye, Edit3, Share2, Trash2 } from 'lucide-react'
import { useDirectory } from '@/features/directory/hooks/use-directory'
import type { DirectoryItem } from '@/features/directory/types'
import { ActionMenuItem } from '@/components/ui/action-menu'

function deriveFileType(filename: string, ext?: string): string {
  const extension = (ext || filename.split('.').pop() || '')
    .replace('.', '')
    .toLowerCase()
  if (extension === 'pdf') return 'pdf'
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(extension))
    return 'image'
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension)) return 'video'
  if (
    ['doc', 'docx', 'txt', 'md', 'pptx', 'xlsx', 'csv'].includes(extension)
  )
    return 'document'
  return 'other'
}

export default function DashboardOverview() {
  const {
    files: mockFiles,
    setCurrentSection,
    setActiveModal,
    setSelectedFileId,
    setActiveFolderId,
  } = useApp()
  const { user } = useAuth()
  const toast = useToast()

  const {
    directory,
    isLoading: isDirectoryLoading,
    error: directoryError,
    rename: renameDir,
    remove: removeDir,
    refresh
  } = useDirectory()

  const [renameFolderTarget, setRenameFolderTarget] = useState<DirectoryItem | null>(null)

  const folders: DirectoryItem[] = useMemo(() => {
    return directory?.directories ?? []
  }, [directory])

  // Show a maximum of 4 folder cards on the Home page
  const displayedFolders = useMemo(() => {
    return folders.slice(0, 4)
  }, [folders])

  const handlePerformRenameFolder = async (newName: string) => {
    if (!renameFolderTarget) return
    try {
      await renameDir(renameFolderTarget.id, { newDirName: newName })
      setRenameFolderTarget(null)
    } catch (err) {
      console.error('Failed to rename directory:', err)
      throw err
    }
  }

  const handlePerformDeleteFolder = async (folder: DirectoryItem) => {
    try {
      await removeDir(folder.id)
      toast.success(
        'Moved to Trash',
        `"${folder.name}" was moved to Trash.`
      )
    } catch (err) {
      console.error('Failed to delete directory:', err)
      toast.error('Failed to delete', `Could not delete "${folder.name}".`)
    }
  }

  // Get active time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    const name = user?.name || 'Prashant'
    if (hour < 12) return `Good morning, ${name}`
    if (hour < 17) return `Good afternoon, ${name}`
    return `Good evening, ${name}`
  }

  // Use real directory files if available, sorted by most recently updated/opened, otherwise mock files
  const allRecentFiles = useMemo(() => {
    if (directory?.files && directory.files.length > 0) {
      const list = [...directory.files]
      return list
        .sort((a, b) => {
          const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime()
          const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime()
          return timeB - timeA
        })
        .map(f => ({
          id: f.id || f._id || '',
          name: f.name,
          type: deriveFileType(f.name, f.extension) as any,
          extension: f.extension,
          size: typeof f.size === 'number' ? f.size : 0,
          starred: false,
          updatedAt: f.updatedAt || f.createdAt || new Date().toISOString(),
          raw: f
        }))
    }

    const allMock = mockFiles.filter(f => f.type !== 'folder' && !f.deleted)
    return allMock.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }, [directory?.files, mockFiles])

  // Show a maximum of 8 recent files on the Home page
  const displayedFiles = useMemo(() => {
    return allRecentFiles.slice(0, 8)
  }, [allRecentFiles])

  const recentFolder = folders[0]

  const getFolderDropdownItems = (folder: DirectoryItem): ActionMenuItem[] => [
    {
      label: 'Open',
      onClick: () => {
        setCurrentSection('My Files')
        setActiveFolderId(folder.id)
      },
      icon: <Eye className='w-4 h-4 text-text-secondary' />
    },
    {
      label: 'Rename',
      onClick: () => setRenameFolderTarget(folder),
      icon: <Edit3 className='w-4 h-4 text-text-secondary' />
    },
    {
      label: 'Share',
      onClick: () => {
        setSelectedFileId(folder.id)
        setActiveModal('share')
      },
      icon: <Share2 className='w-4 h-4 text-text-secondary' />
    },
    {
      label: 'Delete',
      onClick: () => handlePerformDeleteFolder(folder),
      icon: <Trash2 className='w-4 h-4 text-rose-500' />,
      danger: true
    }
  ]

  return (
    <div className='flex flex-col w-full select-none'>
      {/* Top Greeting, Actions & Continue Section */}
      <div className='flex flex-col items-start w-full select-none'>
        {/* Greeting headline */}
        <h1 className='text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2'>
          {getGreeting()}
        </h1>

        {/* Subtitle */}
        <p className='text-xs text-text-muted mt-1'>
          Everything you need, right where you left it.
        </p>

        {/* Compact Continue where you left off row */}
        {recentFolder && (
          <div
            onClick={() => {
              setCurrentSection('My Files')
              setActiveFolderId(recentFolder.id)
            }}
            className='w-full md:w-[560px] md:max-w-[600px] mt-3.5 bg-card-bg hover:bg-input-bg/50 border border-card-border rounded-xl px-3.5 sm:px-4 py-2.5 flex items-center justify-between transition-all duration-200 cursor-pointer group focus:outline-none select-none text-xs shadow-xs'
          >
            <div className='flex items-center gap-2.5 sm:gap-3 min-w-0'>
              <div className='w-7 h-7 rounded-lg bg-input-bg border border-card-border flex items-center justify-center text-[#6E60EE] shrink-0'>
                <Folder className='w-4 h-4' />
              </div>
              <span className='font-bold uppercase tracking-wider text-[10px] text-text-muted shrink-0'>
                CONTINUE:
              </span>
              <span className='font-semibold text-foreground truncate text-xs group-hover:text-[#6E60EE] transition-colors'>
                {recentFolder.name}
              </span>
            </div>
            <div className='flex items-center gap-1.5 text-text-muted shrink-0 ml-2'>
              <span className='text-xs text-text-secondary hidden xs:inline'>
                Last opened recently
              </span>
              <span className='text-xs text-text-secondary xs:hidden'>
                Recently
              </span>
              <ChevronRight className='w-3.5 h-3.5' />
            </div>
          </div>
        )}
      </div>

      {/* Your folders Section */}
      <div className='flex flex-col gap-3 mt-7 sm:mt-8'>
        <div className='flex items-center justify-between w-full'>
          <h3 className='text-base sm:text-lg font-bold text-foreground tracking-tight'>
            Your folders
          </h3>
          <SectionAction
            onClick={() => {
              setCurrentSection('My Files')
              setActiveFolderId(null) // Go to files root folder
            }}
          >
            View all
          </SectionAction>
        </div>

        {/* Folders Presentation: Loading / Error / Content */}
        {isDirectoryLoading ? (
          <div className='grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] xl:grid-cols-4 gap-3 sm:gap-4'>
            {[1, 2, 3, 4].map(idx => (
              <div
                key={idx}
                className='h-16 bg-card-bg/60 border border-card-border rounded-xl animate-pulse p-3 flex items-center gap-3'
              >
                <div className='w-7 h-7 bg-input-bg rounded-lg shrink-0' />
                <div className='flex-1 flex flex-col gap-1.5'>
                  <div className='h-3 bg-input-bg rounded w-3/4' />
                  <div className='h-2 bg-input-bg rounded w-1/2' />
                </div>
              </div>
            ))}
          </div>
        ) : directoryError ? (
          <div className='w-full py-6 flex flex-col items-center justify-center text-center bg-card-bg border border-card-border rounded-xl p-4 gap-2'>
            <p className='text-xs text-rose-500 font-medium'>{directoryError}</p>
            <button
              onClick={() => refresh()}
              className='text-xs font-semibold text-[#6E60EE] hover:underline flex items-center gap-1 cursor-pointer'
            >
              Retry
            </button>
          </div>
        ) : folders.length === 0 ? (
          <div className='w-full py-8 flex flex-col items-center justify-center text-center bg-card-bg border border-dashed border-card-border rounded-xl p-6'>
            <Folder className='w-8 h-8 text-text-muted mb-2' />
            <h4 className='text-xs font-bold text-foreground'>No folders found</h4>
            <p className='text-[11px] text-text-secondary mt-1 max-w-[220px] leading-normal font-normal'>
              Create your first folder to organize your files.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] xl:grid-cols-4 gap-3 sm:gap-4'>
            {displayedFolders.map(folder => {
              const dropdownItems = getFolderDropdownItems(folder)

              return (
                <FolderCard
                  key={folder.id}
                  id={folder.id}
                  name={folder.name}
                  itemsCountText='0 files'
                  starred={false}
                  onClick={() => {
                    setCurrentSection('My Files')
                    setActiveFolderId(folder.id)
                  }}
                  customActions={dropdownItems}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* Recently Opened Section - Standardized with FileList (supporting Grid & List views) */}
      <div className='mt-7 sm:mt-8'>
        <FileList
          files={displayedFiles}
          title='Recently Opened'
          showViewToggle={true}
          showViewAll={allRecentFiles.length > 8}
          limit={8}
          emptyMessage='No files found'
          emptySubtitle='Upload your first file to get started.'
        />
      </div>

      {/* Custom Rename Modal for Folders */}
      <RenameModal
        isOpen={Boolean(renameFolderTarget)}
        onClose={() => setRenameFolderTarget(null)}
        initialName={renameFolderTarget?.name || ''}
        itemType="folder"
        onRename={handlePerformRenameFolder}
      />
    </div>
  )
}
