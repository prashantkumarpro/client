'use client'

import { useState } from 'react'

import {
  ArrowRight,
  Cloud,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User
} from 'lucide-react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import type { RegisterCredentials } from '../types'
import { register as registerApi } from '../api'
import { AuthError } from '../auth-error'

export default function RegisterForm () {
  const [showPassword, setShowPassword] = useState(false)
  const [registerError, setRegisterError] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState('')

  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<RegisterCredentials>({
    mode: 'onBlur',
    reValidateMode: 'onChange'
  })

  const onSubmit = async (data: RegisterCredentials) => {
    setRegisterError('')
    setRegisterSuccess('')
    clearErrors()

    try {
      await registerApi(data)

      setRegisterSuccess('Registration successful! Redirecting to login...')

      setTimeout(() => {
        router.replace('/login')
      }, 1500)
    } catch (error) {
      if (error instanceof AuthError) {
        if (error.fieldErrors) {
          Object.entries(error.fieldErrors).forEach(([field, message]) => {
            if (message) {
              setError(field as keyof RegisterCredentials, {
                type: 'server',
                message
              })
            }
          })

          return
        }

        setRegisterError(error.message)
        return
      }

      setRegisterError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className='w-full'>
      {/* Logo */}
      <div className='mb-6 flex items-center gap-2'>
        <Cloud
          size={26}
          fill='currentColor'
          className='shrink-0 text-[#1c69d4]'
        />

        <span className='text-[21px] font-bold tracking-[-0.6px] text-foreground'>
          Cloud
          <span className='text-[#1c69d4]'>E</span>
        </span>
      </div>

      {/* Heading */}
      <div className='mb-6'>
        <h1 className='text-[24px] font-bold leading-tight uppercase tracking-tight text-foreground sm:text-[26px]'>
          Create Account 👋
        </h1>

        <p className='mt-1.5 text-[13px] font-light leading-relaxed text-text-secondary'>
          Sign up to get started and access secure cloud storage.
        </p>
      </div>

      {/* Form */}
      <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
        {/* Name */}
        <Input
          label='Full Name'
          type='text'
          placeholder='Enter your full name'
          startIcon={<User size={17} />}
          error={errors.name?.message}
          {...register('name', {
            required: 'Full name is required',

            validate: value => {
              const name = value.trim()

              if (name.length < 3) {
                return 'Name must be at least 3 characters long'
              }

              if (name.length > 50) {
                return 'Name must not exceed 50 characters'
              }

              if (!/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(name)) {
                return 'Please enter a valid name'
              }

              return true
            }
          })}
        />

        {/* Email */}
        <div className='mt-4'>
          <Input
            label='Email address'
            type='email'
            placeholder='Enter your email'
            startIcon={<Mail size={17} />}
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',

              validate: value => {
                const email = value.trim()

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                  return 'Please enter a valid email address'
                }

                return true
              }
            })}
          />
        </div>

        {/* Password */}
        <div className='mt-4'>
          <Input
            label='Password'
            type={showPassword ? 'text' : 'password'}
            placeholder='Create a password'
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
              required: 'Password is required',
              validate: value => {
                if (value.length < 6) {
                  return 'Password must be at least 6 characters long'
                }

                return true
              }
            })}
          />
        </div>

        {/* General Backend Error */}
        {registerError && (
          <p className='mt-3 text-center text-[12px] text-red-500'>
            {registerError}
          </p>
        )}

        {/* Success */}
        {registerSuccess && (
          <p className='mt-3 text-center text-[12px] font-bold uppercase tracking-[0.5px] text-green-500'>
            {registerSuccess}
          </p>
        )}

        {/* Sign Up Button */}
        <Button
          type='submit'
          variant='primary'
          className='mt-5 h-11 w-full'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Sign up'}

          {!isSubmitting && <ArrowRight size={18} className='ml-2' />}
        </Button>
      </form>

      {/* Redirect to Sign In */}
      <div className='mt-5 text-center'>
        <p className='text-[12px] font-light text-text-secondary'>
          Already have an account?{' '}
          <Link
            href='/login'
            className='ml-1 text-[11px] font-bold uppercase tracking-[1px] text-foreground hover:underline'
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
