'use client'

import React from 'react'

export default function WelcomeBanner () {
  return (
    <>
      {/* Welcome Greeting Banner */}
      <div className='bg-card-bg border border-card-border rounded-2xl p-4 md:p-5 flex flex-row items-center justify-between relative overflow-hidden shrink-0 select-none shadow-sm'>
        {/* Decorative background shapes */}
        <div className='absolute right-0 bottom-0 w-80 h-36 bg-gradient-to-tr from-blue-500/5 to-indigo-500/10 rounded-tl-full blur-3xl pointer-events-none' />

        <div className='flex flex-col gap-1.5 relative z-10 max-w-xl'>
          <h2 className='text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
            Welcome back, Prashant! 👋
          </h2>
          <div className='flex flex-wrap items-center gap-2 mt-1 select-none'>
            {/* Badge 1: 3 new files */}
            <div className='inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] md:text-xs font-bold uppercase tracking-[0.5px] bg-blue-50 dark:bg-blue-950/30 text-[#0056f7] dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 shadow-sm'>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>3 New Files Today</span>
            </div>
            {/* Badge 2: Last active */}
            <div className='inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] md:text-xs font-bold uppercase tracking-[0.5px] bg-slate-50 dark:bg-zinc-900/40 text-slate-700 dark:text-slate-350 border border-card-border shadow-sm'>
              <svg className="w-3.5 h-3.5 text-[#0056f7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Last active: <span className="text-slate-900 dark:text-white font-extrabold">Design Assets</span></span>
            </div>
          </div>
        </div>

        {/* Floating 3D folder in clouds illustration */}
        <div className='hidden lg:flex items-center justify-center relative w-44 h-24 select-none shrink-0 z-10 mr-4'>
          {/* Radial light glow */}
          <div className='absolute w-36 h-36 rounded-full bg-blue-500/10 dark:bg-blue-400/5 blur-2xl pointer-events-none' />

          {/* Soft background overlapping clouds */}
          <div className='absolute right-2 bottom-2 w-24 h-10 bg-gradient-to-tr from-white/95 to-blue-50/80 dark:from-zinc-900/90 dark:to-zinc-800/80 rounded-full blur-[1px] shadow-sm z-0 border border-slate-100 dark:border-zinc-800' />
          <div className='absolute left-2 bottom-3 w-28 h-12 bg-gradient-to-tr from-white to-blue-100/50 dark:from-zinc-900 dark:to-zinc-800/60 rounded-full blur-[1px] shadow-sm z-20 border border-slate-100 dark:border-zinc-800' />
          <div className='absolute right-10 top-2 w-20 h-10 bg-white/70 dark:bg-zinc-800/30 rounded-full blur-[3px]' />

          {/* Floating 3D folder */}
          <div className='absolute z-10 -rotate-12 translate-y-[-6px] drop-shadow-2xl hover:scale-105 hover:-rotate-6 transition-all duration-300 w-20 h-15'>
            <svg viewBox='0 0 100 80' className='w-full h-full' fill='none'>
              <defs>
                <linearGradient id='bannerFolderGrad' x1='0%' y1='0%' x2='100%' y2='100%'>
                  <stop offset='0%' stopColor='#4f8aff' />
                  <stop offset='100%' stopColor='#0056f7' />
                </linearGradient>
                <linearGradient id='bannerFolderBackGrad' x1='0%' y1='0%' x2='100%' y2='100%'>
                  <stop offset='0%' stopColor='#004bd6' />
                  <stop offset='100%' stopColor='#003db3' />
                </linearGradient>
                <filter id='bannerShadow' x='-10%' y='-10%' width='120%' height='120%'>
                  <feDropShadow dx='0' dy='5' stdDeviation='5' floodColor='#0056f7' floodOpacity='0.25' />
                </filter>
              </defs>

              {/* Folder Back Cover */}
              <path
                d='M5 10 A 5 5 0 0 1 10 5 H 35 L 43 15 H 90 A 5 5 0 0 1 95 20 V 70 A 5 5 0 0 1 90 75 H 10 A 5 5 0 0 1 5 70 Z'
                fill='url(#bannerFolderBackGrad)'
              />

              {/* Peak Paper sheet */}
              <rect x='15' y='10' width='70' height='45' rx='0' fill='#ffffff' opacity='0.95' />

              {/* Folder Front Cover */}
              <path
                d='M5 25 L 40 25 L 45 28 L 95 28 V 70 A 5 5 0 0 1 90 75 H 10 A 5 5 0 0 1 5 70 Z'
                fill='url(#bannerFolderGrad)'
                filter='url(#bannerShadow)'
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  )
}
