'use client'

import { useState } from 'react'
import {
  ArrowRight,
  Cloud,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  return (
    <div className="w-full max-w-[500px]">

      {/* Logo */}
      <div className="mb-6 flex items-center gap-2 sm:mb-8">
        <Cloud
          size={30}
          strokeWidth={2.5}
          fill="currentColor"
          className="text-blue-600 sm:size-[32px]"
        />

        <span className="text-[22px] font-bold tracking-[-0.7px] text-[#142044] sm:text-[24px]">
          Cloud<span className="text-blue-600">E</span>
        </span>
      </div>

      {/* Heading */}
      <div className="mb-6 sm:mb-7">
        <h1 className="text-[30px] font-bold leading-[1.15] tracking-[-0.8px] text-[#142044] sm:text-[36px]">
          Welcome back{' '}
          <span className="text-[25px] sm:text-[29px]">👋</span>
        </h1>

        <p className="mt-2 max-w-[390px] text-[14px] leading-5 text-[#697797] sm:mt-2.5 sm:text-[15px] sm:leading-6">
          Sign in to access your files and continue
          <br  className="hidden sm:block"/>
         
          where you left off.
        </p>
      </div>

      <form className="w-full">

        {/* Email */}
        <Input
          label="Email address"
          type="email"
          placeholder="Enter your email"
          startIcon={<Mail size={20} />}
          className="h-11 sm:h-12"
        />

        {/* Password */}
        <div className="mt-4 sm:mt-5">
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              startIcon={<LockKeyhole size={20} />}
              className="h-11 pr-11 sm:h-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3.5 bottom-[12px] text-[#7a87a4] transition-colors hover:text-blue-600"
              aria-label={
                showPassword ? 'Hide password' : 'Show password'
              }
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </div>

        {/* Remember / Forgot */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <label className="flex shrink-0 cursor-pointer items-center gap-2 text-[12px] text-[#596985] sm:text-[13px]">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) =>
                setRememberMe(event.target.checked)
              }
              className="h-[17px] w-[17px] cursor-pointer accent-blue-600"
            />

            Remember me
          </label>

          <button
            type="button"
            className="text-right text-[12px] font-medium text-blue-600 transition-colors hover:text-blue-700 sm:text-[13px]"
          >
            Forgot password?
          </button>
        </div>

        {/* Sign In */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="mt-5 h-11 w-full rounded-[10px] text-[14px] font-semibold sm:h-12 sm:text-[15px]"
        >
          Sign in

          <ArrowRight
            size={18}
            className="ml-2"
          />
        </Button>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3 sm:gap-4">
          <div className="h-px flex-1 bg-[#dce3ef]" />

          <span className="text-[12px] text-[#8290ad] sm:text-[13px]">
            or
          </span>

          <div className="h-px flex-1 bg-[#dce3ef]" />
        </div>

        {/* Google */}
        <Button
          type="button"
          variant="soft"
          size="md"
          className="h-11 w-full rounded-[10px] border border-[#dce3ef] bg-white text-[14px] font-semibold text-[#142044] shadow-none hover:bg-[#f8faff] sm:h-12 sm:text-[15px]"
        >
          <img
            src="/icons/google.svg"
            alt=""
            className="mr-2 h-5 w-5"
          />

          Continue with Google
        </Button>
      </form>

      {/* Register */}
      <div className="mt-5 text-center">
        <p className="text-[12px] text-[#74819f] sm:text-[13px]">
          Don't have an account?{' '}

          <Link
            href="/register"
            className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}