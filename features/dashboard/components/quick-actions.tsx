'use client'

import { useApp } from '@/providers/app-provider'

export default function QuickActions () {
  const { setCurrentSection, setActiveModal, setSelectedFileId, files } =
    useApp()

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

  return (
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
  )
}
