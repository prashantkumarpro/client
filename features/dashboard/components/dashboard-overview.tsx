'use client'

import React, { useState } from 'react'
import { useApp } from '@/providers/app-provider'
import { cn } from '@/lib/utils/cn'
import { ActionMenu } from '@/components/ui/action-menu'
import WelcomeBanner from './welcome-banner'
import QuickActions from './quick-actions'
import { Clock, Star, Folder, Image as ImageIcon, LayoutGrid, List, ChevronRight, Users } from 'lucide-react'

interface FolderCardData {
  id: string;
  title: string;
  itemsCountText: string;
  starred: boolean;
  shared: boolean;
  previewType: '3d-folder' | 'image';
  previewImage?: string;
}

const INITIAL_FOLDER_CARDS: FolderCardData[] = [
  {
    id: 'folder-projects',
    title: 'Projects',
    itemsCountText: '24 files  •  120 MB',
    starred: false,
    shared: false,
    previewType: '3d-folder'
  },
  {
    id: 'folder-design-assets',
    title: 'Design Assets',
    itemsCountText: '128 files  •  2.4 GB',
    starred: true,
    shared: false,
    previewType: 'image',
    previewImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'folder-brand-photos',
    title: 'Brand Photos',
    itemsCountText: '86 files  •  1.1 GB',
    starred: false,
    shared: false,
    previewType: 'image',
    previewImage: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'folder-ui-components',
    title: 'UI Components',
    itemsCountText: '64 files  •  320 MB',
    starred: true,
    shared: true,
    previewType: 'image',
    previewImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'folder-marketing',
    title: 'Marketing Campaigns',
    itemsCountText: '42 files  •  1.8 GB',
    starred: true,
    shared: true,
    previewType: 'image',
    previewImage: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'folder-legal',
    title: 'Contracts & Legal',
    itemsCountText: '18 files  •  120 MB',
    starred: false,
    shared: true,
    previewType: '3d-folder'
  }
];

export default function DashboardOverview () {
  const { setCurrentSection, setActiveModal, setSelectedFileId, setActiveFolderId } = useApp()
  const [activeTab, setActiveTab] = useState<'Recent' | 'Starred' | 'Shared'>('Recent')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid') // Default grid view
  const [folderCards, setFolderCards] = useState<FolderCardData[]>(INITIAL_FOLDER_CARDS)
  const [activeCardMenuId, setActiveCardMenuId] = useState<string | null>(null)

  // Filter folder cards based on active tab
  const filteredCards = folderCards.filter(card => {
    if (activeTab === 'Starred') return card.starred;
    if (activeTab === 'Shared') return card.shared;
    return true; // 'Recent' shows all
  });

  const ITEMS_LIMIT = 4;
  const hasMoreItems = filteredCards.length > ITEMS_LIMIT;
  const displayedCards = filteredCards.slice(0, ITEMS_LIMIT);

  const toggleCardStar = (id: string) => {
    setFolderCards(prev =>
      prev.map(c => (c.id === id ? { ...c, starred: !c.starred } : c))
    )
  }

  const deleteCard = (id: string) => {
    setFolderCards(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className='flex flex-col gap-3.5 md:gap-4 w-full'>
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Quick Action Toolbar Row */}
      <QuickActions />

      {/* "Your Files" Section */}
      <div className='flex flex-col gap-3.5 mt-1'>
        <div className='flex items-center justify-between select-none'>
          <div className='flex items-center gap-3.5'>
            <h3 className='text-xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
              Your Files
            </h3>
            {hasMoreItems && (
              <button
                onClick={() => setCurrentSection('My Files')}
                className='text-xs font-bold text-[#0056f7] dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer focus:outline-none'
              >
                <span>View all files &rarr;</span>
              </button>
            )}
          </div>
          
          {/* View Mode Toggle Switcher */}
          <div className='flex items-center bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-0.5 rounded-lg shrink-0'>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1 rounded-md cursor-pointer transition-all focus:outline-none',
                viewMode === 'grid'
                  ? 'bg-slate-200/80 dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-350'
              )}
              aria-label='Grid View'
            >
              <LayoutGrid className='w-4 h-4' />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1 rounded-md cursor-pointer transition-all focus:outline-none',
                viewMode === 'list'
                  ? 'bg-slate-200/80 dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-350'
              )}
              aria-label='List View'
            >
              <List className='w-4 h-4' />
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className='flex items-center gap-1.5 border-b border-slate-100 dark:border-zinc-800/80 pb-3 select-none w-full'>
          <button
            onClick={() => setActiveTab('Recent')}
            className={cn(
              'flex items-center gap-2 text-xs font-bold tracking-[0.5px] px-3.5 py-1.5 rounded-md transition-all cursor-pointer focus:outline-none',
              activeTab === 'Recent'
                ? 'bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-zinc-450 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-900/30'
            )}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Recent</span>
          </button>

          <button
            onClick={() => setActiveTab('Starred')}
            className={cn(
              'flex items-center gap-2 text-xs font-bold tracking-[0.5px] px-3.5 py-1.5 rounded-md transition-all cursor-pointer focus:outline-none',
              activeTab === 'Starred'
                ? 'bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-zinc-450 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-900/30'
            )}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Starred</span>
          </button>

          <button
            onClick={() => setActiveTab('Shared')}
            className={cn(
              'flex items-center gap-2 text-xs font-bold tracking-[0.5px] px-3.5 py-1.5 rounded-md transition-all cursor-pointer focus:outline-none',
              activeTab === 'Shared'
                ? 'bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-zinc-450 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-900/30'
            )}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Shared with me</span>
          </button>
        </div>

        {/* Dynamic Items Content Layout */}
        {displayedCards.length === 0 ? (
          <div className="w-full py-12 flex flex-col items-center justify-center text-center select-none bg-slate-50/50 dark:bg-zinc-900/30 border border-dashed border-card-border p-8 rounded-lg">
            <svg className="w-10 h-10 text-slate-350 dark:text-zinc-650 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.241h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.241h3.86m-18 0h18" />
            </svg>
            <h4 className="text-xs font-bold text-text-secondary">
              {activeTab === 'Shared' ? 'No files shared' : activeTab === 'Starred' ? 'No starred folders' : 'No folders found'}
            </h4>
            <p className="text-[11px] text-text-muted mt-1 max-w-[200px] leading-normal font-light">
              {activeTab === 'Shared' ? 'No files shared with you yet.' : activeTab === 'Starred' ? 'Folders you star will appear here.' : 'This category does not have any items yet.'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          /* ========================================================
             1. GRID VIEW DESIGN (Neat & Clean Centered Cards)
             ======================================================== */
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-0'>
            {displayedCards.map(card => {
              const dropdownItems = [
                {
                  label: 'View details',
                  onClick: () => alert(`Viewing details for ${card.title}`),
                  icon: <Folder className="w-4 h-4" />
                },
                {
                  label: 'Copy link',
                  onClick: () => {
                    setSelectedFileId(card.id);
                    setActiveModal('get-link');
                  },
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  )
                },
                {
                  label: card.starred ? 'Unstar folder' : 'Star folder',
                  onClick: () => toggleCardStar(card.id),
                  icon: <Star className="w-4 h-4" />
                },
                {
                  label: 'Share',
                  onClick: () => {
                    setSelectedFileId(card.id);
                    setActiveModal('share');
                  },
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )
                },
                {
                  label: 'Delete',
                  onClick: () => deleteCard(card.id),
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  ),
                  danger: true
                }
              ];

              return (
                <div
                  key={card.id}
                  onClick={() => {
                    setCurrentSection('My Files');
                    if (card.id === 'folder-design-assets') {
                      setActiveFolderId('folder-1');
                    } else {
                      setActiveFolderId(card.id);
                    }
                  }}
                  className={cn(
                    'bg-white dark:bg-zinc-950 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,86,247,0.08)] transition-all duration-300 flex flex-col group select-none cursor-pointer h-48 border border-slate-100/50 dark:border-zinc-900/30 relative',
                    activeCardMenuId === card.id ? 'z-35' : 'z-10 hover:z-20'
                  )}
                >
                  {/* Card top: preview area */}
                  <div className='relative w-full h-[120px] bg-slate-50 dark:bg-zinc-900/30 flex items-center justify-center overflow-hidden shrink-0 rounded-t-lg'>
                    {card.previewType === 'image' && card.previewImage ? (
                      <img src={card.previewImage} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <Folder className='w-14 h-14 text-[#0056f7] dark:text-blue-400 fill-[#0056f7]/5 dark:fill-blue-400/5' />
                    )}
                    
                    {/* Corner folder context badge for images */}
                    {card.previewType === 'image' && (
                      <div className="absolute top-2.5 left-2.5 bg-white/95 dark:bg-zinc-900/90 rounded-md p-1.5 shadow-sm border border-slate-100 dark:border-zinc-800">
                        <Folder className="w-3.5 h-3.5 text-[#0056f7] dark:text-blue-400" />
                      </div>
                    )}
                  </div>

                  {/* Card bottom: metadata info and menu */}
                  <div className="p-3 flex items-center justify-between gap-2 flex-1 w-full bg-white dark:bg-zinc-950 border-t border-slate-50 dark:border-zinc-900/40 rounded-b-lg">
                    <div className="flex flex-col min-w-0 text-left flex-1">
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {card.title}
                      </span>
                      <span className="text-[10px] font-normal text-slate-400 dark:text-zinc-500 truncate mt-0.5">
                        {card.itemsCountText.replace(/\s+/g, ' ').replace(/\s•\s/g, ' • ')}
                      </span>
                    </div>
                    <div className="shrink-0" onClick={e => e.stopPropagation()}>
                      <ActionMenu
                        items={dropdownItems}
                        onOpenChange={(isOpen) => setActiveCardMenuId(isOpen ? card.id : null)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ========================================================
             2. LIST VIEW DESIGN (Google Drive Style Minimal Rows)
             ======================================================== */
          <div className='flex flex-col w-full select-none divide-y divide-slate-100 dark:divide-zinc-900/60 border-t border-b border-slate-100 dark:border-zinc-900/60'>
            {displayedCards.map(card => {
              const dropdownItems = [
                {
                  label: 'View details',
                  onClick: () => alert(`Viewing details for ${card.title}`),
                  icon: <Folder className="w-4 h-4" />
                },
                {
                  label: 'Copy link',
                  onClick: () => {
                    setSelectedFileId(card.id);
                    setActiveModal('get-link');
                  },
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  )
                },
                {
                  label: card.starred ? 'Unstar folder' : 'Star folder',
                  onClick: () => toggleCardStar(card.id),
                  icon: <Star className="w-4 h-4" />
                },
                {
                  label: 'Share',
                  onClick: () => {
                    setSelectedFileId(card.id);
                    setActiveModal('share');
                  },
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )
                },
                {
                  label: 'Delete',
                  onClick: () => deleteCard(card.id),
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  ),
                  danger: true
                }
              ];

              return (
                <div
                  key={card.id}
                  onClick={() => {
                    setCurrentSection('My Files');
                    if (card.id === 'folder-design-assets') {
                      setActiveFolderId('folder-1');
                    } else {
                      setActiveFolderId(card.id);
                    }
                  }}
                  className='flex items-center justify-between py-3.5 hover:bg-slate-50/50 dark:hover:bg-zinc-900/10 transition-colors cursor-pointer group px-1'
                >
                  {/* Left: Folder Icon (or small preview thumbnail) + Bold Folder Name */}
                  <div className='flex items-center gap-3 min-w-0'>
                    {card.previewType === 'image' && card.previewImage ? (
                      <div className="w-5 h-5 rounded overflow-hidden shrink-0 border border-slate-200 dark:border-zinc-800 relative">
                        <img src={card.previewImage} alt={card.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <Folder className='w-5 h-5 fill-slate-100 dark:fill-zinc-900 text-slate-455 dark:text-zinc-500 shrink-0' />
                    )}
                    <span className='text-sm font-bold text-slate-900 dark:text-white truncate'>
                      {card.title}
                    </span>
                  </div>

                  {/* Right: Metadata + Hover Action Menu */}
                  <div className='flex items-center gap-4 shrink-0'>
                    <span className='text-[11px] font-normal text-slate-400 dark:text-zinc-500'>
                      {card.itemsCountText.replace(/\s+/g, ' ').replace(/\s•\s/g, ' • ')}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className='opacity-0 group-hover:opacity-100 transition-opacity' onClick={e => e.stopPropagation()}>
                      <ActionMenu
                        items={dropdownItems}
                        onOpenChange={(isOpen) => setActiveCardMenuId(isOpen ? card.id : null)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}
