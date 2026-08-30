'use client'

import { useState } from 'react'
import { ArrowRight, Cloud, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import type { LoginCredentials } from '../types'

import { useRouter } from 'next/navigation'

import { useAuth } from '../hooks/use-auth'
import { AuthError } from '../auth-error'

export default function LoginForm () {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loginError, setLoginError] = useState('')
  const router = useRouter()
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<LoginCredentials>()

  const { login } = useAuth()

  const onSubmit = async (data: LoginCredentials) => {
    setLoginError('')
    clearErrors()

    try {
      await login(data)
      router.replace('/dashboard')
    } catch (error) {
      if (error instanceof AuthError) {
        setLoginError(error.message)
        return
      }

      setLoginError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className='w-full'>
      {/* Logo */}
      <div className='mb-6 flex items-center gap-2'>
        <Cloud
          size={26}
          fill='currentColor'
          className='text-[#1c69d4] shrink-0'
        />

        <span className='text-[21px] font-bold tracking-[-0.6px] text-foreground'>
          Cloud<span className='text-[#1c69d4]'>E</span>
        </span>
      </div>
      {/* Heading */}
      <div className='mb-6'>
        <h1 className='text-[24px] font-bold leading-tight uppercase tracking-tight text-foreground sm:text-[26px]'>
          Welcome back 👋
        </h1>

        <p className='mt-1.5 text-[13px] font-light leading-relaxed text-text-secondary'>
          Sign in to access your files and continue where you left off.
        </p>
      </div>

      <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <Input
          label='Email address'
          type='email'
          placeholder='Enter your email'
          startIcon={<Mail size={17} />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Invalid email format'
            }
          })}
        />

        {/* Password */}
        <div className='mt-4'>
          <Input
            label='Password'
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter your password'
            startIcon={<LockKeyhole size={17} />}
            error={errors.password?.message}
            endAction={
              <button
                type='button'
                onClick={() => setShowPassword(value => !value)}
                className='cursor-pointer text-text-muted transition-colors hover:text-foreground'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            }
            {...register('password', {
              required: 'Password is required'
            })}
          />
        </div>

        {/* Remember / Forgot */}
        <div className='mt-4 flex items-center justify-between gap-3'>
          <label className='flex shrink-0 cursor-pointer items-center gap-2 text-[11px] font-bold tracking-[1.5px] uppercase text-text-secondary select-none hover:text-foreground transition-colors'>
            <input
              type='checkbox'
              checked={rememberMe}
              onChange={event => setRememberMe(event.target.checked)}
              className='h-4 w-4 cursor-pointer accent-[#1c69d4] bg-input-bg rounded-none'
            />
            Remember me
          </label>

          <button
            type='button'
            className='text-right text-[11px] font-bold tracking-[1.5px] uppercase text-text-secondary hover:text-foreground transition-colors cursor-pointer'
          >
            Forgot password?
          </button>
        </div>

        {loginError && (
          <p className='text-[12px] text-center mt-1 pt-1 text-red-500'>
            {loginError}
          </p>
        )}

        {/* Sign In Button */}
        <Button
          type='submit'
          variant='primary'
          className='mt-5 w-full h-11'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}

          {!isSubmitting && <ArrowRight size={18} className='ml-2' />}
        </Button>

        {/* Divider */}
        <div className='my-5 flex items-center gap-3'>
          <div className='h-px flex-1 bg-divider' />

          <span className='text-[11px] font-bold tracking-[1.5px] uppercase text-text-muted'>
            or
          </span>

          <div className='h-px flex-1 bg-divider' />
        </div>

        {/* Google Login
        <Button type='button' variant='outline' className='w-full h-11'>
          <img src='/icons/google.svg' alt='' className='mr-2 h-5 w-5' />
          Continue with Google
        </Button> */}
      </form>

      {/* Register */}
      <div className='mt-5 text-center'>
        <p className='text-[12px] text-text-secondary font-light'>
          Don&apos;t have an account?{' '}
          <Link
            href='/register'
            className='font-bold tracking-[1px] text-[11px] uppercase text-foreground hover:underline ml-1'
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
