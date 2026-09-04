'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'
import { MobilePlusButton } from '@/components/layout/mobile-plus-button'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'
import { AuthGuard } from '@/components/auth/auth-gaurd'
import { PAGE_HORIZONTAL_PADDING } from '@/lib/constants/layout'
import { cn } from '@/lib/utils/cn'

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  return (
    <AuthGuard>
      <div className='flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans antialiased transition-colors duration-200'>
        {/* Sidebar Navigation */}
        <Sidebar className='hidden md:flex' />

        {/* Main content viewport - flush against the vertical divider */}
        <div 
          className='flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background rounded-l-none'
          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        >
          {/* Top Header */}
          <Header onMenuToggle={() => setIsMobileNavOpen(true)} className='rounded-l-none' />

          {/* Dashboard Inner Scrollable Body */}
          <main 
            className={cn(
              'flex-1 overflow-y-auto py-5 pb-28 sm:py-6 md:py-6 flex flex-col rounded-l-none',
              PAGE_HORIZONTAL_PADDING
            )}
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          >
            {children}
          </main>

          {/* Mobile Bottom Navigation (Shares exact same parent container & width as Header) */}
          <MobileBottomNav />
        </div>

        {/* Mobile Floating Action Button (Global Plus) */}
        <MobilePlusButton />

        {/* Mobile Drawer menu */}
        <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
      </div>
    </AuthGuard>
  )
}
