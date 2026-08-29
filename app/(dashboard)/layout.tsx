'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { AuthGuard } from '@/components/auth/auth-gaurd'

export default function DashboardLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className='flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans antialiased transition-colors duration-200'>
        {/* Sidebar Navigation (always visible: collapsed on mobile/tablet, expanded on desktop) */}
        <Sidebar />

        {/* Main content viewport */}
        <div className='flex-1 flex flex-col min-w-0 h-full overflow-hidden'>
          {/* Top Header */}
          <Header />

          {/* Dashboard Inner Scrollable Body */}
          <main className='flex-1 overflow-y-auto p-6 md:p-8 pt-4 md:pt-4 flex flex-col gap-6 md:gap-8'>
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
