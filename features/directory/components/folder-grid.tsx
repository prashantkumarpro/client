'use client'

import React, { useMemo, useState } from 'react'
import { useApp } from '@/providers/app-provider'
import { FolderCard } from './folder-card'
import { useDirectory } from '../hooks/use-directory'
import { RenameModal } from '@/features/files/components/rename-modal'
import { DeleteConfirmModal } from '@/features/files/components/delete-confirm-modal'
import { MoveModal } from '@/features/files/components/move-modal'
import { FileDetailsModal } from '@/features/files/components/file-details-modal'
import type { DirectoryItem, RenameDirectoryData } from '../types'
import type { UnifiedFileItem } from '@/features/files/components/file-list'

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
    setActiveModal,
    toggleStar,
    moveFile
  } = useApp()

  const hookResult = useDirectory(activeFolderId ?? undefined)

  const [renameTarget, setRenameTarget] = useState<DirectoryItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<DirectoryItem | null>(null)
  const [moveTarget, setMoveTarget] = useState<DirectoryItem | null>(null)
  const [detailsTarget, setDetailsTarget] = useState<DirectoryItem | null>(null)

  const folders = useMemo(() => {
    const list = propFolders ?? hookResult.directory?.directories ?? []
    if (!searchQuery) return list
    return list.filter(f =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [propFolders, hookResult.directory?.directories, searchQuery])

  const isLoading = propIsLoading ?? hookResult.isLoading

  const handlePerformRename = async (newName: string) => {
    if (!renameTarget) return
    if (propOnRename) {
      await propOnRename(renameTarget.id, { newDirName: newName })
    } else {
      await hookResult.rename(renameTarget.id, { newDirName: newName })
    }
    setRenameTarget(null)
  }

  const handlePerformDelete = async () => {
    if (!deleteTarget) return
    if (propOnDelete) {
      await propOnDelete(deleteTarget.id)
    } else {
      await hookResult.remove(deleteTarget.id)
    }
    setDeleteTarget(null)
  }

  const handlePerformMove = async (targetFolderId: string | null) => {
    if (!moveTarget) return
    moveFile(moveTarget.id, targetFolderId)
    setMoveTarget(null)
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
              onDetails={() => setDetailsTarget(folder)}
              onRename={() => setRenameTarget(folder)}
              onShare={() => {
                setSelectedFileId(folder.id)
                setActiveModal('share')
              }}
              onMove={() => setMoveTarget(folder)}
              onToggleStar={() => toggleStar(folder.id)}
              onDelete={() => setDeleteTarget(folder)}
            />
          )
        })}
      </div>

      {/* Custom Rename Modal for Folders */}
      <RenameModal
        isOpen={Boolean(renameTarget)}
        onClose={() => setRenameTarget(null)}
        initialName={renameTarget?.name || ''}
        itemType="folder"
        onRename={handlePerformRename}
      />

      {/* Custom Delete Confirmation Modal for Folders */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        itemName={deleteTarget?.name || ''}
        itemType="folder"
        onConfirm={handlePerformDelete}
      />

      {/* Custom Move Modal for Folders */}
      <MoveModal
        isOpen={Boolean(moveTarget)}
        onClose={() => setMoveTarget(null)}
        itemName={moveTarget?.name || ''}
        itemId={moveTarget?.id}
        itemType="folder"
        currentFolderId={activeFolderId}
        onMove={handlePerformMove}
      />

      {/* Custom Details Modal for Folders */}
      <FileDetailsModal
        isOpen={Boolean(detailsTarget)}
        onClose={() => setDetailsTarget(null)}
        file={detailsTarget ? {
          id: detailsTarget.id,
          name: detailsTarget.name,
          type: 'folder',
          createdAt: detailsTarget.createdAt,
          updatedAt: detailsTarget.updatedAt,
          parentFolderId: activeFolderId
        } as UnifiedFileItem : null}
      />
    </div>
  )
}
