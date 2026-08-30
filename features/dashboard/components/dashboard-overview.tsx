'use client'

import React, { useState } from 'react'
import { useApp } from '@/providers/app-provider'
import { cn } from '@/lib/utils/cn'
import { ActionMenu } from '@/components/ui/action-menu'
import WelcomeBanner from './welcome-banner'
import QuickActions from './quick-actions'

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
    itemsCountText: '24 items',
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
  }
];

export default function DashboardOverview () {
  const { setCurrentSection, setActiveModal, setSelectedFileId } = useApp()
  const [activeTab, setActiveTab] = useState<'Recent' | 'Starred' | 'Shared'>('Recent')
  const [folderCards, setFolderCards] = useState<FolderCardData[]>(INITIAL_FOLDER_CARDS)
  const [activeCardMenuId, setActiveCardMenuId] = useState<string | null>(null)

  // Filter folder cards based on active tab
  const filteredCards = folderCards.filter(card => {
    if (activeTab === 'Starred') return card.starred;
    if (activeTab === 'Shared') return card.shared;
    return true; // 'Recent' shows all
  });

  const toggleCardStar = (id: string) => {
    setFolderCards(prev =>
      prev.map(c => (c.id === id ? { ...c, starred: !c.starred } : c))
    )
  }

  const deleteCard = (id: string) => {
    setFolderCards(prev => prev.filter(c => c.id !== id))
  }

  // 3D glossy folder component
  const Folder3DPreview = () => (
    <div className="w-full h-full bg-gradient-to-br from-blue-50/80 to-indigo-50/70 dark:from-zinc-900/60 dark:to-zinc-800/60 flex items-center justify-center relative overflow-hidden select-none">
      {/* Floating back clouds */}
      <div className="absolute top-4 left-6 w-16 h-8 bg-white/70 dark:bg-zinc-700/20 rounded-full blur-sm" />
      <div className="absolute bottom-6 right-6 w-20 h-10 bg-white/60 dark:bg-zinc-700/10 rounded-full blur-md" />
      
      {/* 3D Tilted Folder */}
      <div className="relative transform hover:scale-105 transition-transform duration-300 drop-shadow-xl z-10 w-20 h-14">
        <svg viewBox="0 0 100 80" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="folderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f8aff" />
              <stop offset="100%" stopColor="#0056f7" />
            </linearGradient>
            <linearGradient id="folderBackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#004bd6" />
              <stop offset="100%" stopColor="#003db3" />
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
            </filter>
          </defs>
          
          {/* Folder Back Cover */}
          <path d="M5 10 A 5 5 0 0 1 10 5 H 35 L 43 15 H 90 A 5 5 0 0 1 95 20 V 70 A 5 5 0 0 1 90 75 H 10 A 5 5 0 0 1 5 70 Z" fill="url(#folderBackGrad)" />
          
          {/* Peaking papers */}
          <rect x="15" y="10" width="70" height="45" rx="3" fill="#ffffff" opacity="0.9" />
          <rect x="20" y="15" width="60" height="40" rx="3" fill="#e2ebff" />
          
          {/* Folder Front Cover */}
          <path d="M5 25 L 40 25 L 45 28 L 95 28 V 70 A 5 5 0 0 1 90 75 H 10 A 5 5 0 0 1 5 70 Z" fill="url(#folderGrad)" filter="url(#shadow)" />
        </svg>
      </div>
    </div>
  );

  return (
    <div className='flex flex-col gap-4 md:gap-5 w-full'>
      {/* Welcome Banner Banner */}
      <WelcomeBanner />

      {/* Quick Action Cards */}
      <QuickActions />

      {/* "Your Files" Section */}
      <div className='flex flex-col gap-3.5 mt-0'>
        <div className='flex items-center justify-between select-none'>
          <h3 className='text-xl font-bold text-slate-800 dark:text-white tracking-tight'>
            Your Files
          </h3>
          <button
            onClick={() => setCurrentSection('My Files')}
            className='text-sm font-bold text-[#0056f7] hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer focus:outline-none'
          >
            <span>View all files</span>
            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M14 5l7 7m0 0l-7 7m7-7H3' />
            </svg>
          </button>
        </div>

        {/* Tab Filters */}
        <div className='flex items-center gap-6 border-b border-slate-100 dark:border-zinc-800/80 pb-3 relative w-full'>
          <button
            onClick={() => setActiveTab('Recent')}
            className={cn(
              'flex items-center gap-2 text-sm font-semibold pb-3 -mb-[14px] transition-colors relative cursor-pointer focus:outline-none border-b-2',
              activeTab === 'Recent'
                ? 'text-[#0056f7] border-[#0056f7] dark:text-blue-400 dark:border-blue-400'
                : 'text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200 border-transparent'
            )}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Recent</span>
          </button>

          <button
            onClick={() => setActiveTab('Starred')}
            className={cn(
              'flex items-center gap-2 text-sm font-semibold pb-3 -mb-[14px] transition-colors relative cursor-pointer focus:outline-none border-b-2',
              activeTab === 'Starred'
                ? 'text-[#0056f7] border-[#0056f7] dark:text-blue-400 dark:border-blue-400'
                : 'text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200 border-transparent'
            )}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span>Starred</span>
          </button>

          <button
            onClick={() => setActiveTab('Shared')}
            className={cn(
              'flex items-center gap-2 text-sm font-semibold pb-3 -mb-[14px] transition-colors relative cursor-pointer focus:outline-none border-b-2',
              activeTab === 'Shared'
                ? 'text-[#0056f7] border-[#0056f7] dark:text-blue-400 dark:border-blue-400'
                : 'text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200 border-transparent'
            )}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Shared</span>
          </button>
        </div>

        {/* Folders Cards Grid */}
        {filteredCards.length === 0 ? (
          <div className="py-16 text-center text-sm font-light text-slate-400 select-none">
            No folders found in this section.
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-0'>
            {filteredCards.map(card => {
              const dropdownItems = [
                {
                  label: 'View details',
                  onClick: () => alert(`Viewing details for ${card.title}`),
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
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
                  icon: (
                    <svg className="w-4 h-4" fill={card.starred ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  )
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
                  label: 'Manage access',
                  onClick: () => alert(`Access settings for ${card.title}`),
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )
                },
                {
                  label: 'Rename',
                  onClick: () => alert(`Rename ${card.title}`),
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  )
                },
                {
                  label: 'Move',
                  onClick: () => alert(`Move ${card.title}`),
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  )
                },
                {
                  label: 'Download',
                  onClick: () => alert(`Downloading folder ${card.title}`),
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
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
                  className={cn(
                    'bg-card-bg border border-card-border rounded-2xl flex flex-col relative group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 shadow-sm',
                    activeCardMenuId === card.id ? 'z-35' : 'z-10 hover:z-20'
                  )}
                >
                  {/* Top Preview Frame */}
                  <div className='h-24 w-full relative overflow-hidden rounded-t-2xl bg-slate-50 dark:bg-zinc-900 border-b border-card-border flex items-center justify-center shrink-0'>
                    {card.previewType === '3d-folder' ? (
                      <Folder3DPreview />
                    ) : (
                      <img
                        src={card.previewImage}
                        alt={card.title}
                        className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 select-none'
                        loading='lazy'
                      />
                    )}

                    {/* Star badge overlay */}
                    {card.starred && (
                      <div className='absolute top-3 left-3 bg-white/95 dark:bg-zinc-800/90 w-7 h-7 rounded-full flex items-center justify-center shadow-sm select-none border border-slate-100 dark:border-zinc-700/40 z-10'>
                        <svg className='w-4 h-4 text-amber-400' fill='currentColor' viewBox='0 0 24 24'>
                          <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Reusable Three-dots Action Menu */}
                  <div className='absolute top-3 right-3 z-25'>
                    <ActionMenu
                      items={dropdownItems}
                      onOpenChange={(isOpen) => setActiveCardMenuId(isOpen ? card.id : null)}
                    />
                  </div>

                  {/* Bottom Text and details */}
                  <div className='p-3 flex items-center justify-between gap-2 min-w-0 bg-card-bg rounded-b-2xl'>
                    <div className='flex items-center gap-2.5 min-w-0'>
                      <svg className='w-4.5 h-4.5 text-[#0056f7] shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' />
                      </svg>
                      <div className='flex flex-col min-w-0'>
                        <span className='text-xs font-bold text-slate-800 dark:text-slate-200 truncate select-all'>
                          {card.title}
                        </span>
                        <span className='text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5 select-none'>
                          {card.itemsCountText}
                        </span>
                      </div>
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
