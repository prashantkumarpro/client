import LoginForm from '@/features/auth/components/login-form'
import LoginIllustration from '@/features/auth/components/login-illustration'

export default function LoginPage () {
  return (
    <main className='min-h-screen bg-[#f4f7ff] p-2 sm:p-4 lg:p-5'>
      <div
        className='
          mx-auto
          flex
          w-full
          max-w-[1280px]
          flex-col
          overflow-hidden
          rounded-[18px]
          bg-white
          shadow-[0_15px_50px_rgba(40,75,140,0.10)]

          lg:h-[calc(100vh-40px)]
          lg:flex-row
          lg:rounded-[24px]
        '
      >
        {/* Left side */}
        <section
          className='
            flex
            w-full
            items-center
            justify-center
            px-5
            py-10

            sm:px-8
            sm:py-12

            lg:w-1/2
            lg:px-10
            lg:py-8

            xl:px-14
          '
        >
          <div className='w-full max-w-[520px]'>
            <LoginForm />
          </div>
        </section>

        {/* Right side */}
        <section
          className='
            w-full
            min-h-[360px]

            sm:min-h-[440px]

            lg:w-1/2
            lg:min-h-0
          '
        >
          <LoginIllustration />
        </section>
      </div>
    </main>
  )
}
