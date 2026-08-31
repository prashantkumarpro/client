'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/providers/app-provider';
import { FileItem } from '@/types';
import { Search, X, Folder, FileText, FileImage, Video, File } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function SearchModal() {
  const { 
    activeModal, 
    setActiveModal, 
    files, 
    setActiveFolderId, 
    setCurrentSection 
  } = useApp();
  
  const [localQuery, setLocalQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isOpen = activeModal === 'search';

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, setActiveModal]);

  // Reset query and focus search input on open
  useEffect(() => {
    if (isOpen) {
      setLocalQuery('');
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter files based on search query
  const searchResults = localQuery.trim() === '' 
    ? [] 
    : files.filter(file => 
        !file.deleted && 
        file.name.toLowerCase().includes(localQuery.toLowerCase())
      );

  const handleResultClick = (file: FileItem) => {
    if (file.type === 'folder') {
      setActiveFolderId(file.id);
      setCurrentSection('My Files');
    } else {
      if (file.parentFolderId) {
        setActiveFolderId(file.parentFolderId);
      } else {
        setActiveFolderId(null);
      }
      setCurrentSection('My Files');
    }
    setActiveModal(null);
  };

  const getFileIcon = (type: string) => {
    const baseClass = "w-5 h-5 shrink-0";
    switch (type) {
      case 'folder':
        return <Folder className={cn(baseClass, "text-[#6E60EE]")} />;
      case 'pdf':
        return <FileText className={cn(baseClass, "text-red-500")} />;
      case 'document':
        return <FileText className={cn(baseClass, "text-blue-500")} />;
      case 'image':
        return <FileImage className={cn(baseClass, "text-emerald-500")} />;
      case 'video':
        return <Video className={cn(baseClass, "text-violet-500")} />;
      default:
        return <File className={cn(baseClass, "text-gray-500")} />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 dark:bg-black/85 backdrop-blur-xs flex flex-col items-center pt-[15vh] px-4 transition-opacity duration-300"
      onClick={() => setActiveModal(null)}
    >
      <div 
        className="w-full max-w-xl flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Search Pill Input Box (matching your circled reference image) */}
        <div className="flex items-center w-full bg-card-bg border border-card-border rounded-full px-5 py-3.5 gap-3.5 shadow-2xl focus-within:border-[#6E60EE] transition-all duration-200">
          <Search className="h-5 w-5 text-text-secondary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search workspace content..."
            className="flex-1 bg-transparent text-foreground text-sm font-semibold placeholder-text-muted focus:outline-none outline-none border-none ring-0 focus:ring-0 p-0"
          />
          <button
            onClick={() => setActiveModal(null)}
            className="text-text-muted hover:text-foreground cursor-pointer focus:outline-none shrink-0 transition-colors"
            aria-label="Close search"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Dropdown Results Box (attached directly under the search bar) */}
        {localQuery.trim() !== '' && (
          <div className="w-full bg-card-bg border border-card-border rounded-2xl shadow-2xl max-h-[300px] overflow-y-auto flex flex-col p-1.5 divide-y divide-divider z-50 transition-all duration-200">
            {searchResults.length === 0 ? (
              <div className="py-8 text-center text-text-muted text-xs font-normal">
                No matching results found
              </div>
            ) : (
              searchResults.map((file) => (
                <div
                  key={file.id}
                  onClick={() => handleResultClick(file)}
                  className="flex items-center justify-between px-3.5 py-3 hover:bg-divider/50 dark:hover:bg-[#15151F] transition-all duration-150 rounded-xl cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {getFileIcon(file.type)}
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-foreground truncate group-hover:text-[#6E60EE] transition-colors leading-snug">
                        {file.name}
                      </span>
                      <span className="text-[9px] text-text-muted truncate mt-0.5">
                        {file.type === 'folder' ? 'Folder Workspace' : `File  •  ${file.type.toUpperCase()}`}
                      </span>
                    </div>
                  </div>
                  <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-[#6E60EE] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
