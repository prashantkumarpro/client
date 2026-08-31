'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'
import { AuthGuard } from '@/components/auth/auth-gaurd'

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

        {/* Main content viewport */}
        <div className='flex-1 flex flex-col min-w-0 h-full overflow-hidden'>
          {/* Top Header */}
          <Header onMenuToggle={() => setIsMobileNavOpen(true)} />

          {/* Dashboard Inner Scrollable Body */}
          <main className='flex-1 overflow-y-auto mx-4 min-[800px]:mx-8 mt-2 mb-4 md:mb-5 py-3 flex flex-col gap-4 md:gap-5'>
            {children}
          </main>
        </div>

        {/* Mobile Drawer menu */}
        <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
      </div>
    </AuthGuard>
  )
}
