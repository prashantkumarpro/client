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

        {/* Main content viewport - flush against the vertical divider */}
        <div 
          className='flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background rounded-l-none transition-all duration-[250ms] ease-out'
          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        >
          {/* Top Header */}
          <Header onMenuToggle={() => setIsMobileNavOpen(true)} className='rounded-l-none' />

          {/* Dashboard Inner Scrollable Body */}
          <main 
            className='flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-6 flex flex-col gap-6 rounded-l-none'
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          >
            {children}
          </main>
        </div>

        {/* Mobile Drawer menu */}
        <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
      </div>
    </AuthGuard>
  )
}
