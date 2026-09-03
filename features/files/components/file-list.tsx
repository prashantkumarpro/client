'use client'

import React from 'react'
import { useApp } from '../../../providers/app-provider'
import { ActionMenu, ActionMenuItem } from '../../../components/ui/action-menu'
import { Tooltip } from '../../../components/ui/tooltip'
import { formatBytes, formatDate } from '../../../lib/utils/format'
import { FileItem, FileType } from '../../../types'
import { cn } from '../../../lib/utils/cn'
import {
  Folder,
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  Music,
  Code,
  File,
  Eye,
  Download,
  Share2,
  Edit3,
  FolderInput,
  Star,
  Trash2,
  Search,
  Inbox
} from 'lucide-react'

export interface FileListProps {
  files?: FileItem[]
  title?: string
  limit?: number
  showViewAll?: boolean
  showHeader?: boolean
  showCardContainer?: boolean
  emptyMessage?: string
  emptySubtitle?: string
  onFileClick?: (file: FileItem) => void
  onFolderClick?: (folderId: string) => void
}

export function FileList({
  files: customFiles,
  title,
  limit,
  showViewAll,
  showHeader = true,
  showCardContainer = false,
  emptyMessage,
  emptySubtitle,
  onFileClick,
  onFolderClick
}: FileListProps) {
  const {
    files: globalFiles,
    currentSection,
    setCurrentSection,
    activeFolderId,
    setActiveFolderId,
    toggleStar,
    deleteFile,
    searchQuery,
    setSelectedFileId,
    setActiveModal
  } = useApp()

  // Filter files if customFiles is not explicitly passed
  const displayList = React.useMemo(() => {
    if (customFiles) {
      return limit ? customFiles.slice(0, limit) : customFiles
    }

    let result = globalFiles.filter(f => !f.deleted)

    if (searchQuery) {
      result = result.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      return limit ? result.slice(0, limit) : result
    }

    if (currentSection === 'Dashboard' || currentSection === 'Recent') {
      result = result.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    } else if (currentSection === 'My Files') {
      result = result.filter(f => f.parentFolderId === activeFolderId)
    } else if (currentSection === 'Starred') {
      result = result.filter(f => f.starred)
    } else if (currentSection === 'Shared') {
      result = result.filter(
        f => f.owner !== 'Prashant' || (f.sharedWith && f.sharedWith.length > 0)
      )
    }

    if (limit) {
      result = result.slice(0, limit)
    }

    return result
  }, [customFiles, globalFiles, currentSection, activeFolderId, searchQuery, limit])

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'pdf':
        return <FileText className='w-4 h-4 text-rose-500' />
      case 'image':
        return <ImageIcon className='w-4 h-4 text-emerald-500' />
      case 'video':
        return <VideoIcon className='w-4 h-4 text-purple-500' />
      case 'folder':
        return <Folder className='w-4 h-4 text-[#6E60EE]' />
      case 'document':
        return <FileText className='w-4 h-4 text-[#6E60EE]' />
      case 'audio':
        return <Music className='w-4 h-4 text-amber-500' />
      case 'code':
        return <Code className='w-4 h-4 text-cyan-500' />
      default:
        return <File className='w-4 h-4 text-text-secondary' />
    }
  }

  const getDropdownItems = (file: FileItem): ActionMenuItem[] => [
    {
      label: 'Open',
      onClick: () => {
        if (file.type === 'folder') {
          if (onFolderClick) onFolderClick(file.id)
          else setActiveFolderId(file.id)
        } else {
          if (onFileClick) onFileClick(file)
          else alert(`Opening ${file.name}`)
        }
      },
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

  const defaultEmptyTitle =
    emptyMessage ||
    (searchQuery
      ? 'No results found'
      : currentSection === 'Shared'
      ? 'No files shared'
      : currentSection === 'Starred'
      ? 'No starred files'
      : 'No files or folders found')

  const defaultEmptySubtitle =
    emptySubtitle ||
    (searchQuery
      ? `We couldn't find any matches for "${searchQuery}". Try checking your spelling.`
      : currentSection === 'Shared'
      ? 'Files shared with you will appear here.'
      : currentSection === 'Starred'
      ? 'Files and folders you star will appear here for quick access.'
      : 'This section does not have any items yet.')

  const content = (
    <div className='w-full flex flex-col'>
      {/* Optional Section Title / Header Row if title passed */}
      {title && (
        <div className='flex items-center justify-between pb-3 select-none'>
          <h3 className='text-sm sm:text-base font-bold text-foreground tracking-tight'>
            {title}
          </h3>
          {showViewAll && currentSection === 'Dashboard' && (
            <button
              onClick={() => setCurrentSection('My Files')}
              className='text-xs font-semibold text-[#6E60EE] hover:text-[#6E60EE]/80 transition-colors cursor-pointer'
            >
              View all
            </button>
          )}
        </div>
      )}

      {/* Empty State */}
      {displayList.length === 0 ? (
        <div className='w-full py-12 flex flex-col items-center justify-center text-center select-none bg-card-bg border border-dashed border-card-border p-6 rounded-xl'>
          <div className='w-10 h-10 rounded-full bg-input-bg flex items-center justify-center text-text-muted mb-2.5'>
            {searchQuery ? (
              <Search className='w-5 h-5' />
            ) : (
              <Inbox className='w-5 h-5' />
            )}
          </div>
          <h4 className='text-xs sm:text-sm font-bold text-foreground'>
            {defaultEmptyTitle}
          </h4>
          <p className='text-xs text-text-secondary mt-1 max-w-[260px] leading-normal font-normal'>
            {defaultEmptySubtitle}
          </p>
        </div>
      ) : (
        <div className='w-full flex flex-col select-none'>
          {/* Structured Column Header */}
          {showHeader && (
            <div className='flex items-center justify-between px-3 py-2 text-[11px] font-semibold text-text-secondary/70 border-b border-card-border/80 select-none'>
              <div className='flex-1 min-w-0 pr-4'>
                <span>Name</span>
              </div>
              <div className='hidden md:block w-36 text-left pr-4'>
                <span>Last modified</span>
              </div>
              <div className='hidden sm:block w-24 text-left pr-4'>
                <span>Size</span>
              </div>
              <div className='w-20 text-right pr-2'>
                <span>Actions</span>
              </div>
            </div>
          )}

          {/* List Rows */}
          <div className='flex flex-col divide-y divide-card-border/50'>
            {displayList.map(file => {
              const isFolder = file.type === 'folder'
              const dropdownItems = getDropdownItems(file)

              return (
                <div
                  key={file.id}
                  onClick={() => {
                    if (isFolder) {
                      if (onFolderClick) onFolderClick(file.id)
                      else setActiveFolderId(file.id)
                    } else {
                      if (onFileClick) onFileClick(file)
                      else alert(`Opening ${file.name}`)
                    }
                  }}
                  className='flex items-center justify-between px-3 py-2.5 sm:py-3 hover:bg-input-bg/60 active:bg-input-bg transition-colors duration-150 group cursor-pointer select-none min-w-0 rounded-lg sm:rounded-none'
                >
                  {/* Name Column */}
                  <div className='flex items-center gap-3 min-w-0 flex-1 pr-3'>
                    <div className='w-9 h-9 rounded-lg bg-input-bg border border-card-border flex items-center justify-center shrink-0 text-text-secondary group-hover:bg-[#6E60EE]/10 group-hover:text-[#6E60EE] group-hover:border-[#6E60EE]/30 transition-all duration-200'>
                      {getFileIcon(file.type)}
                    </div>
                    <div className='flex flex-col min-w-0 flex-1'>
                      <span
                        className='text-xs sm:text-sm font-semibold text-foreground group-hover:text-[#6E60EE] truncate transition-colors duration-150'
                        title={file.name}
                      >
                        {file.name}
                      </span>
                      {/* Mobile compact details subline */}
                      <div className='flex items-center gap-1.5 text-[11px] sm:hidden text-text-secondary mt-0.5 truncate'>
                        <span>{formatBytes(file.size)}</span>
                        <span>&bull;</span>
                        <span>{formatDate(file.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Date Column (Tablet/Desktop) */}
                  <div className='hidden md:block w-36 text-xs text-text-secondary truncate pr-4 text-left shrink-0'>
                    {formatDate(file.updatedAt)}
                  </div>

                  {/* Size Column (Tablet/Desktop) */}
                  <div className='hidden sm:block w-24 text-xs text-text-secondary truncate pr-4 text-left shrink-0'>
                    {formatBytes(file.size)}
                  </div>

                  {/* Star & Actions Column */}
                  <div
                    className='flex items-center justify-end gap-1.5 w-20 shrink-0'
                    onClick={e => e.stopPropagation()}
                  >
                    <Tooltip content={file.starred ? 'Unstar' : 'Star'} side='top'>
                      <button
                        onClick={() => toggleStar(file.id)}
                        className={cn(
                          'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none hover:bg-input-bg active:scale-90',
                          file.starred
                            ? 'text-[#6E60EE] opacity-100'
                            : 'text-text-muted opacity-0 group-hover:opacity-100 sm:opacity-0 hover:text-[#6E60EE]'
                        )}
                        aria-label={file.starred ? 'Unstar file' : 'Star file'}
                      >
                        <Star
                          className={cn(
                            'w-4 h-4 transition-transform',
                            file.starred
                              ? 'fill-[#6E60EE] text-[#6E60EE]'
                              : 'text-text-muted'
                          )}
                        />
                      </button>
                    </Tooltip>

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
    </div>
  )

  if (showCardContainer) {
    return (
      <div className='bg-card-bg border border-card-border rounded-xl p-4 sm:p-5 text-foreground shadow-xs transition-colors duration-200 flex-1 min-h-0'>
        {content}
      </div>
    )
  }

  return content
}
