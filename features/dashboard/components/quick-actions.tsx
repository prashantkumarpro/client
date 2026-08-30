'use client'

import React from 'react'
import { useApp } from '@/providers/app-provider'

export default function QuickActions () {
  const { setCurrentSection, setActiveModal } = useApp()

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 select-none w-full'>
      <div
        onClick={() => setActiveModal('upload-file')}
        className='bg-card-bg hover:bg-slate-50/80 dark:hover:bg-zinc-900/40 border border-card-border hover:border-[#0056f7] hover:shadow-md hover:-translate-y-0.5 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all duration-200 group shadow-sm'
      >
        <div className='flex items-center gap-3.5 min-w-0'>
          {/* Light blue icon box */}
          <div className='w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-[#0056f7] dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/30 group-hover:bg-[#0056f7] group-hover:text-white transition-colors shrink-0'>
            <svg
              className='w-5 h-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={1.8}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
              />
            </svg>
          </div>
          <div className='flex flex-col min-w-0'>
            <span className='text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#0056f7] dark:group-hover:text-blue-400 transition-colors truncate'>
              Upload files
            </span>
            <span className='text-xs text-slate-550 dark:text-slate-400 font-medium truncate mt-0.5'>
              Upload files from device
            </span>
          </div>
        </div>
        <svg
          className='w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors shrink-0 ml-2'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2}
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M14 5l7 7m0 0l-7 7m7-7H3' />
        </svg>
      </div>

      <div
        onClick={() => setActiveModal('upload-file')}
        className='bg-card-bg hover:bg-slate-50/80 dark:hover:bg-zinc-900/40 border border-card-border hover:border-[#10a336] hover:shadow-md hover:-translate-y-0.5 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all duration-200 group shadow-sm'
      >
        <div className='flex items-center gap-3.5 min-w-0'>
          {/* Light green icon box */}
          <div className='w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950/20 text-[#10a336] dark:text-green-400 flex items-center justify-center border border-green-100 dark:border-green-900/30 group-hover:bg-[#10a336] group-hover:text-white transition-colors shrink-0'>
            <svg
              className='w-5 h-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={1.8}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z'
              />
            </svg>
          </div>
          <div className='flex flex-col min-w-0'>
            <span className='text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#10a336] dark:group-hover:text-green-400 transition-colors truncate'>
              Upload folder
            </span>
            <span className='text-xs text-slate-550 dark:text-slate-400 font-medium truncate mt-0.5'>
              Upload a folder from device
            </span>
          </div>
        </div>
        <svg
          className='w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors shrink-0 ml-2'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2}
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M14 5l7 7m0 0l-7 7m7-7H3' />
        </svg>
      </div>

      {/* Card 3: New folder */}
      <div
        onClick={() => setActiveModal('create-folder')}
        className='bg-card-bg hover:bg-slate-50/80 dark:hover:bg-zinc-900/40 border border-card-border hover:border-[#a855f7] hover:shadow-md hover:-translate-y-0.5 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all duration-200 group shadow-sm'
      >
        <div className='flex items-center gap-3.5 min-w-0'>
          {/* Light purple icon box */}
          <div className='w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-[#a855f7] dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-900/30 group-hover:bg-[#a855f7] group-hover:text-white transition-colors shrink-0'>
            <svg
              className='w-5 h-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={1.8}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <div className='flex flex-col min-w-0'>
            <span className='text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#a855f7] dark:group-hover:text-purple-400 transition-colors truncate'>
              New folder
            </span>
            <span className='text-xs text-slate-550 dark:text-slate-400 font-medium truncate mt-0.5'>
              Create a new folder
            </span>
          </div>
        </div>
        <svg
          className='w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors shrink-0 ml-2'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2}
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M14 5l7 7m0 0l-7 7m7-7H3' />
        </svg>
      </div>

      {/* Card 4: Shared with me */}
      <div
        onClick={() => setCurrentSection('Shared')}
        className='bg-card-bg hover:bg-slate-50/80 dark:hover:bg-zinc-900/40 border border-card-border hover:border-[#f97316] hover:shadow-md hover:-translate-y-0.5 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all duration-200 group shadow-sm'
      >
        <div className='flex items-center gap-3.5 min-w-0'>
          {/* Light orange icon box */}
          <div className='w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-[#f97316] dark:text-orange-400 flex items-center justify-center border border-orange-100 dark:border-orange-900/30 group-hover:bg-[#f97316] group-hover:text-white transition-colors shrink-0'>
            <svg
              className='w-5 h-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={1.8}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M18 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <div className='flex flex-col min-w-0'>
            <span className='text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#f97316] dark:group-hover:text-orange-400 transition-colors truncate'>
              Shared with me
            </span>
            <span className='text-xs text-slate-555 dark:text-slate-400 font-medium truncate mt-0.5'>
              View files shared with you
            </span>
          </div>
        </div>
        <svg
          className='w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors shrink-0 ml-2'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2}
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M14 5l7 7m0 0l-7 7m7-7H3' />
        </svg>
      </div>
    </div>
  )
}
