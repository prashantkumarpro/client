'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '@/providers/app-provider';
import { FileItem } from '@/types';
import { FilePreview } from '@/features/files/components/file-preview';
import { FilePreviewModal } from '@/features/files/components/file-preview-modal';
import { UnifiedFileItem } from '@/features/files/components/file-list';
import { formatBytes, formatDate } from '@/lib/utils/format';
import { Search, X, Folder, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// Helper to highlight matching text in query
function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="text-[#6E60EE] font-bold underline decoration-[#6E60EE]/30">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

export function SearchModal() {
  const {
    activeModal,
    setActiveModal,
    files,
    setActiveFolderId,
    setCurrentSection
  } = useApp();

  const [localQuery, setLocalQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previewFile, setPreviewFile] = useState<UnifiedFileItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isOpen = activeModal === 'search';
  const hasQuery = localQuery.trim().length > 0;

  // Filter files strictly based on search query when typing
  const searchResults = useMemo(() => {
    const query = localQuery.trim().toLowerCase();
    if (!query) return [];

    const activeFiles = files.filter(f => !f.deleted);
    return activeFiles.filter(file => {
      const nameMatch = file.name.toLowerCase().includes(query);
      const ownerMatch = file.owner?.toLowerCase().includes(query);
      const typeMatch = file.type?.toLowerCase().includes(query);
      return nameMatch || ownerMatch || typeMatch;
    });
  }, [files, localQuery]);

  // Reset query and focus input on open
  useEffect(() => {
    if (isOpen) {
      setLocalQuery('');
      setSelectedIndex(0);
      setPreviewFile(null);
      const timer = setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [localQuery]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current && searchResults.length > 0) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex, searchResults.length]);

  // Handle keyboard navigation (ArrowUp, ArrowDown, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (searchResults.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : searchResults.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = searchResults[selectedIndex];
        if (selected) {
          handleResultClick(selected);
        }
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, searchResults, selectedIndex]);

  const getLocationName = (file: FileItem) => {
    if (!file.parentFolderId) return 'My Files';
    const parent = files.find(f => f.id === file.parentFolderId);
    return parent ? `My Files / ${parent.name}` : 'My Files';
  };

  const handleResultClick = (file: FileItem) => {
    if (file.type === 'folder') {
      setActiveFolderId(file.id);
      setCurrentSection('My Files');
      setActiveModal(null);
    } else {
      // Open in-app preview for instant access
      setPreviewFile(file as UnifiedFileItem);
    }
  };

  const handleGoToLocation = (file: FileItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (file.type === 'folder') {
      setActiveFolderId(file.id);
    } else {
      setActiveFolderId(file.parentFolderId || null);
    }
    setCurrentSection('My Files');
    setActiveModal(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 dark:bg-black/75 backdrop-blur-xs flex flex-col items-center pt-[10vh] sm:pt-[14vh] px-4 select-none animate-in fade-in duration-200"
        onClick={() => setActiveModal(null)}
      >
        {/* Main Floating Integrated Card */}
        <div
          className="w-full max-w-xl bg-card-bg border border-card-border rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col text-foreground animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Search Input Bar */}
          <div className="flex items-center w-full px-4 sm:px-5 h-14 gap-3 bg-card-bg">
            <Search className="h-5 w-5 text-[#6E60EE] shrink-0" strokeWidth={2.2} />
            <input
              ref={inputRef}
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search files, folders, and documents..."
              className="flex-1 bg-transparent text-foreground text-sm sm:text-base font-semibold placeholder:text-text-muted focus:outline-none outline-none border-none ring-0 focus:ring-0 p-0"
              autoComplete="off"
            />
            {/* Close Button X */}
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-input-bg transition-colors cursor-pointer shrink-0"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results Area — ONLY displayed when user types a query */}
          {hasQuery && (
            <div className="border-t border-card-border/60 flex flex-col">
              {searchResults.length === 0 ? (
                /* Clean No Results State */
                <div className="py-12 flex flex-col items-center justify-center text-center select-none px-4">
                  <div className="w-10 h-10 rounded-full bg-input-bg flex items-center justify-center text-text-muted mb-2.5">
                    <Search className="w-5 h-5 text-text-muted" strokeWidth={2} />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">
                    No results found
                  </h4>
                  <p className="text-xs text-text-secondary mt-1 max-w-[280px] leading-normal font-normal">
                    No files or folders matched &ldquo;{localQuery}&rdquo;. Check spelling or try a different term.
                  </p>
                </div>
              ) : (
                /* Matching Results List */
                <div
                  ref={listRef}
                  className="w-full max-h-[360px] overflow-y-auto flex flex-col divide-y divide-card-border/40 p-1.5"
                >
                  {searchResults.map((file, idx) => {
                    const isSelected = idx === selectedIndex;
                    const isFolder = file.type === 'folder';
                    const locationPath = getLocationName(file);
                    const displayDate = formatDate(file.updatedAt || file.createdAt);
                    const displaySize = !isFolder && typeof file.size === 'number' && file.size > 0
                      ? formatBytes(file.size)
                      : null;

                    const snippetMetadata = isFolder
                      ? `Folder • in ${locationPath}`
                      : `${file.type.toUpperCase()}${displaySize ? ` • ${displaySize}` : ''} • in ${locationPath}`;

                    return (
                      <div
                        key={file.id}
                        onClick={() => handleResultClick(file)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={cn(
                          "flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 group relative select-none",
                          isSelected
                            ? "bg-[#6E60EE]/10 border border-[#6E60EE]/30 text-foreground"
                            : "hover:bg-input-bg/60 border border-transparent text-foreground"
                        )}
                      >
                        {/* Left: Icon / Thumbnail Preview */}
                        <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-3">
                          {isFolder ? (
                            <div className="w-9 h-9 rounded-xl bg-[#6E60EE]/10 flex items-center justify-center text-[#6E60EE] shrink-0">
                              <Folder className="w-4.5 h-4.5" />
                            </div>
                          ) : (
                            <FilePreview file={file as UnifiedFileItem} variant="compact" />
                          )}

                          {/* Middle: Title + Metadata Snippet */}
                          <div className="flex flex-col min-w-0 flex-1 justify-center">
                            <span className="text-xs sm:text-sm font-semibold text-foreground truncate group-hover:text-[#6E60EE] transition-colors leading-snug">
                              {highlightMatch(file.name, localQuery)}
                            </span>
                            <span className="text-[11px] text-text-secondary truncate mt-0.5">
                              {snippetMetadata}
                            </span>
                          </div>
                        </div>

                        {/* Right: Date Modified + Jump Action */}
                        <div className="flex items-center gap-2.5 shrink-0 text-right">
                          <span className="text-xs text-text-secondary font-medium">
                            {displayDate}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleGoToLocation(file, e)}
                            title="Go to location"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-[#6E60EE] hover:bg-[#6E60EE]/10 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* In-App File Preview Modal when opened from Search */}
      {previewFile && (
        <FilePreviewModal
          isOpen={Boolean(previewFile)}
          onClose={() => setPreviewFile(null)}
          file={previewFile}
          files={searchResults.filter(f => f.type !== 'folder') as UnifiedFileItem[]}
          onNavigate={(f) => setPreviewFile(f as UnifiedFileItem)}
        />
      )}
    </>
  );
}
