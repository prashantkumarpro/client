'use client';

import React from 'react';
import { useApp } from '../../../providers/app-provider';
import { ActionMenu } from '../../../components/ui/action-menu';
import { formatBytes, formatDate } from '../../../lib/utils/format';
import { FileItem, FileType } from '../../../types';
import { cn } from '../../../lib/utils/cn';

interface FileListProps {
  title?: string;
  limit?: number;
  showViewAll?: boolean;
}

export function FileList({ title, limit, showViewAll }: FileListProps) {
  const {
    files,
    currentSection,
    setCurrentSection,
    activeFolderId,
    setActiveFolderId,
    toggleStar,
    deleteFile,
    searchQuery,
    setSelectedFileId,
    setActiveModal,
  } = useApp();

  // Filter files based on section & search query
  const filteredFiles = React.useMemo(() => {
    let result = files.filter(f => !f.deleted);

    if (searchQuery) {
      result = result.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return result;
    }

    if (currentSection === 'Dashboard') {
      result = result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else if (currentSection === 'My Files') {
      result = result.filter(f => f.parentFolderId === activeFolderId);
    } else if (currentSection === 'Starred') {
      result = result.filter(f => f.starred);
    } else if (currentSection === 'Shared') {
      result = result.filter(f => f.owner !== 'Prashant' || f.sharedWith?.length);
    } else if (currentSection === 'Recent') {
      result = result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }

    if (limit) {
      result = result.slice(0, limit);
    }

    return result;
  }, [files, currentSection, activeFolderId, searchQuery, limit]);

  const getFileIcon = (type: FileType, starred: boolean) => {
    const baseClass = "w-9 h-9 shrink-0 flex items-center justify-center rounded-xl relative border border-card-border shadow-sm";
    
    switch (type) {
      case 'pdf':
        return (
          <div className={cn(baseClass, "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400")}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {starred && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full" />}
          </div>
        );
      case 'image':
        return (
          <div className={cn(baseClass, "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400")}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a1 1 0 011.414 0L16 17m0 0l1-1m-1 1k-3-3m-3 3h12m7-9a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {starred && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full" />}
          </div>
        );
      case 'video':
        return (
          <div className={cn(baseClass, "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400")}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {starred && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full" />}
          </div>
        );
      case 'folder':
        return (
          <div className={cn(baseClass, "bg-blue-50 dark:bg-blue-950/20 text-[#0056f7] dark:text-blue-400")}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            {starred && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full" />}
          </div>
        );
      case 'document':
        return (
          <div className={cn(baseClass, "bg-blue-50 dark:bg-blue-950/20 text-[#0056f7] dark:text-blue-400")}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v12m0 0l-4-4m4 4l4-4" />
            </svg>
            {starred && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full" />}
          </div>
        );
      default:
        return (
          <div className={cn(baseClass, "bg-gray-50 dark:bg-gray-900 text-gray-500")}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {starred && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full" />}
          </div>
        );
    }
  };

  const getSubpath = (file: FileItem) => {
    if (file.parentFolderId) {
      const parent = files.find(f => f.id === file.parentFolderId);
      if (parent) {
        return `My Files / ${parent.name}`;
      }
    }
    
    switch (file.type) {
      case 'pdf':
      case 'document':
        return 'My Files / Documents';
      case 'image':
        return 'My Files / Images';
      case 'video':
        return 'My Files / Videos';
      case 'folder':
        return 'My Files / Folders';
      default:
        return 'My Files';
    }
  };

  const defaultTitle = currentSection === 'Dashboard' ? 'Recent Files' : currentSection;

  return (
    <div className="bg-card-bg border border-card-border rounded-2xl p-6 text-foreground flex flex-col gap-4 shadow-sm transition-colors duration-200 flex-1 min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-divider pb-4 shrink-0 select-none">
        <h3 className="text-xs font-bold uppercase tracking-[1px] text-text-muted">
          {title || defaultTitle}
        </h3>
        {showViewAll && currentSection === 'Dashboard' && (
          <button
            onClick={() => setCurrentSection('My Files')}
            className="text-[11px] font-bold text-[#0056f7] hover:text-[#004bd6] transition-colors cursor-pointer"
          >
            View all
          </button>
        )}
      </div>

      {/* Files List Table */}
      {filteredFiles.length === 0 ? (
        <div className="py-12 text-center text-xs font-light text-text-muted select-none">
          No files or folders found here.
        </div>
      ) : (
        <div className="overflow-y-auto overflow-x-auto flex-1 min-h-0 pr-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-divider text-[10px] font-bold uppercase tracking-[1px] text-text-muted">
                <th className="pb-3 font-bold">Name</th>
                <th className="pb-3 font-bold hidden md:table-cell">Date Modified</th>
                <th className="pb-3 font-bold hidden sm:table-cell text-right pr-6">Size</th>
                <th className="pb-3 font-bold text-center w-12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider/40">
              {filteredFiles.map(file => {
                const isFolder = file.type === 'folder';

                const dropdownItems = [
                  {
                    label: file.starred ? 'Unstar' : 'Star',
                    onClick: () => toggleStar(file.id),
                    icon: (
                      <svg className="w-4 h-4 text-text-muted" fill={file.starred ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Share',
                    onClick: () => {
                      setSelectedFileId(file.id);
                      setActiveModal('share');
                    },
                    icon: (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l4.63-2.315a1.5 1.5 0 11.632.922L9.316 11.66c.03.167.044.338.044.51s-.014.343-.044.51l4.63 2.316a1.5 1.5 0 11-.632.921l-4.63-2.315a1.5 1.5 0 110-2.122z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Get Link',
                    onClick: () => {
                      setSelectedFileId(file.id);
                      setActiveModal('get-link');
                    },
                    icon: (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Delete',
                    onClick: () => deleteFile(file.id),
                    icon: (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    ),
                    className: 'text-red-500 hover:bg-red-500/10',
                  },
                ];

                return (
                  <tr
                    key={file.id}
                    className="hover:bg-divider/30 transition-colors group cursor-pointer"
                    onDoubleClick={() => {
                      if (isFolder) setActiveFolderId(file.id);
                    }}
                  >
                    {/* Name */}
                    <td className="py-3.5 pr-4 flex items-center gap-3 min-w-0">
                      {getFileIcon(file.type, file.starred)}
                      <div className="flex flex-col min-w-0">
                        <span 
                          onClick={() => {
                            if (isFolder) setActiveFolderId(file.id);
                          }}
                          className="text-xs font-semibold text-text-secondary group-hover:text-foreground truncate uppercase tracking-[0.5px]"
                        >
                          {file.name}
                        </span>
                        <span className="text-[10px] font-light text-text-muted truncate mt-0.5">
                          {getSubpath(file)}
                        </span>
                      </div>
                    </td>

                    {/* Date modified */}
                    <td className="py-3.5 text-xs font-light text-text-secondary hidden md:table-cell select-none">
                      {formatDate(file.updatedAt)}
                    </td>

                    {/* Size */}
                    <td className="py-3.5 text-xs font-bold text-foreground text-right pr-6 hidden sm:table-cell select-none">
                      {formatBytes(file.size)}
                    </td>

                    {/* Actions Menu */}
                    <td className="py-3.5 text-center">
                      <ActionMenu
                        align="right"
                        items={dropdownItems.map(item => ({
                          label: item.label,
                          onClick: item.onClick,
                          icon: item.icon,
                          danger: item.label === 'Delete'
                        }))}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
