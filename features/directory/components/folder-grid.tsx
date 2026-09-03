'use client';

import React from 'react';
import { useApp } from '../../../providers/app-provider';
import { FolderCard } from './folder-card';

export function FolderGrid() {
  const {
    files,
    activeFolderId,
    setActiveFolderId,
    toggleStar,
    deleteFile,
    searchQuery,
    setSelectedFileId,
    setActiveModal,
  } = useApp();

  const folders = files.filter(
    f =>
      f.type === 'folder' &&
      !f.deleted &&
      f.parentFolderId === activeFolderId &&
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (folders.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 select-none">
      <h4 className="text-[10px] font-bold uppercase tracking-[1px] text-text-muted">
        Folders
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] xl:grid-cols-4 gap-3 sm:gap-4">
        {folders.map(folder => {
          const itemCount = files.filter(
            f => !f.deleted && f.parentFolderId === folder.id
          ).length;
          const itemsCountText = `${itemCount} ${itemCount === 1 ? 'file' : 'files'}`;

          return (
            <FolderCard
              key={folder.id}
              id={folder.id}
              name={folder.name}
              itemsCountText={itemsCountText}
              starred={folder.starred}
              onClick={() => setActiveFolderId(folder.id)}
              onRename={() => {
                const newName = prompt('Enter new folder name:', folder.name);
                if (newName && newName.trim()) {
                  alert(`Renamed "${folder.name}" to "${newName.trim()}"`);
                }
              }}
              onShare={() => {
                setSelectedFileId(folder.id);
                setActiveModal('share');
              }}
              onToggleStar={() => toggleStar(folder.id)}
              onDelete={() => deleteFile(folder.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
