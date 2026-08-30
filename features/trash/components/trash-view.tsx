'use client';

import React from 'react';
import { useApp } from '../../../providers/app-provider';
import { Dropdown } from '../../../components/ui/dropdown';
import { formatBytes, formatDate } from '../../../lib/utils/format';
import { FileItem } from '../../../types';

export function TrashView() {
  const { files, restoreFile, deletePermanently, searchQuery } = useApp();

  const deletedFiles = React.useMemo(() => {
    return files.filter(
      f =>
        f.deleted &&
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [files, searchQuery]);

  if (deletedFiles.length === 0) {
    return (
      <div className="bg-card-bg border border-card-border rounded-2xl p-12 text-center text-xs font-light text-text-muted select-none shadow-sm">
        Trash is empty.
      </div>
    );
  }

  return (
    <div className="bg-card-bg border border-card-border rounded-2xl p-6 text-foreground flex flex-col gap-4 shadow-sm transition-colors duration-200 flex-1 min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-divider pb-4 shrink-0 select-none">
        <h3 className="text-xs font-bold uppercase tracking-[1px] text-text-muted">
          Trash Bin
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-text-secondary">
          {deletedFiles.length} item(s)
        </span>
      </div>

      {/* Deleted Files Table */}
      <div className="overflow-y-auto overflow-x-auto flex-1 min-h-0 pr-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-divider text-[10px] font-bold uppercase tracking-[1px] text-text-muted">
              <th className="pb-3 font-bold">Name</th>
              <th className="pb-3 font-bold hidden md:table-cell">Deleted Date</th>
              <th className="pb-3 font-bold hidden sm:table-cell text-right pr-6">Size</th>
              <th className="pb-3 font-bold text-center w-12">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-divider/40">
            {deletedFiles.map(file => {
              const dropdownItems = [
                {
                  label: 'Restore',
                  onClick: () => restoreFile(file.id),
                  icon: (
                    <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 6.071L19 9" />
                    </svg>
                  ),
                },
                {
                  label: 'Delete Forever',
                  onClick: () => {
                    if (confirm(`Are you sure you want to permanently delete "${file.name}"? This action cannot be undone.`)) {
                      deletePermanently(file.id);
                    }
                  },
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  ),
                  className: 'text-red-500 hover:bg-red-500/10',
                },
              ];

              return (
                <tr key={file.id} className="hover:bg-divider/30 transition-colors group">
                  {/* Name */}
                  <td className="py-3.5 pr-4 flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-900 text-text-secondary border border-card-border shadow-sm">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-text-secondary group-hover:text-foreground truncate uppercase tracking-[0.5px]">
                        {file.name}
                      </span>
                      <span className="text-[10px] font-light text-text-muted truncate mt-0.5">
                        Originally: {file.type === 'folder' ? 'Folder' : file.type.toUpperCase()}
                      </span>
                    </div>
                  </td>

                  {/* Date modified (deletion timestamp) */}
                  <td className="py-3.5 text-xs font-light text-text-secondary hidden md:table-cell select-none">
                    {formatDate(file.updatedAt)}
                  </td>

                  {/* Size */}
                  <td className="py-3.5 text-xs font-bold text-foreground text-right pr-6 hidden sm:table-cell select-none">
                    {formatBytes(file.size)}
                  </td>

                  {/* Actions Menu */}
                  <td className="py-3.5 text-center">
                    <Dropdown
                      align="right"
                      items={dropdownItems}
                      trigger={
                        <button className="w-8 h-8 rounded-full inline-flex items-center justify-center text-text-muted hover:text-foreground hover:bg-divider border border-transparent hover:border-card-border transition-all focus:outline-none cursor-pointer">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 10a2 2 0 11-2 2 2 2 0 012-2zm0-6a2 2 0 11-2 2 2 2 0 012-2zm0 12a2 2 0 11-2 2 2 2 0 012-2z" />
                          </svg>
                        </button>
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
