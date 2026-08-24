'use client'

import { useApp } from '@/providers/app-provider'
import { StorageOverview } from '@/features/storage/components/storage-overview'
import { FileList } from '@/features/files/components/file-list'
import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/utils/format'

export default function DashboardOverview () {
  const {
    setCurrentSection,
    activities,
    setActiveModal,
    setSelectedFileId,
    files
  } = useApp()

  const handleQuickAction = (
    action: 'upload-file' | 'create-folder' | 'share' | 'get-link'
  ) => {
    if (action === 'share' || action === 'get-link') {
      const defaultFile = files.find(f => !f.deleted && f.type !== 'folder')

      if (defaultFile) {
        setSelectedFileId(defaultFile.id)
      } else {
        alert('Please upload a file first to perform this action.')
        return
      }
    }

    setActiveModal(action)
  }

  const getActivityIcon = (type: string) => {
    const baseClass =
      'w-8 h-8 rounded-full flex items-center justify-center border transition-colors'

    switch (type) {
      case 'upload':
        // Emerald/Green circle for uploads matching screenshot
        return (
          <div
            className={cn(
              baseClass,
              'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30'
            )}
          >
            <svg
              className='w-4 h-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
              />
            </svg>
          </div>
        )
      case 'share':
        // Purple circle for sharing
        return (
          <div
            className={cn(
              baseClass,
              'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30'
            )}
          >
            <svg
              className='w-4 h-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8.684 10.742l4.63-2.315a1.5 1.5 0 11.632.922L9.316 11.66c.03.167.044.338.044.51s-.014.343-.044.51l4.63 2.316a1.5 1.5 0 11-.632.921l-4.63-2.315a1.5 1.5 0 110-2.122z'
              />
            </svg>
          </div>
        )
      case 'create_folder':
        // Blue circle for folders
        return (
          <div
            className={cn(
              baseClass,
              'bg-blue-50 dark:bg-blue-950/20 text-[#2563eb] dark:text-blue-400 border-blue-100 dark:border-blue-900/30'
            )}
          >
            <svg
              className='w-4 h-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z'
              />
            </svg>
          </div>
        )
      case 'star':
        // Amber/Yellow circle for stars
        return (
          <div
            className={cn(
              baseClass,
              'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30'
            )}
          >
            <svg
              className='w-4 h-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
              />
            </svg>
          </div>
        )
      case 'delete':
        // Red/Rose circle for deletion
        return (
          <div
            className={cn(
              baseClass,
              'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30'
            )}
          >
            <svg
              className='w-4 h-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
              />
            </svg>
          </div>
        )
      default:
        return (
          <div
            className={cn(
              baseClass,
              'bg-gray-50 dark:bg-gray-900 text-gray-500 border-gray-100 dark:border-gray-800'
            )}
          >
            <svg
              className='w-4 h-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
        )
    }
  }

  return (
    <>
      {/* Welcome Greeting Banner */}
      <div className='bg-card-bg border border-card-border rounded-2xl p-6 md:p-8 flex flex-row items-center justify-between relative overflow-hidden shrink-0 select-none shadow-sm'>
        {/* Decorative background shapes */}
        <div className='absolute right-0 bottom-0 w-64 h-28 bg-gradient-to-tr from-blue-500/5 to-indigo-500/10 rounded-tl-full blur-2xl pointer-events-none' />
        <div className='absolute right-48 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#2563eb]/40 pointer-events-none hidden md:block' />

        <div className='flex flex-col gap-1.5 relative z-10 max-w-xl'>
          <h2 className='text-xl md:text-2xl font-bold text-foreground'>
            Good morning, Prashant! 👋
          </h2>
          <p className='text-sm font-light text-text-secondary leading-normal'>
            Here's what's happening with your storage today.
          </p>
        </div>

        {/* Stylized SaaS cloud illustration */}
        <div className='hidden md:flex items-center gap-2 select-none relative shrink-0 z-10 w-24 h-20 border border-card-border bg-background rounded-2xl shadow-inner justify-center'>
          <svg
            className='w-10 h-10 text-[#2563eb]'
            fill='currentColor'
            viewBox='0 0 24 24'
          >
            <path d='M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z' />
          </svg>
        </div>
      </div>

      {/* 2-Column Grid (Storage Overview & Actions / Activities) */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8'>
        {/* Left Side (Storage Stats + Quick Actions) */}
        <div className='lg:col-span-2 flex flex-col gap-6 md:gap-8'>
          {/* Storage breakdown card */}
          <StorageOverview />

          {/* Quick Actions Panel */}
          <div className='bg-card-bg border border-card-border rounded-2xl p-6 text-foreground flex flex-col gap-4 shadow-sm'>
            <h3 className='text-sm font-bold text-foreground flex items-center gap-2 select-none'>
              <svg
                className='w-4 h-4 text-[#2563eb]'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M13 10V3L4 14h7v7l9-11h-7z' />
              </svg>
              <span>Quick Actions</span>
            </h3>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {/* Upload Files */}
              <button
                onClick={() => handleQuickAction('upload-file')}
                className='bg-background border border-card-border hover:border-[#2563eb] rounded-2xl p-4 flex flex-col items-center gap-3.5 justify-center text-center transition-all cursor-pointer group shadow-sm'
              >
                <div className='w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-[#2563eb] dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/30 group-hover:bg-[#2563eb] group-hover:text-white transition-colors'>
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
                    />
                  </svg>
                </div>
                <span className='text-[10px] font-bold uppercase tracking-[0.5px] text-text-secondary group-hover:text-foreground transition-colors'>
                  Upload Files
                </span>
              </button>

              {/* New Folder */}
              <button
                onClick={() => handleQuickAction('create-folder')}
                className='bg-background border border-card-border hover:border-[#0fa336] rounded-2xl p-4 flex flex-col items-center gap-3.5 justify-center text-center transition-all cursor-pointer group shadow-sm'
              >
                <div className='w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950/20 text-[#0fa336] dark:text-green-400 flex items-center justify-center border border-green-100 dark:border-green-900/30 group-hover:bg-[#0fa336] group-hover:text-white transition-colors'>
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z'
                    />
                  </svg>
                </div>
                <span className='text-[10px] font-bold uppercase tracking-[0.5px] text-text-secondary group-hover:text-foreground transition-colors'>
                  New Folder
                </span>
              </button>

              {/* Share File */}
              <button
                onClick={() => handleQuickAction('share')}
                className='bg-background border border-card-border hover:border-purple-500 rounded-2xl p-4 flex flex-col items-center gap-3.5 justify-center text-center transition-all cursor-pointer group shadow-sm'
              >
                <div className='w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-900/30 group-hover:bg-purple-600 group-hover:text-white transition-colors'>
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                    />
                  </svg>
                </div>
                <span className='text-[10px] font-bold uppercase tracking-[0.5px] text-text-secondary group-hover:text-foreground transition-colors'>
                  Share File
                </span>
              </button>

              {/* Trash */}
              <button
                onClick={() => setCurrentSection('Trash')}
                className='bg-background border border-card-border hover:border-red-500 rounded-2xl p-4 flex flex-col items-center gap-3.5 justify-center text-center transition-all cursor-pointer group shadow-sm'
              >
                <div className='w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-100 dark:border-red-900/30 group-hover:bg-red-600 group-hover:text-white transition-colors'>
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                    />
                  </svg>
                </div>
                <span className='text-[10px] font-bold uppercase tracking-[0.5px] text-text-secondary group-hover:text-foreground transition-colors'>
                  Trash
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side (Recent Activity Panel) */}
        <div className='bg-card-bg border border-card-border rounded-2xl p-6 text-foreground flex flex-col gap-4 max-h-[500px] shadow-sm'>
          <div className='flex items-center justify-between border-b border-divider pb-4 shrink-0 select-none'>
            <h3 className='text-sm font-bold text-foreground flex items-center gap-2'>
              <svg
                className='w-4 h-4 text-[#2563eb]'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M13 10V3L4 14h7v7l9-11h-7z' />
              </svg>
              <span>Recent Activity</span>
            </h3>
          </div>

          <div className='flex-1 overflow-y-auto pr-1 flex flex-col gap-4'>
            {activities.slice(0, 7).map(act => (
              <div key={act.id} className='flex gap-4 items-start select-none'>
                <div className='shrink-0'>{getActivityIcon(act.type)}</div>
                <div className='flex flex-col min-w-0 flex-1'>
                  <span className='text-xs font-bold text-foreground'>
                    {act.user === 'Prashant' ? 'You' : act.user}{' '}
                    {act.type === 'upload' && 'uploaded'}
                    {act.type === 'create_folder' && 'created folder'}
                    {act.type === 'share' && 'shared'}
                    {act.type === 'star' && 'starred'}
                    {act.type === 'delete' && 'deleted'}
                    {act.type === 'restore' && 'restored'}
                  </span>
                  <span className='text-[11px] font-light text-text-secondary truncate mt-0.5'>
                    {act.assetName}
                  </span>
                  <span className='text-[9px] font-bold text-text-muted mt-1'>
                    {formatDate(act.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* View All Activity link button */}
          <button
            onClick={() => alert('Viewing full activity log')}
            className='w-full text-center text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors py-3 border-t border-divider mt-2 flex items-center justify-center gap-1 cursor-pointer focus:outline-none'
          >
            <span>View all activity</span>
            <svg
              className='w-3 h-3 text-[#2563eb]'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2.5}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Recent Files Table */}
      <FileList limit={5} showViewAll={true} />
    </>
  )
}
