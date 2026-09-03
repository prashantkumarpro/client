'use client'

import React, { useRef, useCallback } from 'react'
import { useApp } from '@/providers/app-provider'
import { FolderPlus, FileUp, FolderUp, LucideIcon } from 'lucide-react'
import { FileType } from '@/types'

function getFileTypeFromName(name: string): FileType {
  const ext = name.split('.').pop()?.toLowerCase() || ''
  if (ext === 'pdf') return 'pdf'
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) return 'image'
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'video'
  if (['doc', 'docx', 'txt', 'md', 'pptx', 'xlsx'].includes(ext)) return 'document'
  return 'other'
}

export interface PlusActionItem {
  id: 'create-folder' | 'upload-file' | 'upload-folder'
  label: string
  icon: LucideIcon
  onClick: () => void
}

export function usePlusActions(onActionExecuted?: () => void) {
  const { setActiveModal, uploadFile, createFolder, activeFolderId } = useApp()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  const handleNewFolder = useCallback(() => {
    setActiveModal('create-folder')
    onActionExecuted?.()
  }, [setActiveModal, onActionExecuted])

  const handleUploadFiles = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    } else {
      setActiveModal('upload-file')
    }
    onActionExecuted?.()
  }, [setActiveModal, onActionExecuted])

  const handleUploadFolder = useCallback(() => {
    if (folderInputRef.current) {
      folderInputRef.current.value = ''
      folderInputRef.current.click()
    } else {
      setActiveModal('upload-folder')
    }
    onActionExecuted?.()
  }, [setActiveModal, onActionExecuted])

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files
      if (!selectedFiles || selectedFiles.length === 0) return

      Array.from(selectedFiles).forEach(file => {
        const type = getFileTypeFromName(file.name)
        uploadFile(file.name, file.size, type, activeFolderId)
      })
    },
    [uploadFile, activeFolderId]
  )

  const handleFolderInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files
      if (!selectedFiles || selectedFiles.length === 0) return

      // Derive root folder name from the first file's webkitRelativePath
      const firstFile = selectedFiles[0]
      const relativePath = (firstFile as unknown as { webkitRelativePath?: string })
        .webkitRelativePath || ''
      const folderName = relativePath ? relativePath.split('/')[0] : 'New Folder'

      const newFolderId = createFolder(folderName, activeFolderId)

      Array.from(selectedFiles).forEach(file => {
        const type = getFileTypeFromName(file.name)
        uploadFile(file.name, file.size, type, newFolderId)
      })
    },
    [createFolder, uploadFile, activeFolderId]
  )

  const actions: PlusActionItem[] = [
    {
      id: 'create-folder',
      label: 'New folder',
      icon: FolderPlus,
      onClick: handleNewFolder,
    },
    {
      id: 'upload-file',
      label: 'Upload files',
      icon: FileUp,
      onClick: handleUploadFiles,
    },
    {
      id: 'upload-folder',
      label: 'Upload folder',
      icon: FolderUp,
      onClick: handleUploadFolder,
    },
  ]

  const hiddenInputs = (
    <React.Fragment key='plus-hidden-inputs'>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileInputChange}
        multiple
        className='hidden'
        aria-hidden='true'
      />
      <input
        type='file'
        ref={folderInputRef}
        onChange={handleFolderInputChange}
        // @ts-expect-error webkitdirectory is standard in browser engines
        webkitdirectory=''
        directory=''
        multiple
        className='hidden'
        aria-hidden='true'
      />
    </React.Fragment>
  )

  return {
    actions,
    hiddenInputs,
    handleNewFolder,
    handleUploadFiles,
    handleUploadFolder,
  }
}
