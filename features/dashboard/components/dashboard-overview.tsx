'use client'

import React, { useState, useMemo } from 'react'
import { useApp } from '@/providers/app-provider'
import { cn } from '@/lib/utils/cn'
import { ActionMenu, ActionMenuItem } from '@/components/ui/action-menu'
import { Tooltip } from '@/components/ui/tooltip'
import { FolderCard } from '@/features/directory/components/folder-card'
import { FileList } from '@/features/files/components/file-list'
import { formatBytes, formatDate } from '@/lib/utils/format'
import {
  Star,
  Folder,
  Image as ImageIcon,
  ChevronRight,
  FileText,
  Video,
  File as FileIcon,
  LayoutGrid,
  List,
  Eye,
  Download,
  Share2,
  Edit3,
  FolderInput,
  Trash2,
  RefreshCw
} from 'lucide-react'
import { useDirectory } from '@/features/directory/hooks/use-directory'
import type { DirectoryItem } from '@/features/directory/types'

export default function DashboardOverview () {
  const {
    files,
    setCurrentSection,
    setActiveModal,
    setSelectedFileId,
    setActiveFolderId,
    toggleStar,
    deleteFile
  } = useApp()

  const {
    directory,
    isLoading: isDirectoryLoading,
    error: directoryError,
    create,
    rename,
    remove,
    refresh
  } = useDirectory()

  const folders: DirectoryItem[] = useMemo(() => {
    return directory?.directories ?? []
  }, [directory])

  const [activeCardMenuId, setActiveCardMenuId] = useState<string | null>(null)
  const [folderViewMode, setFolderViewMode] = useState<'grid' | 'list'>('grid')
  const [recentFilesViewMode, setRecentFilesViewMode] = useState<'grid' | 'list'>('grid')

  // Folder Action Handlers connecting to useDirectory()
  const handleCreateFolder = async (dirname = 'New Folder') => {
    try {
      await create({ dirname })
    } catch (err) {
      console.error('Failed to create directory:', err)
    }
  }

  const handleRenameFolder = async (folderId: string, currentTitle: string) => {
    const newName = prompt('Enter new folder name:', currentTitle)
    if (newName && newName.trim() && newName.trim() !== currentTitle) {
      try {
        await rename(folderId, { newDirName: newName.trim() })
      } catch (err) {
        console.error('Failed to rename directory:', err)
      }
    }
  }

  const handleDeleteFolder = async (folderId: string) => {
    try {
      await remove(folderId)
    } catch (err) {
      console.error('Failed to delete directory:', err)
    }
  }

  // Get active time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning, Prashant 👋'
    if (hour < 17) return 'Good afternoon, Prashant 👋'
    return 'Good evening, Prashant 👋'
  }

  // Helper to map file types to larger grid icons in mid gray color (grayscale)
  const getFileIconGrid = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className='w-8 h-8 text-text-secondary shrink-0' />
      case 'image':
        return <ImageIcon className='w-8 h-8 text-text-secondary shrink-0' />
      case 'video':
        return <Video className='w-8 h-8 text-text-secondary shrink-0' />
      case 'document':
        return <FileText className='w-8 h-8 text-text-secondary shrink-0' />
      default:
        return <FileIcon className='w-8 h-8 text-text-secondary shrink-0' />
    }
  }

  // Filter out folder type to get only files
  const allFilesOnly = useMemo(() => {
    return files.filter(f => f.type !== 'folder' && !f.deleted)
  }, [files])

  // Get displayed files list (Recent files sorted by updated date)
  const displayedFiles = useMemo(() => {
    let result = [...allFilesOnly]
    result = result.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    return result.slice(0, 4) // display up to 4 files as shown in mockup
  }, [allFilesOnly])

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
      onClick: () => handleRenameFolder(folder.id, folder.name),
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
      label: 'Star',
      onClick: () => alert(`Starring folder "${folder.name}" coming soon`),
      icon: <Star className='w-4 h-4 text-text-secondary' />
    },
    {
      label: 'Move',
      onClick: () => alert(`Move folder "${folder.name}"`),
      icon: <FolderInput className='w-4 h-4 text-text-secondary' />
    },
    {
      label: 'Delete',
      onClick: () => handleDeleteFolder(folder.id),
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
            className='w-full md:w-[560px] md:max-w-[600px] mt-4 bg-card-bg hover:bg-input-bg/70 border border-card-border hover:border-[#6E60EE]/40 rounded-xl px-4 py-2.5 flex items-center justify-between transition-colors cursor-pointer group focus:outline-none select-none text-xs shadow-xs'
          >
            <div className='flex items-center gap-3 min-w-0'>
              <div className='w-6 h-6 rounded-md bg-[#6E60EE]/10 flex items-center justify-center text-[#6E60EE] shrink-0'>
                <Folder className='w-3.5 h-3.5' />
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
      <div className='flex flex-col gap-3 mt-6 sm:mt-7'>
        <div className='flex items-center justify-between w-full'>
          <h3 className='text-base sm:text-lg font-bold text-foreground tracking-tight'>
            Your folders
          </h3>
          <button
            onClick={() => {
              setCurrentSection('My Files')
              setActiveFolderId(null) // Go to files root folder
            }}
            className='text-xs font-semibold text-[#6E60EE] hover:text-[#6E60EE]/80 transition-colors flex items-center gap-1 cursor-pointer focus:outline-none'
          >
            <span>View all</span>
          </button>
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
              <RefreshCw className='w-3 h-3' />
              <span>Retry</span>
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
        ) : folderViewMode === 'grid' ? (
          <div className='grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] xl:grid-cols-4 gap-3 sm:gap-4'>
            {folders.map(folder => {
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
        ) : (
          <div className='bg-card-bg border border-card-border rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden divide-y divide-card-border'>
            {folders.map(folder => {
              const dropdownItems = getFolderDropdownItems(folder)

              return (
                <div
                  key={folder.id}
                  onClick={() => {
                    setCurrentSection('My Files')
                    setActiveFolderId(folder.id)
                  }}
                  className='flex items-center justify-between p-3 sm:p-3.5 hover:bg-input-bg/50 transition-colors duration-200 group cursor-pointer select-none'
                >
                  <div className='flex items-center gap-3 min-w-0 flex-1'>
                    <div className='w-9 h-9 rounded-lg bg-[#6E60EE]/10 flex items-center justify-center text-[#6E60EE] shrink-0 group-hover:bg-[#6E60EE] group-hover:text-white transition-all duration-200'>
                      <Folder className='w-5 h-5' />
                    </div>
                    <div className='flex flex-col min-w-0 flex-1'>
                      <span className='text-xs sm:text-sm font-bold text-foreground truncate group-hover:text-[#6E60EE] transition-colors duration-200'>
                        {folder.name}
                      </span>
                      <span className='text-[10px] sm:text-xs text-text-secondary truncate mt-0.5'>
                        0 files
                      </span>
                    </div>
                  </div>
                  <div
                    className='flex items-center gap-2 sm:gap-3 shrink-0'
                    onClick={e => e.stopPropagation()}
                  >
                    <ActionMenu
                      placement='bottom-right'
                      items={dropdownItems}
                      onOpenChange={isOpen =>
                        setActiveCardMenuId(isOpen ? folder.id : null)
                      }
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Recently Opened Section */}
      <div className='flex flex-col gap-2.5 sm:gap-3 w-full mt-5 sm:mt-6'>
        <div className='flex items-center justify-between select-none'>
          <h3 className='text-base sm:text-lg font-bold text-foreground tracking-tight'>
            Recently Opened
          </h3>

          {/* Single View Mode Toggle Switcher */}
          <div className='flex items-center bg-input-bg border border-card-border p-1 rounded-xl shrink-0 gap-1 shadow-none select-none'>
            <Tooltip content='Grid view' side='top'>
              <button
                onClick={() => setRecentFilesViewMode('grid')}
                className={cn(
                  'w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E60EE]/50 active:scale-95',
                  recentFilesViewMode === 'grid'
                    ? 'bg-card-bg text-[#6E60EE] shadow-xs border border-card-border/60'
                    : 'text-text-secondary hover:text-foreground hover:bg-card-bg/50'
                )}
                aria-label='Grid view'
                aria-pressed={recentFilesViewMode === 'grid'}
              >
                <LayoutGrid
                  className='w-4 h-4'
                  strokeWidth={recentFilesViewMode === 'grid' ? 2.2 : 1.8}
                />
              </button>
            </Tooltip>
            <Tooltip content='List view' side='top'>
              <button
                onClick={() => setRecentFilesViewMode('list')}
                className={cn(
                  'w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E60EE]/50 active:scale-95',
                  recentFilesViewMode === 'list'
                    ? 'bg-card-bg text-[#6E60EE] shadow-xs border border-card-border/60'
                    : 'text-text-secondary hover:text-foreground hover:bg-card-bg/50'
                )}
                aria-label='List view'
                aria-pressed={recentFilesViewMode === 'list'}
              >
                <List
                  className='w-4 h-4'
                  strokeWidth={recentFilesViewMode === 'list' ? 2.2 : 1.8}
                />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Files Content (Grid View vs List View) */}
        {displayedFiles.length === 0 ? (
          <div className='w-full py-10 flex flex-col items-center justify-center text-center select-none bg-card-bg border border-card-border rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-6'>
            <h4 className='text-xs font-bold text-text-secondary'>
              No files found
            </h4>
            <p className='text-[11px] text-text-secondary mt-1 max-w-[200px] leading-normal font-light'>
              This category does not have any items yet.
            </p>
          </div>
        ) : recentFilesViewMode === 'grid' ? (
          <div className='grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] xl:grid-cols-4 gap-3 sm:gap-4'>
            {displayedFiles.map(file => {
              const fileDropdownItems = [
                {
                  label: 'Open',
                  onClick: () => alert(`Opening ${file.name}`),
                  icon: <Eye className='w-4 h-4 text-text-secondary' />
                },
                {
                  label: 'Download',
                  onClick: () => alert(`Downloading ${file.name}`),
                  icon: <Download className='w-4 h-4 text-text-secondary' />
                },
                {
                  label: 'Share',
                  onClick: () => {
                    setSelectedFileId(file.id)
                    setActiveModal('share')
                  },
                  icon: <Share2 className='w-4 h-4 text-text-secondary' />
                },
                {
                  label: 'Rename',
                  onClick: () => {
                    const newName = prompt('Enter new filename:', file.name)
                    if (newName && newName.trim()) {
                      alert(`Renamed ${file.name} to ${newName.trim()}`)
                    }
                  },
                  icon: <Edit3 className='w-4 h-4 text-text-secondary' />
                },
                {
                  label: 'Move',
                  onClick: () => alert(`Move file "${file.name}"`),
                  icon: <FolderInput className='w-4 h-4 text-text-secondary' />
                },
                {
                  label: file.starred ? 'Unstar' : 'Star',
                  onClick: () => toggleStar(file.id),
                  icon: <Star className='w-4 h-4 text-text-secondary' />
                },
                {
                  label: 'Delete',
                  onClick: () => deleteFile(file.id),
                  icon: <Trash2 className='w-4 h-4 text-rose-500' />,
                  danger: true
                }
              ]

              return (
                <div
                  key={file.id}
                  className='bg-card-bg rounded-xl border border-card-border hover:border-[#6E60EE]/40 shadow-xs p-3 sm:p-3.5 flex flex-col gap-2.5 group relative select-none cursor-pointer transition-all duration-200 min-w-0'
                >
                  <div className='w-full h-20 sm:h-24 bg-input-bg rounded-lg flex items-center justify-center border border-card-border relative overflow-hidden shrink-0 group-hover:bg-[#6E60EE]/5 group-hover:border-[#6E60EE]/20 transition-all duration-200'>
                    {getFileIconGrid(file.type)}
                    {file.starred && (
                      <div className='absolute top-1.5 right-1.5 bg-card-bg rounded-md p-1 border border-card-border shadow-xs'>
                        <Star className='w-3 h-3 text-[#6E60EE] fill-[#6E60EE]' />
                      </div>
                    )}
                  </div>
                  <div className='flex items-center justify-between gap-1.5 w-full min-w-0'>
                    <div className='flex flex-col min-w-0 flex-1 text-left'>
                      <span
                        className='text-[13px] sm:text-sm font-semibold text-foreground truncate group-hover:text-[#6E60EE] transition-colors duration-200'
                        title={file.name}
                      >
                        {file.name}
                      </span>
                      <span className='text-[11px] sm:text-xs font-normal text-text-secondary truncate mt-0.5'>
                        {formatBytes(file.size)}
                      </span>
                    </div>
                    <div
                      className='shrink-0 -mr-1'
                      onClick={e => e.stopPropagation()}
                    >
                      <ActionMenu
                        placement='bottom-right'
                        items={fileDropdownItems}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <FileList
            files={displayedFiles}
            showHeader={true}
            showCardContainer={false}
          />
        )}
      </div>
    </div>
  )
}
