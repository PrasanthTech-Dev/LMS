import { useState, useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthShell } from './AuthShell'
import { Button } from '@/components/ui'
import { useToast } from '@/components/ui/Toast'
import { useAppDispatch, useAppSelector } from '@/store'
import { clearAuthError, register } from '@/store/slices'
import { dashboardPath } from '@/utils/routes'
import { Award, Check, ChevronDown, TrendingUp } from 'lucide-react'

export default function Register() {
  const dispatch = useAppDispatch()
  const { user, status, error } = useAppSelector((s) => s.auth)
  const nav = useNavigate()
  const toast = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'student' | 'instructor'>('student')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  if (user) return <Navigate to={dashboardPath(user.role)} replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password || !confirmPassword) {
      toast('Please fill out all fields.', 'error')
      return
    }
    if (password.length < 8) {
      toast('Password must be at least 8 characters.', 'error')
      return
    }
    if (password !== confirmPassword) {
      toast('Passwords do not match.', 'error')
      return
    }

    const res = await dispatch(
      register({
        name,
        email,
        password,
        role,
      })
    )

    if (register.fulfilled.match(res)) {
      toast('Account created successfully! Welcome to EduLearn.')
      nav(dashboardPath(res.payload.user.role), { replace: true })
    }
  }

  return (
    <AuthShell
      badge="Join EduLearn"
      titleLine1="Create Your"
      titleLine2="Account Today"
      subtitle="Start learning, gain new skills, and build a better future."
      features={[
        { text: 'Access premium courses', icon: <Check size={16} strokeWidth={2.5} /> },
        { text: 'Track your learning progress', icon: <TrendingUp size={16} /> },
        { text: 'Get certified', icon: <Award size={16} /> },
      ]}
      topRightAction={{
        label: 'Already have an account?',
        linkText: 'Sign In \u2192',
        to: '/login',
      }}
    >
      {/* Form Header (matching reference logo + title) */}
      <div className="mb-5 text-center">
        <div className="flex items-center justify-center gap-2.5">
          <img
            src="/auth-signup-icon.png"
            alt="Sign Up"
            className="h-7 w-7 object-contain drop-shadow-[0_0_10px_rgba(1,131,246,0.6)]"
          />
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Sign Up
          </h2>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-slate-300">
          Create your account to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300"
          >
            {error}
          </div>
        )}

        {/* Full name */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-200">
            Full name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            required
            className="w-full rounded-xl border border-slate-700/60 bg-[#0a1122] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-[#0c1630] focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-200">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full rounded-xl border border-slate-700/60 bg-[#0a1122] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-[#0c1630] focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        {/* I want to */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-200">
            I want to
          </label>
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'student' | 'instructor')}
              className="w-full appearance-none rounded-xl border-2 border-blue-600 bg-[#0a1122] px-3.5 py-2.5 text-sm text-white focus:border-blue-500 focus:bg-[#0c1630] focus:outline-none focus:ring-1 focus:ring-blue-500 transition pr-10 cursor-pointer"
            >
              <option value="student" className="bg-[#0a1122] text-white">
                Learn (Student)
              </option>
              <option value="instructor" className="bg-[#0a1122] text-white">
                Teach (Instructor)
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-white">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        {/* Password & Confirm password side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-200">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8+ characters"
              required
              className="w-full rounded-xl border border-slate-700/60 bg-[#0a1122] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-[#0c1630] focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-200">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              required
              className="w-full rounded-xl border border-slate-700/60 bg-[#0a1122] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-[#0c1630] focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Create account button */}
        <Button
          type="submit"
          loading={status === 'loading'}
          className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition flex items-center justify-center mt-2"
        >
          Create account
        </Button>

        {/* Bottom login link */}
        <p className="pt-2 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-500 hover:text-blue-400 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
