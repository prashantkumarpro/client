'use client';

import React from 'react';
import { useApp } from '../../../providers/app-provider';

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useApp();

  return (
    <div className="relative w-full max-w-lg">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg
          className="h-4 w-4 text-slate-400"
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
        className="w-full bg-slate-50 dark:bg-zinc-900/50 hover:bg-slate-100/50 dark:hover:bg-zinc-900/80 text-foreground rounded-full pl-11 pr-20 py-3 text-xs font-semibold placeholder-text-muted transition-all duration-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 shadow-[inset_0_0_0_1px_var(--color-card-border)] hover:shadow-[inset_0_0_0_1px_#cbd5e1] dark:hover:shadow-[inset_0_0_0_1px_#3f3f46] focus:shadow-[inset_0_0_0_1px_#0056f7,0_0_0_4px_rgba(0,86,247,0.1)] focus:ring-0"
      />
      {searchQuery ? (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-foreground cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ) : (
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-zinc-800/60 px-1.5 py-0.5 rounded-md shadow-[inset_0_0_0_1px_rgba(226,232,240,0.4)] dark:shadow-[inset_0_0_0_1px_rgba(39,39,42,0.4)] select-none">
            <kbd className="text-[9px] font-sans font-bold text-slate-500 dark:text-zinc-400">⌘</kbd>
            <kbd className="text-[9px] font-sans font-bold text-slate-500 dark:text-zinc-400">K</kbd>
          </div>
        </div>
      )}
    </div>
  );
}
