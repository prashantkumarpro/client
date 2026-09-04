'use client'

import React, { useMemo } from 'react'
import { useApp } from '@/providers/app-provider'
import { FolderCard } from './folder-card'
import { useDirectory } from '../hooks/use-directory'
import type { DirectoryItem, RenameDirectoryData } from '../types'

interface FolderGridProps {
  folders?: DirectoryItem[]
  isLoading?: boolean
  onRename?: (id: string, data: RenameDirectoryData) => Promise<void>
  onDelete?: (id: string) => Promise<void>
}

export function FolderGrid ({
  folders: propFolders,
  isLoading: propIsLoading,
  onRename: propOnRename,
  onDelete: propOnDelete
}: FolderGridProps) {
  const {
    activeFolderId,
    setActiveFolderId,
    searchQuery,
    setSelectedFileId,
    setActiveModal
  } = useApp()

  const hookResult = useDirectory(activeFolderId ?? undefined)

  const folders = useMemo(() => {
    const list = propFolders ?? hookResult.directory?.directories ?? []
    if (!searchQuery) return list
    return list.filter(f =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [propFolders, hookResult.directory?.directories, searchQuery])

  const isLoading = propIsLoading ?? hookResult.isLoading

  const handleRename = async (folderId: string, currentTitle: string) => {
    const newName = prompt('Enter new folder name:', currentTitle)
    if (newName && newName.trim() && newName.trim() !== currentTitle) {
      if (propOnRename) {
        await propOnRename(folderId, { newDirName: newName.trim() })
      } else {
        await hookResult.rename(folderId, { newDirName: newName.trim() })
      }
    }
  }

  const handleDelete = async (folderId: string) => {
    if (propOnDelete) {
      await propOnDelete(folderId)
    } else {
      await hookResult.remove(folderId)
    }
  }

  if (isLoading) {
    return (
      <div className='flex flex-col gap-3 select-none'>
        <h4 className='text-[10px] font-bold uppercase tracking-[1px] text-text-muted'>
          Folders
        </h4>
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
      </div>
    )
  }

  if (folders.length === 0) return null

  return (
    <div className='flex flex-col gap-3 select-none'>
      <h4 className='text-[10px] font-bold uppercase tracking-[1px] text-text-muted'>
        Folders
      </h4>
      <div className='grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] xl:grid-cols-4 gap-3 sm:gap-4'>
        {folders.map(folder => {
          return (
            <FolderCard
              key={folder.id}
              id={folder.id}
              name={folder.name}
              itemsCountText='0 files'
              starred={false}
              onClick={() => setActiveFolderId(folder.id)}
              onRename={() => handleRename(folder.id, folder.name)}
              onShare={() => {
                setSelectedFileId(folder.id)
                setActiveModal('share')
              }}
              onToggleStar={() =>
                alert(`Starring folder "${folder.name}" coming soon`)
              }
              onDelete={() => handleDelete(folder.id)}
            />
          )
        })}
      </div>
    </div>
  )
}
