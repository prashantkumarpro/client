'use client';

import React from 'react';
import { useApp } from '@/providers/app-provider';
import { Tooltip } from '@/components/ui/tooltip';
import { Dropdown } from '@/components/ui/dropdown';
import { Folder, Search } from 'lucide-react';

export function SearchBar() {
  const { toggleSidebar, isSidebarCollapsed, setActiveModal } = useApp();

  const uploadDropdownItems = [
    {
      label: 'New folder',
      onClick: () => setActiveModal('create-folder'),
      className: 'py-3 px-4 text-sm font-semibold border-b bg-card-bg hover:bg-input-bg text-foreground border-card-border',
      icon: (
        <div className='w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-input-bg text-[#6E60EE] border border-card-border'>
          <Folder className="w-5 h-5" />
        </div>
      )
    },
    {
      label: 'File upload',
      onClick: () => setActiveModal('upload-file'),
      className: 'py-3 px-4 text-sm font-semibold border-b bg-card-bg hover:bg-input-bg text-foreground border-card-border',
      icon: (
        <div className='w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-input-bg text-text-secondary border border-card-border'>
          <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 19V5m0 0l-7 7m7-7l7 7' />
          </svg>
        </div>
      )
    },
    {
      label: 'Folder upload',
      onClick: () => setActiveModal('upload-folder'),
      className: 'py-3 px-4 text-sm font-semibold bg-card-bg hover:bg-input-bg text-foreground',
      icon: (
        <div className='w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-input-bg text-text-secondary border border-card-border'>
          <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 19V5m0 0l-7 7m7-7l7 7' />
          </svg>
        </div>
      )
    }
  ];

  return (
    <div className="flex items-center bg-input-bg border border-card-border rounded-full p-1 gap-2 shadow-none transition-all duration-300 w-fit select-none shrink-0">
      {/* 1. Sidebar Toggle Button */}
      <Tooltip content={isSidebarCollapsed ? 'open sidebar' : 'close sidebar'} side='bottom'>
        <button
          onClick={toggleSidebar}
          className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-divider/60 transition-all duration-200 cursor-pointer focus:outline-none shrink-0"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 3v18" />
          </svg>
        </button>
      </Tooltip>

      {/* 2. Search Open Button (triggers search popup) */}
      <Tooltip content="Search files" side="bottom">
        <button
          onClick={() => setActiveModal('search')}
          className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-divider/60 transition-all duration-200 cursor-pointer focus:outline-none shrink-0"
          aria-label="Open search popup modal"
        >
          <Search className="w-4.5 h-4.5" />
        </button>
      </Tooltip>

      {/* 3. New File/Folder Dropdown */}
      <Tooltip content="New File/Folder" side="bottom">
        <div>
          <Dropdown
            align="left"
            items={uploadDropdownItems}
            trigger={
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-divider/60 transition-all duration-200 cursor-pointer focus:outline-none shrink-0"
                aria-label="New folder or file upload options menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8" />
                </svg>
              </button>
            }
          />
        </div>
      </Tooltip>
    </div>
  );
}
