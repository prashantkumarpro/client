'use client'

import React, { useState, useMemo } from 'react'
import { useApp } from '@/providers/app-provider'
import { cn } from '@/lib/utils/cn'
import { ActionMenu } from '@/components/ui/action-menu'
import { Tooltip } from '@/components/ui/tooltip'
import { formatBytes, formatDate } from '@/lib/utils/format'
import { Clock, Star, Folder, Image as ImageIcon, ChevronRight, Users, FileText, Video, File as FileIcon, LayoutGrid, List } from 'lucide-react'

interface FolderCardData {
  id: string;
  title: string;
  itemsCountText: string;
  starred: boolean;
  shared: boolean;
}

const INITIAL_FOLDER_CARDS: FolderCardData[] = [
  {
    id: 'folder-projects',
    title: 'Projects',
    itemsCountText: '24 files  •  120 MB',
    starred: false,
    shared: false
  },
  {
    id: 'folder-design-assets',
    title: 'Design Assets',
    itemsCountText: '128 files  •  2.4 GB',
    starred: true,
    shared: false
  },
  {
    id: 'folder-documents',
    title: 'Documents',
    itemsCountText: '34 files  •  45 MB',
    starred: false,
    shared: false
  },
  {
    id: 'folder-brand-photos',
    title: 'Brand Photos',
    itemsCountText: '86 files  •  1.1 GB',
    starred: false,
    shared: false
  }
];

export default function DashboardOverview() {
  const {
    files,
    setCurrentSection,
    setActiveModal,
    setSelectedFileId,
    setActiveFolderId,
    toggleStar,
    deleteFile
  } = useApp()

  const [folderCards, setFolderCards] = useState<FolderCardData[]>(INITIAL_FOLDER_CARDS)
  const [activeCardMenuId, setActiveCardMenuId] = useState<string | null>(null)
  const [fileViewMode, setFileViewMode] = useState<'grid' | 'list'>('list')

  const toggleCardStar = (id: string) => {
    setFolderCards(prev =>
      prev.map(c => (c.id === id ? { ...c, starred: !c.starred } : c))
    )
  }

  const deleteCard = (id: string) => {
    setFolderCards(prev => prev.filter(c => c.id !== id))
  }

  // Get active time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning, Prashant 👋'
    if (hour < 17) return 'Good afternoon, Prashant 👋'
    return 'Good evening, Prashant 👋'
  }

  // Helper to map file types to icons in mid gray color (grayscale)
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className='w-5 h-5 text-text-secondary shrink-0' />
      case 'image':
        return <ImageIcon className='w-5 h-5 text-text-secondary shrink-0' />
      case 'video':
        return <Video className='w-5 h-5 text-text-secondary shrink-0' />
      case 'document':
        return <FileText className='w-5 h-5 text-text-secondary shrink-0' />
      default:
        return <FileIcon className='w-5 h-5 text-text-secondary shrink-0' />
    }
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
    result = result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    return result.slice(0, 4) // display up to 4 files as shown in mockup
  }, [allFilesOnly])

  return (
    <div className='flex flex-col w-full select-none'>
      {/* Top Greeting, Actions & Continue Section */}
      <div className='flex flex-col items-start w-full select-none'>
        {/* Greeting headline */}
        <h1 className='text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-1.5'>
          {getGreeting()}
        </h1>

        {/* Subtitle (4–6px below greeting) */}
        <p className='text-xs text-text-muted mt-1'>
          Everything you need, right where you left it.
        </p>

        {/* Compact Continue where you left off row (Desktop: ~500-600px wide, left-aligned; Mobile: full-width) */}
        <div
          onClick={() => {
            setCurrentSection('My Files')
            setActiveFolderId('folder-1') // Set folder to Design Assets
          }}
          className='w-full md:w-[560px] md:max-w-[600px] mt-3.5 bg-card-bg hover:bg-input-bg/70 border border-card-border hover:border-[#6E60EE]/40 rounded-xl px-3.5 py-2 flex items-center justify-between transition-colors cursor-pointer group focus:outline-none select-none text-xs shadow-[0_1px_2px_rgba(0,0,0,0.03)]'
        >
          <div className='flex items-center gap-2.5 min-w-0'>
            <div className='w-6 h-6 rounded-md bg-[#6E60EE]/10 flex items-center justify-center text-[#6E60EE] shrink-0'>
              <Folder className='w-3.5 h-3.5 shrink-0' />
            </div>
            <div className='flex items-center gap-1.5 min-w-0'>
              <span className='text-[11px] font-semibold uppercase tracking-wider text-text-muted shrink-0'>
                Continue:
              </span>
              <span className='font-bold text-foreground truncate group-hover:text-[#6E60EE] transition-colors'>
                Design Assets
              </span>
            </div>
          </div>
          <div className='flex items-center gap-2 shrink-0 text-text-secondary group-hover:text-[#6E60EE] transition-colors'>
            <span className='text-[11px] text-text-muted hidden xs:inline'>
              Last opened 12 min ago
            </span>
            <span className='text-[11px] text-text-muted xs:hidden'>
              12m ago
            </span>
            <ChevronRight className='w-3.5 h-3.5' />
          </div>
        </div>
      </div>

      {/* Your folders Section (20–24px below Continue) */}
      <div className='flex flex-col gap-3 mt-5 sm:mt-6'>
        <div className='flex items-center justify-between w-full'>
          <h3 className='text-lg font-bold text-foreground tracking-tight'>
            Your folders
          </h3>
          <button
            onClick={() => {
              setCurrentSection('My Files')
              setActiveFolderId(null) // Go to files root folder
            }}
            className='text-xs font-bold text-[#6E60EE] hover:text-[#6E60EE]/80 transition-colors flex items-center gap-1 cursor-pointer focus:outline-none'
          >
            <span>View all</span>
          </button>
        </div>

        {/* Folders Cards Row/Grid (4 Columns, 16px gap, hover border changes to #6E60EE, shadow-sm specs) */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
          {folderCards.map(card => {
            const dropdownItems = [
              {
                label: 'View details',
                onClick: () => alert(`Viewing details for ${card.title}`),
                icon: <Folder className="w-4 h-4 text-text-secondary" />
              },
              {
                label: 'Copy link',
                onClick: () => {
                  setSelectedFileId(card.id);
                  setActiveModal('get-link');
                },
                icon: (
                  <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                )
              },
              {
                label: card.starred ? 'Unstar folder' : 'Star folder',
                onClick: () => toggleCardStar(card.id),
                icon: <Star className="w-4 h-4 text-text-secondary" />
              },
              {
                label: 'Delete',
                onClick: () => deleteCard(card.id),
                icon: (
                  <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                ),
                danger: true
              }
            ];

            return (
              <div
                key={card.id}
                onClick={() => {
                  setCurrentSection('My Files');
                  if (card.id === 'folder-design-assets') {
                    setActiveFolderId('folder-1');
                  } else {
                    setActiveFolderId(card.id);
                  }
                }}
                className='flex items-center justify-between p-4 bg-card-bg rounded-xl border border-card-border hover:border-[#6E60EE] shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 cursor-pointer group relative min-w-0'
              >
                <div className='flex items-center gap-3 min-w-0'>
                  <Folder className='w-9 h-9 text-[#6E60EE] shrink-0' />
                  <div className='flex flex-col min-w-0'>
                    <span className='text-sm font-bold text-foreground truncate group-hover:text-[#6E60EE] transition-colors duration-200'>
                      {card.title === 'Design Assets' ? 'Design' : card.title === 'Brand Photos' ? 'Photos' : card.title}
                    </span>
                    <span className='text-xs font-normal text-text-secondary truncate mt-0.5'>
                      {card.itemsCountText.split('•')[0].trim()}
                    </span>
                  </div>
                </div>
                <div className='shrink-0' onClick={e => e.stopPropagation()}>
                  <ActionMenu
                    placement='bottom-right'
                    items={dropdownItems}
                    onOpenChange={(isOpen) => setActiveCardMenuId(isOpen ? card.id : null)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recently Opened Section */}
      <div className='flex flex-col gap-3.5 w-full mt-1.5'>
        <div className='flex items-center justify-between select-none'>
          <h3 className='text-lg font-bold text-foreground tracking-tight'>
            Recently Opened
          </h3>

          {/* File View Mode Toggle Switcher */}
          <div className='flex items-center bg-divider border border-card-border p-0.5 rounded-lg shrink-0'>
            <Tooltip content="Grid view" side="top">
              <button
                onClick={() => setFileViewMode('grid')}
                className={cn(
                  'p-1 rounded-md cursor-pointer transition-all focus:outline-none',
                  fileViewMode === 'grid'
                    ? 'bg-card-border text-[#6E60EE]'
                    : 'text-text-secondary hover:text-foreground'
                )}
                aria-label='Grid view'
              >
                <LayoutGrid className='w-4 h-4' />
              </button>
            </Tooltip>
            <Tooltip content="List view" side="top">
              <button
                onClick={() => setFileViewMode('list')}
                className={cn(
                  'p-1 rounded-md cursor-pointer transition-all focus:outline-none',
                  fileViewMode === 'list'
                    ? 'bg-card-border text-[#6E60EE]'
                    : 'text-text-secondary hover:text-foreground'
                )}
                aria-label='List view'
              >
                <List className='w-4 h-4' />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Files Content List (White card layout with rows) */}
        {displayedFiles.length === 0 ? (
          <div className="w-full py-10 flex flex-col items-center justify-center text-center select-none bg-card-bg border border-card-border rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-6">
            <h4 className="text-xs font-bold text-text-secondary">
              No files found
            </h4>
            <p className="text-[11px] text-text-secondary mt-1 max-w-[200px] leading-normal font-light">
              This category does not have any items yet.
            </p>
          </div>
        ) : fileViewMode === 'grid' ? (
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
            {displayedFiles.map(file => {
              const fileDropdownItems = [
                {
                  label: 'View details',
                  onClick: () => alert(`Viewing details for ${file.name}`),
                  icon: <Folder className="w-4 h-4 text-text-secondary" />
                },
                {
                  label: file.starred ? 'Unstar file' : 'Star file',
                  onClick: () => toggleStar(file.id),
                  icon: <Star className="w-4 h-4 text-text-secondary" />
                },
                {
                  label: 'Delete',
                  onClick: () => deleteFile(file.id),
                  icon: (
                    <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  ),
                  danger: true
                }
              ];

              return (
                <div
                  key={file.id}
                  className='bg-card-bg rounded-xl border border-card-border hover:border-[#6E60EE] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-4 flex flex-col gap-3 group relative select-none cursor-pointer transition-all duration-200'
                >
                  {/* File icon preview container */}
                  <div className='w-full h-24 bg-input-bg rounded-lg flex items-center justify-center border border-card-border relative overflow-hidden shrink-0 group-hover:bg-[#6E60EE]/5 group-hover:border-[#6E60EE]/20 transition-all duration-200'>
                    {getFileIconGrid(file.type)}
                    {file.starred && (
                      <div className="absolute top-2 right-2 bg-card-bg rounded-md p-1 border border-card-border shadow-sm">
                        <Star className="w-3.5 h-3.5 text-[#6E60EE] fill-[#6E60EE]" />
                      </div>
                    )}
                  </div>

                  {/* File details footer row */}
                  <div className='flex items-center justify-between gap-2 w-full min-w-0'>
                    <div className='flex flex-col min-w-0 flex-1 text-left'>
                      <span className='text-sm font-bold text-foreground truncate group-hover:text-[#6E60EE] transition-colors duration-200'>
                        {file.name}
                      </span>
                      <span className='text-xs font-normal text-text-secondary truncate mt-0.5'>
                        {formatBytes(file.size)}
                      </span>
                    </div>
                    <div className='shrink-0' onClick={e => e.stopPropagation()}>
                      <ActionMenu
                        placement='bottom-right'
                        items={fileDropdownItems}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className='bg-card-bg border border-card-border rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden divide-y divide-divider'>
            {displayedFiles.map(file => {
              const fileDropdownItems = [
                {
                  label: 'View details',
                  onClick: () => alert(`Viewing details for ${file.name}`),
                  icon: <Folder className="w-4 h-4 text-text-secondary" />
                },
                {
                  label: file.starred ? 'Unstar file' : 'Star file',
                  onClick: () => toggleStar(file.id),
                  icon: <Star className="w-4 h-4 text-text-secondary" />
                },
                {
                  label: 'Delete',
                  onClick: () => deleteFile(file.id),
                  icon: (
                    <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  ),
                  danger: true
                }
              ];

              return (
                <div
                  key={file.id}
                  className='flex items-center justify-between p-4 hover:bg-divider/30 transition-colors duration-200 group cursor-pointer'
                >
                  <div className='flex items-center gap-3.5 min-w-0 flex-1'>
                    <div className='w-9 h-9 rounded-lg bg-input-bg border border-card-border flex items-center justify-center shrink-0 text-text-secondary group-hover:bg-[#6E60EE] group-hover:text-white group-hover:border-transparent transition-all duration-200'>
                      {getFileIcon(file.type)}
                    </div>
                    <div className='flex flex-col min-w-0'>
                      <span className='text-sm font-bold text-foreground truncate group-hover:text-[#6E60EE] transition-colors duration-200'>
                        {file.name}
                      </span>
                      <span className='text-[13px] font-normal text-text-secondary mt-0.5'>
                        {formatBytes(file.size)} &bull; {formatDate(file.updatedAt)}
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center gap-3.5 shrink-0' onClick={e => e.stopPropagation()}>
                    {file.starred && (
                      <Star className='w-4 h-4 text-[#6E60EE] fill-[#6E60EE]' />
                    )}
                    <ActionMenu
                      placement='bottom-right'
                      items={fileDropdownItems}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}
