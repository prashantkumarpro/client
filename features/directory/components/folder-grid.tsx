'use client';

import React from 'react';
import { useApp } from '../../../providers/app-provider';
import { Dropdown } from '../../../components/ui/dropdown';
import { Tooltip } from '../../../components/ui/tooltip';
import { FileItem } from '../../../types';

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
    <div className="flex flex-col gap-4 select-none">
      <h4 className="text-[10px] font-bold uppercase tracking-[1px] text-text-muted">
        Folders
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] xl:grid-cols-4 gap-3 sm:gap-4">
        {folders.map(folder => {
          const dropdownItems = [
            {
              label: folder.starred ? 'Unstar folder' : 'Star folder',
              onClick: () => toggleStar(folder.id),
              icon: (
                <svg className="w-4 h-4 text-text-muted" fill={folder.starred ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              ),
            },
            {
              label: 'Share',
              onClick: () => {
                setSelectedFileId(folder.id);
                setActiveModal('share');
              },
              icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l4.63-2.315a1.5 1.5 0 11.632.922L9.316 11.66c.03.167.044.338.044.51s-.014.343-.044.51l4.63 2.316a1.5 1.5 0 11-.632.921l-4.63-2.315a1.5 1.5 0 110-2.122z" />
                </svg>
              ),
            },
            {
              label: 'Delete folder',
              onClick: () => deleteFile(folder.id),
              icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              ),
              className: 'text-red-500 hover:bg-red-500/10',
            },
          ];

          return (
            <div
              key={folder.id}
              onDoubleClick={() => setActiveFolderId(folder.id)}
              className="bg-card-bg border border-card-border hover:border-[#6E60EE] rounded-xl p-4 flex items-center justify-between group transition-all duration-200 cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
            >
              {/* Folder Details */}
              <div 
                className="flex items-center gap-3 min-w-0 flex-1 mr-2"
                onClick={() => setActiveFolderId(folder.id)}
              >
                {/* Folder Icon Box */}
                <div className="w-9 h-9 shrink-0 flex items-center justify-center text-[#6E60EE] rounded-lg transition-colors relative">
                  <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  {folder.starred && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#6E60EE] rounded-full" title="Starred folder" />
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold line-clamp-2 break-words leading-snug text-foreground group-hover:text-[#6E60EE] transition-colors">
                    {folder.name}
                  </span>
                </div>
              </div>

              {/* Folder Actions Menu */}
              <div className="shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <Dropdown
                  align="right"
                  items={dropdownItems}
                  trigger={
                    <Tooltip content="Folder actions" side="top">
                      <button 
                        className="w-7 h-7 rounded-full flex items-center justify-center text-text-muted hover:text-foreground hover:bg-background border border-transparent hover:border-card-border transition-all focus:outline-none cursor-pointer"
                        aria-label="Folder actions"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 10a2 2 0 11-2 2 2 2 0 012-2zm0-6a2 2 0 11-2 2 2 2 0 012-2zm0 12a2 2 0 11-2 2 2 2 0 012-2z" />
                        </svg>
                      </button>
                    </Tooltip>
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
