'use-client'

export default function WelcomeBanner () {
  return (
    <>
      {/* Welcome Greeting Banner */}
      <div className='bg-card-bg border border-card-border rounded-2xl p-6 md:p-8 flex flex-row items-center justify-between relative overflow-hidden shrink-0 select-none shadow-sm'>
        {/* Decorative background shapes */}
        <div className='absolute right-0 bottom-0 w-64 h-28 bg-gradient-to-tr from-blue-500/5 to-indigo-500/10 rounded-tl-full blur-2xl pointer-events-none' />
        <div className='absolute right-48 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#2563eb]/40 pointer-events-none hidden md:block' />

        <div className='flex flex-col gap-1.5 relative z-10 max-w-xl'>
          <h2 className='text-xl md:text-2xl font-bold text-foreground'>
            Good morning, Prashant! 👋
          </h2>
          <p className='text-sm font-light text-text-secondary leading-normal'>
            Here's what's happening with your storage today.
          </p>
        </div>

        {/* Stylized SaaS cloud illustration */}
        <div className='hidden md:flex items-center gap-2 select-none relative shrink-0 z-10 w-24 h-20 border border-card-border bg-background rounded-2xl shadow-inner justify-center'>
          <svg
            className='w-10 h-10 text-[#2563eb]'
            fill='currentColor'
            viewBox='0 0 24 24'
          >
            <path d='M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z' />
          </svg>
        </div>
      </div>
    </>
  )
}
