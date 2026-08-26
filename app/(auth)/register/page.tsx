'use client'

import RegisterForm from '@/features/auth/components/register-form'
import { Sun, Moon } from 'lucide-react'
import { useApp } from '../../../providers/app-provider'

export default function RegisterPage () {
  const { theme, toggleTheme } = useApp()

  return (
    <main className='relative min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8 select-none transition-colors duration-200'>
      
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className='
          absolute
          top-4
          right-4
          p-2
          rounded-none
          bg-card-bg
          text-foreground
          hover:bg-divider
          transition-colors
          duration-200
          cursor-pointer
        '
        aria-label='Toggle theme'
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div
        className='
          relative
          mx-auto
          w-full
          max-w-[460px]
          bg-card-bg
          shadow-2xl
          dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]
          overflow-hidden
          rounded-none
        '
      >
        {/* Register Form Container */}
        <section className='px-6 py-7 sm:px-10 sm:py-8 bg-card-bg w-full'>
          <RegisterForm />
        </section>
      </div>
    </main>
  )
}
