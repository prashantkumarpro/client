'use client'

import React, { useState } from 'react'
import { useApp } from '../../../providers/app-provider'
import { useFiles } from '../hooks/use-files'
import { FilePreviewModal } from './file-preview-modal'
import { ActionMenu, ActionMenuItem } from '../../../components/ui/action-menu'
import { Tooltip } from '../../../components/ui/tooltip'
import { formatBytes, formatDate } from '../../../lib/utils/format'
import { FileType } from '../../../types'
import type { FileItem as BackendFileItem } from '../types'
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
  Users,
  Search,
  Inbox,
  ArrowRight
} from 'lucide-react'

export type UnifiedFileItem = {
  id?: string
  _id?: string
  name: string
  extension?: string
  type?: FileType
  size?: number
  parentFolderId?: string | null
  parentDirId?: string | null
  starred?: boolean
  deleted?: boolean
  createdAt?: string
  updatedAt?: string
  owner?: string
  sharedWith?: string[]
}

export interface FileListProps {
  files?: UnifiedFileItem[] | BackendFileItem[]
  title?: string
  limit?: number
  showViewAll?: boolean
  showHeader?: boolean
  showCardContainer?: boolean
  emptyMessage?: string
  emptySubtitle?: string
  onFileClick?: (file: UnifiedFileItem) => void
  onFolderClick?: (folderId: string) => void
}

function deriveFileType(file: UnifiedFileItem): FileType {
  if (file.type) return file.type
  const ext = (file.extension || file.name.split('.').pop() || '')
    .replace('.', '')
    .toLowerCase()
  if (ext === 'pdf') return 'pdf'
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) return 'image'
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'video'
  if (['doc', 'docx', 'txt', 'md', 'pptx', 'xlsx', 'csv'].includes(ext))
    return 'document'
  if (['js', 'ts', 'jsx', 'tsx', 'json', 'py', 'html', 'css'].includes(ext))
    return 'code'
  if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) return 'audio'
  return 'other'
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
    deleteFile: deleteMockFile,
    searchQuery,
    setSelectedFileId,
    setActiveModal
  } = useApp()

  const { download, rename, remove } = useFiles()
  const [previewFile, setPreviewFile] = useState<UnifiedFileItem | null>(null)

  // Filter files if customFiles is not explicitly passed
  const displayList = React.useMemo(() => {
    if (customFiles) {
      const list = customFiles as UnifiedFileItem[]
      return limit ? list.slice(0, limit) : list
    }

    let result = (globalFiles as UnifiedFileItem[]).filter(f => !f.deleted)

    if (searchQuery) {
      result = result.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      return limit ? result.slice(0, limit) : result
    }

    if (currentSection === 'Dashboard' || currentSection === 'Recent') {
      result = result.sort(
        (a, b) =>
          new Date(b.updatedAt || 0).getTime() -
          new Date(a.updatedAt || 0).getTime()
      )
    } else if (currentSection === 'My Files') {
      result = result.filter(
        f =>
          f.parentFolderId === activeFolderId ||
          f.parentDirId === activeFolderId
      )
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

  const getLocationName = (file: UnifiedFileItem) => {
    const parentId = file.parentFolderId || file.parentDirId
    if (parentId) {
      if (
        parentId === 'folder-1' ||
        parentId === 'folder-design-assets'
      )
        return 'Design Assets'
      if (parentId === 'folder-projects') return 'Projects'
      if (parentId === 'folder-documents') return 'Documents'
      if (parentId === 'folder-brand-photos') return 'Brand Photos'
      const parent = (globalFiles as UnifiedFileItem[]).find(
        f => (f.id || f._id) === parentId
      )
      if (parent) return parent.name
    }
    return 'My Files'
  }

  const handleOpenFile = (file: UnifiedFileItem) => {
    const fileType = deriveFileType(file)
    const fileId = file.id || file._id || ''

    if (fileType === 'folder') {
      if (onFolderClick) onFolderClick(fileId)
      else setActiveFolderId(fileId)
    } else {
      if (onFileClick) {
        onFileClick(file)
      } else {
        setPreviewFile(file)
      }
    }
  }

  const handleDownload = async (file: UnifiedFileItem) => {
    const fileId = file.id || file._id
    if (fileId) {
      try {
        await download(fileId, file.name)
      } catch (err) {
        console.error('Download error:', err)
      }
    }
  }

  const handleRename = async (file: UnifiedFileItem) => {
    const fileId = file.id || file._id
    const newName = prompt('Enter new filename:', file.name)
    if (fileId && newName && newName.trim() && newName.trim() !== file.name) {
      try {
        await rename(fileId, { newFilename: newName.trim() })
      } catch (err) {
        console.error('Rename error:', err)
      }
    }
  }

  const handleDelete = async (file: UnifiedFileItem) => {
    const fileId = file.id || file._id
    if (fileId) {
      try {
        await remove(fileId)
      } catch (err) {
        console.error('Delete error:', err)
      }
    }
  }

  const getDropdownItems = (file: UnifiedFileItem): ActionMenuItem[] => {
    const fileId = file.id || file._id || ''

    return [
      {
        label: 'Open',
        onClick: () => handleOpenFile(file),
        icon: <Eye className='w-4 h-4 text-text-secondary' />
      },
      {
        label: 'Download',
        onClick: () => handleDownload(file),
        icon: <Download className='w-4 h-4 text-text-secondary' />
      },
      {
        label: 'Share',
        onClick: () => {
          setSelectedFileId(fileId)
          setActiveModal('share')
        },
        icon: <Share2 className='w-4 h-4 text-text-secondary' />
      },
      {
        label: 'Rename',
        onClick: () => handleRename(file),
        icon: <Edit3 className='w-4 h-4 text-text-secondary' />
      },
      {
        label: 'Move',
        onClick: () => alert(`Move file "${file.name}"`),
        icon: <FolderInput className='w-4 h-4 text-text-secondary' />
      },
      {
        label: file.starred ? 'Unstar' : 'Star',
        onClick: () => toggleStar(fileId),
        icon: <Star className='w-4 h-4 text-text-secondary' />
      },
      {
        label: 'Delete',
        onClick: () => handleDelete(file),
        icon: <Trash2 className='w-4 h-4 text-rose-500' />,
        danger: true
      }
    ]
  }

  const defaultEmptyTitle =
    emptyMessage ||
    (searchQuery
      ? 'No results found'
      : currentSection === 'Shared'
      ? 'No files shared'
      : currentSection === 'Starred'
      ? 'No starred files'
      : 'No files found')

  const defaultEmptySubtitle =
    emptySubtitle ||
    (searchQuery
      ? `We couldn't find any matches for "${searchQuery}". Try checking your spelling.`
      : currentSection === 'Shared'
      ? 'Files shared with you will appear here.'
      : currentSection === 'Starred'
      ? 'Files and folders you star will appear here for quick access.'
      : 'Upload a file or folder to get started.')

  const isDashboardOrRecent =
    currentSection === 'Dashboard' || currentSection === 'Recent'

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
              className='text-xs font-semibold text-[#6E60EE] hover:text-[#6E60EE]/80 transition-colors flex items-center gap-1 cursor-pointer focus:outline-none group'
            >
              <span>View all</span>
              <ArrowRight className='w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5' />
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
          {/* Structured Column Header Row */}
          {showHeader && (
            <div className='flex items-center justify-between px-3 sm:px-4 py-2 text-[11px] font-semibold text-text-secondary/70 border-b border-card-border/80 select-none'>
              <div className='flex-1 min-w-0 pr-4'>
                <span>Name</span>
              </div>
              <div className='hidden md:block w-48 text-left pr-4'>
                <span>
                  {isDashboardOrRecent ? 'Reason suggested' : 'Last modified'}
                </span>
              </div>
              <div className='hidden lg:block w-36 text-left pr-4'>
                <span>Location</span>
              </div>
              <div className='hidden sm:block lg:hidden w-24 text-left pr-4'>
                <span>Size</span>
              </div>
              <div className='w-20 text-right pr-2'>
                <span>Actions</span>
              </div>
            </div>
          )}

          {/* Structured File Rows */}
          <div className='flex flex-col divide-y divide-card-border/50'>
            {displayList.map((file, idx) => {
              const fileId = file.id || file._id || `file-${idx}`
              const fileType = deriveFileType(file)
              const dropdownItems = getDropdownItems(file)
              const isShared =
                (file.sharedWith && file.sharedWith.length > 0) ||
                (file.owner && file.owner !== 'Prashant')
              const locationName = getLocationName(file)
              const displayDate = file.updatedAt || file.createdAt || new Date().toISOString()
              const displaySize = typeof file.size === 'number' && file.size > 0 ? formatBytes(file.size) : '—'

              return (
                <div
                  key={fileId}
                  onClick={() => handleOpenFile(file)}
                  className='flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-input-bg/70 active:bg-input-bg transition-colors duration-150 group cursor-pointer select-none min-w-0 rounded-lg sm:rounded-none'
                >
                  {/* Name Column: Icon + Filename + Shared icon */}
                  <div className='flex items-center gap-3 min-w-0 flex-1 pr-3'>
                    <div className='w-9 h-9 rounded-lg bg-input-bg border border-card-border flex items-center justify-center shrink-0 text-text-secondary group-hover:bg-[#6E60EE]/10 group-hover:text-[#6E60EE] group-hover:border-[#6E60EE]/30 transition-all duration-200'>
                      {getFileIcon(fileType)}
                    </div>
                    <div className='flex flex-col min-w-0 flex-1'>
                      <div className='flex items-center gap-1.5 min-w-0'>
                        <span
                          className='text-xs sm:text-sm font-semibold text-foreground group-hover:text-[#6E60EE] truncate transition-colors duration-150'
                          title={file.name}
                        >
                          {file.name}
                        </span>
                        {isShared && (
                          <Tooltip content='Shared file' side='top'>
                            <span className='shrink-0 text-text-muted/80 group-hover:text-text-secondary'>
                              <Users className='w-3.5 h-3.5' />
                            </span>
                          </Tooltip>
                        )}
                      </div>

                      {/* Mobile compact details subline */}
                      <div className='flex items-center gap-1.5 text-[11px] sm:hidden text-text-secondary mt-0.5 truncate'>
                        <span>{displaySize}</span>
                        <span>&bull;</span>
                        <span>
                          {isDashboardOrRecent
                            ? `Opened ${formatDate(displayDate)}`
                            : formatDate(displayDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reason suggested / Activity Column (Tablet & Desktop) */}
                  <div className='hidden md:block w-48 text-xs text-text-secondary truncate pr-4 text-left shrink-0'>
                    {isDashboardOrRecent
                      ? `You opened • ${formatDate(displayDate)}`
                      : formatDate(displayDate)}
                  </div>

                  {/* Location Column (Desktop) */}
                  <div className='hidden lg:flex items-center gap-1.5 w-36 text-xs text-text-secondary truncate pr-4 text-left shrink-0'>
                    <Folder className='w-3.5 h-3.5 text-text-muted shrink-0' />
                    <span className='truncate'>{locationName}</span>
                  </div>

                  {/* Size Column (Tablet only, when Location hidden) */}
                  <div className='hidden sm:block lg:hidden w-24 text-xs text-text-secondary truncate pr-4 text-left shrink-0'>
                    {displaySize}
                  </div>

                  {/* Star & Actions Column */}
                  <div
                    className='flex items-center justify-end gap-1 w-20 shrink-0'
                    onClick={e => e.stopPropagation()}
                  >
                    <Tooltip
                      content={file.starred ? 'Unstar' : 'Star'}
                      side='top'
                    >
                      <button
                        onClick={() => toggleStar(fileId)}
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

      {/* In-App File Preview Modal */}
      <FilePreviewModal
        isOpen={Boolean(previewFile)}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
      />
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
