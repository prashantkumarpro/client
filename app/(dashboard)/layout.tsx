'use client'

import { useState } from 'react'

import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'
import { AuthGuard } from '@/components/auth/auth-gaurd'

export default function DashboardLayout ({
  children
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <AuthGuard>
      <div className='flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans antialiased transition-colors duration-200'>
        {/* Sidebar Navigation */}
        <Sidebar className='hidden lg:flex' />

        {/* Mobile Drawer Navigation */}
        <MobileNav
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main content viewport */}
        <div className='flex-1 flex flex-col min-w-0 h-full overflow-hidden'>
          {/* Top Header */}
          <Header onMenuToggle={() => setIsMobileMenuOpen(true)} />

          {/* Dashboard Inner Scrollable Body */}
          <main className='flex-1 overflow-y-auto  p-6 md:p-8 flex flex-col gap-6 md:gap-8'>
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
