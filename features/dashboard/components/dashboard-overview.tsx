'use client'

import React, { useState, useMemo } from 'react'
import { useApp } from '@/providers/app-provider'
import { cn } from '@/lib/utils/cn'
import { ActionMenu } from '@/components/ui/action-menu'
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
    if (hour < 12) return 'Good morning, Prashant'
    if (hour < 17) return 'Good afternoon, Prashant'
    return 'Good evening, Prashant'
  }

  // Helper to map file types to icons in mid gray color (grayscale)
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className='w-4 h-4 text-[#6B7280] shrink-0' />
      case 'image':
        return <ImageIcon className='w-4 h-4 text-[#6B7280] shrink-0' />
      case 'video':
        return <Video className='w-4 h-4 text-[#6B7280] shrink-0' />
      case 'document':
        return <FileText className='w-4 h-4 text-[#6B7280] shrink-0' />
      default:
        return <FileIcon className='w-4 h-4 text-[#6B7280] shrink-0' />
    }
  }

  // Helper to map file types to larger grid icons in mid gray color (grayscale)
  const getFileIconGrid = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className='w-7 h-7 text-[#6B7280] shrink-0' />
      case 'image':
        return <ImageIcon className='w-7 h-7 text-[#6B7280] shrink-0' />
      case 'video':
        return <Video className='w-7 h-7 text-[#6B7280] shrink-0' />
      case 'document':
        return <FileText className='w-7 h-7 text-[#6B7280] shrink-0' />
      default:
        return <FileIcon className='w-7 h-7 text-[#6B7280] shrink-0' />
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
    <div className='flex flex-col gap-6 w-full select-none'>
      {/* Title Header Greeting Area (Welcome Banner Card) */}
      <div className='flex flex-col gap-3.5 w-full select-none'>
        {/* Welcome Banner Card */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] py-3 px-5 min-h-[50px] select-none'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3.5 min-w-0'>
            <h2 className='text-base font-bold text-[#111827] shrink-0'>
              {getGreeting()}
            </h2>
            <span className='hidden sm:inline text-[#E5E7EB] font-light'>|</span>
            <p className='text-sm font-normal text-[#6B7280] truncate'>
              Everything you need, right where you left it.
            </p>
          </div>
        </div>

        {/* Action Buttons (Upload Files primary, New Folder outline) */}
        <div className='flex items-center gap-2 select-none'>
          <button
            onClick={() => setActiveModal('upload-file')}
            className='inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#2563EB] text-white rounded-lg text-xs font-bold hover:bg-[#2563EB]/90 transition-all duration-200 cursor-pointer focus:outline-none border border-transparent'
          >
            <svg className='w-3.5 h-3.5 shrink-0 text-white' fill='none' stroke='currentColor' strokeWidth={2.5} viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5' />
            </svg>
            <span>Upload Files</span>
          </button>
          <button
            onClick={() => setActiveModal('create-folder')}
            className='inline-flex items-center gap-1.5 px-3.5 py-2 bg-transparent text-[#111827] border border-[#E5E7EB] rounded-lg text-xs font-bold hover:bg-[#F3F4F6] transition-all duration-200 cursor-pointer focus:outline-none'
          >
            <svg className='w-3.5 h-3.5 shrink-0 text-[#6B7280]' fill='none' stroke='currentColor' strokeWidth={2.5} viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
            </svg>
            <span>New Folder</span>
          </button>
        </div>
      </div>

      {/* Continue where you left off Card (Entire card is clickable, border hover, shadow-sm specs) */}
      <div 
        onClick={() => {
          setCurrentSection('My Files')
          setActiveFolderId('folder-1') // Set folder to Design Assets
        }}
        className='bg-[#FFFFFF] border border-[#E5E7EB] hover:border-[#2563EB] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-4 flex flex-col gap-2.5 relative select-none transition-all duration-200 cursor-pointer focus:outline-none'
      >
        <span className='text-[10px] font-bold uppercase tracking-wider text-[#6B7280]'>
          Continue where you left off
        </span>
        <div className='flex items-center gap-2.5 min-w-0'>
          <Folder className='w-9 h-9 text-[#2563EB] shrink-0' />
          <span className='text-sm font-bold text-[#111827] truncate'>
            Design Assets
          </span>
        </div>
        <span className='text-xs font-normal text-[#6B7280]'>
          Last opened 12 min ago
        </span>
      </div>

      {/* Your folders Section */}
      <div className='flex flex-col gap-3 mt-1'>
        <div className='flex items-center justify-between w-full'>
          <h3 className='text-lg font-bold text-[#111827] tracking-tight'>
            Your folders
          </h3>
          <button
            onClick={() => {
              setCurrentSection('My Files')
              setActiveFolderId(null) // Go to files root folder
            }}
            className='text-xs font-bold text-[#2563EB] hover:text-[#2563EB]/80 transition-colors flex items-center gap-1 cursor-pointer focus:outline-none'
          >
            <span>View all</span>
          </button>
        </div>

        {/* Folders Cards Row/Grid (4 Columns, 16px gap, hover border changes to #2563EB, shadow-sm specs) */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
          {folderCards.map(card => {
            const dropdownItems = [
              {
                label: 'View details',
                onClick: () => alert(`Viewing details for ${card.title}`),
                icon: <Folder className="w-4 h-4 text-[#6B7280]" />
              },
              {
                label: 'Copy link',
                onClick: () => {
                  setSelectedFileId(card.id);
                  setActiveModal('get-link');
                },
                icon: (
                  <svg className="w-4 h-4 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                )
              },
              {
                label: card.starred ? 'Unstar folder' : 'Star folder',
                onClick: () => toggleCardStar(card.id),
                icon: <Star className="w-4 h-4 text-[#6B7280]" />
              },
              {
                label: 'Delete',
                onClick: () => deleteCard(card.id),
                icon: (
                  <svg className="w-4 h-4 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                className='flex items-center justify-between p-3.5 bg-[#FFFFFF] rounded-[12px] border border-[#E5E7EB] hover:border-[#2563EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all cursor-pointer group relative min-w-0'
              >
                <div className='flex items-center gap-2.5 min-w-0'>
                  <Folder className='w-9 h-9 text-[#2563EB] shrink-0' />
                  <div className='flex flex-col min-w-0'>
                    <span className='text-sm font-bold text-[#111827] truncate'>
                      {card.title === 'Design Assets' ? 'Design' : card.title === 'Brand Photos' ? 'Photos' : card.title}
                    </span>
                    <span className='text-xs font-normal text-[#6B7280] truncate mt-0.5'>
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
          <h3 className='text-lg font-bold text-[#111827] tracking-tight'>
            Recently Opened
          </h3>
          
          {/* File View Mode Toggle Switcher */}
          <div className='flex items-center bg-[#F3F4F6] border border-[#E5E7EB] p-0.5 rounded-lg shrink-0'>
            <button
              onClick={() => setFileViewMode('grid')}
              className={cn(
                'p-1 rounded-md cursor-pointer transition-all focus:outline-none',
                fileViewMode === 'grid'
                  ? 'bg-[#E5E7EB] text-[#2563EB]'
                  : 'text-[#6B7280] hover:text-[#111827]'
              )}
              aria-label='Grid View'
            >
              <LayoutGrid className='w-4 h-4' />
            </button>
            <button
              onClick={() => setFileViewMode('list')}
              className={cn(
                'p-1 rounded-md cursor-pointer transition-all focus:outline-none',
                fileViewMode === 'list'
                  ? 'bg-[#E5E7EB] text-[#2563EB]'
                  : 'text-[#6B7280] hover:text-[#111827]'
              )}
              aria-label='List View'
            >
              <List className='w-4 h-4' />
            </button>
          </div>
        </div>

        {/* Files Content List (White card layout with rows) */}
        {displayedFiles.length === 0 ? (
          <div className="w-full py-10 flex flex-col items-center justify-center text-center select-none bg-[#FFFFFF] border border-[#E5E7EB] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-6">
            <h4 className="text-xs font-bold text-[#6B7280]">
              No files found
            </h4>
            <p className="text-[11px] text-[#6B7280] mt-1 max-w-[200px] leading-normal font-light">
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
                  icon: <Folder className="w-4 h-4 text-[#6B7280]" />
                },
                {
                  label: file.starred ? 'Unstar file' : 'Star file',
                  onClick: () => toggleStar(file.id),
                  icon: <Star className="w-4 h-4 text-[#6B7280]" />
                },
                {
                  label: 'Delete',
                  onClick: () => deleteFile(file.id),
                  icon: (
                    <svg className="w-4 h-4 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  ),
                  danger: true
                }
              ];

              return (
                <div
                  key={file.id}
                  className='bg-[#FFFFFF] rounded-[12px] border border-[#E5E7EB] hover:border-[#2563EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-3 flex flex-col justify-between group relative h-36 select-none cursor-pointer transition-all duration-200'
                >
                  {/* File icon preview container */}
                  <div className='w-full h-18 bg-[#F3F4F6] rounded flex items-center justify-center border border-[#E5E7EB] relative overflow-hidden shrink-0'>
                    {getFileIconGrid(file.type)}
                    {file.starred && (
                      <div className="absolute top-1.5 right-1.5 bg-[#FFFFFF] rounded-md p-1 border border-[#E5E7EB]">
                        <Star className="w-3 h-3 text-[#2563EB] fill-[#2563EB]" />
                      </div>
                    )}
                  </div>

                  {/* File details footer row */}
                  <div className='flex items-center justify-between gap-1.5 w-full min-w-0 mt-2'>
                    <div className='flex flex-col min-w-0 flex-1 text-left'>
                      <span className='text-sm font-bold text-[#111827] truncate'>
                        {file.name}
                      </span>
                      <span className='text-xs font-normal text-[#6B7280] truncate mt-0.5'>
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
          <div className='flex flex-col w-full divide-y divide-[#E5E7EB] bg-[#FFFFFF] rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)] px-4 overflow-hidden'>
            {displayedFiles.map(file => {
              const fileDropdownItems = [
                {
                  label: 'View details',
                  onClick: () => alert(`Viewing details for ${file.name}`),
                  icon: <Folder className="w-4 h-4 text-[#6B7280]" />
                },
                {
                  label: file.starred ? 'Unstar file' : 'Star file',
                  onClick: () => toggleStar(file.id),
                  icon: <Star className="w-4 h-4 text-[#6B7280]" />
                },
                {
                  label: 'Delete',
                  onClick: () => deleteFile(file.id),
                  icon: (
                    <svg className="w-4 h-4 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  ),
                  danger: true
                }
              ];

              return (
                <div
                  key={file.id}
                  className='flex items-center justify-between py-3.5 hover:bg-[#F8FAFC] transition-colors group -mx-4 px-4 cursor-pointer'
                >
                  <div className='flex items-center gap-3 min-w-0 flex-1'>
                    <div className='w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center border border-[#E5E7EB] shrink-0'>
                      {getFileIcon(file.type)}
                    </div>
                    <div className='flex flex-col min-w-0'>
                      <span className='text-sm font-bold text-[#111827] truncate'>
                        {file.name}
                      </span>
                      <span className='text-[13px] font-normal text-[#6B7280] mt-0.5'>
                        {formatBytes(file.size)} &bull; {formatDate(file.updatedAt)}
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 shrink-0' onClick={e => e.stopPropagation()}>
                    {file.starred && (
                      <Star className='w-3.5 h-3.5 text-[#2563EB] fill-[#2563EB]' />
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
