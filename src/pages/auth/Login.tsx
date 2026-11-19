import { useState, useEffect } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthShell } from './AuthShell'
import { Button } from '@/components/ui'
import { useToast } from '@/components/ui/Toast'
import { useAppDispatch, useAppSelector } from '@/store'
import { clearAuthError, login } from '@/store/slices'
import { demoCredentials } from '@/data/mock'
import { dashboardPath } from '@/utils/routes'
import { ArrowRight, Award, BookOpen, Check, Eye, EyeOff, Lock, Mail, User } from 'lucide-react'

export default function Login() {
  const dispatch = useAppDispatch()
  const { user, status, error } = useAppSelector((s) => s.auth)
  const nav = useNavigate()
  const loc = useLocation()
  const toast = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  if (user) return <Navigate to={dashboardPath(user.role)} replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast('Please enter both email and password.', 'error')
      return
    }

    const res = await dispatch(login({ email, password }))
    if (login.fulfilled.match(res)) {
      toast(`Welcome back, ${res.payload.user.name.split(' ')[0]}!`)
      const from = (loc.state as { from?: string } | null)?.from
      nav(from ?? dashboardPath(res.payload.user.role), { replace: true })
    }
  }

  const handleDemo = (role: 'student' | 'instructor' | 'admin') => {
    const creds = demoCredentials[role]
    setEmail(creds.email)
    setPassword(creds.password)
    toast(`Loaded ${role.toUpperCase()} credentials!`, 'info')
  }

  return (
    <AuthShell
      badge="Welcome Back!"
      titleLine1="Sign In to"
      titleLine2="EduLearn"
      subtitle="Continue your learning journey and achieve your goals."
      features={[
        { text: 'Access your courses', icon: <BookOpen size={16} /> },
        { text: 'Track your progress', icon: <Check size={16} strokeWidth={2.5} /> },
        { text: 'Get your certificate', icon: <Award size={16} /> },
      ]}
      topRightAction={{
        label: "Don't have an account?",
        linkText: 'Sign Up \u2192',
        to: '/register',
      }}
    >
      {/* Form Header */}
      <div className="text-center mb-5">
        <div className="flex items-center justify-center gap-2.5">
          <User size={22} className="fill-[#0084ff] text-[#0084ff]" />
          <h2 className="text-2xl font-bold tracking-tight text-white">Sign In</h2>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-slate-300">
          Enter your credentials to access your account
        </p>
      </div>

      {/* Demo Credentials Quick-Fill Card (Placed below header text) */}
      <div className="mb-5 rounded-2xl border border-blue-500/25 bg-[#061129]/90 p-3 sm:p-3.5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur">
        <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          DEMO CREDENTIALS
        </p>
        <div className="flex items-center justify-center gap-2 sm:gap-2.5">
          {(['student', 'instructor', 'admin'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleDemo(r)}
              className="rounded-xl border border-blue-500/40 bg-[#0a1838] px-3.5 sm:px-4 py-1.5 text-xs font-semibold capitalize text-slate-200 transition hover:border-cyan-400 hover:bg-[#0f2456] hover:text-white shadow-sm"
            >
              {r === 'student' ? 'Student' : r === 'instructor' ? 'Instructor' : 'Admin'}
            </button>
          ))}
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300"
          >
            {error}
          </div>
        )}

        {/* Email Address */}
        <div>
          <div className="relative flex items-center">
            <Mail size={16} className="pointer-events-none absolute left-3.5 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="w-full rounded-xl border border-blue-500/25 bg-[#081534] py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-400 focus:border-cyan-400 focus:bg-[#0a1c48] focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="relative flex items-center">
            <Lock size={16} className="pointer-events-none absolute left-3.5 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full rounded-xl border border-blue-500/25 bg-[#081534] py-2.5 pl-10 pr-10 text-xs text-white placeholder:text-slate-400 focus:border-cyan-400 focus:bg-[#0a1c48] focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-slate-400 hover:text-white transition"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <label className="flex cursor-pointer items-center gap-2 text-slate-300">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-blue-500/30 bg-[#081534] text-cyan-400 focus:ring-cyan-400/40"
            />
            <span>Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-slate-400 hover:text-cyan-300 transition"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          className="w-full bg-[#0070f3] hover:bg-[#005ed4] text-white py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-600/40 transition flex items-center justify-center gap-2"
          loading={status === 'loading'}
        >
          <span>Sign In</span>
          <ArrowRight size={15} />
        </Button>

        {/* OR Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="w-full border-t border-white/[0.08]" />
          <span className="absolute bg-[#060e24] px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            OR
          </span>
        </div>

        {/* Social Buttons */}
        <div>
          {/* Continue with Google */}
          <button
            type="button"
            onClick={() => toast('Google sign-in demo', 'info')}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-blue-500/25 bg-[#081534] py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-400 hover:bg-[#0c1f4e] hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Bottom Signup Link */}
        <p className="pt-2 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-[#00c8ff] hover:underline">
            Sign Up &rarr;
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
