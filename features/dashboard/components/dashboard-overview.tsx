'use client'

import { StorageOverview } from '@/features/storage/components/storage-overview'
import { FileList } from '@/features/files/components/file-list'
import RecentActivity from './recent-activity'
import WelcomeBanner from './welcome-banner'
import QuickActions from './quick-actions'

export default function DashboardOverview () {
  return (
    <>
      <WelcomeBanner />

      {/* 2-Column Grid (Storage Overview & Actions / Activities) */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8'>
        {/* Left Side (Storage Stats + Quick Actions) */}
        <div className='lg:col-span-2 flex flex-col gap-6 md:gap-8'>
          {/* Storage breakdown card */}
          <StorageOverview />

          {/* Quick Actions Panel */}
          <QuickActions />
        </div>

        <RecentActivity />
      </div>

      {/* Recent Files Table */}
      <FileList limit={5} showViewAll={true} />
    </>
  )
}
