'use client';

import React from 'react';
import { useApp } from '../../../providers/app-provider';

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useApp();

  return (
    <div className="relative w-full max-w-lg">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-4 h-4 text-[#7e7e7e]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search files, folders, images..."
        className="w-full bg-slate-50 dark:bg-zinc-900/50 hover:bg-slate-100/50 dark:hover:bg-zinc-900/80 text-foreground border border-slate-100 dark:border-zinc-800/40 hover:border-slate-200 dark:hover:border-zinc-700/50 rounded-xl pl-10 pr-12 py-2.5 text-xs font-normal placeholder-text-muted transition-all duration-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:shadow-sm"
      />
      {searchQuery ? (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-foreground cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ) : (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <kbd className="text-[10px] text-text-muted bg-white dark:bg-zinc-800 border border-slate-200/50 dark:border-zinc-700 px-1.5 py-0.5 rounded-md font-mono select-none shadow-sm">
            ⌘ K
          </kbd>
        </div>
      )}
    </div>
  );
}
