import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from './AuthShell'
import { Button } from '@/components/ui'
import { useToast } from '@/components/ui/Toast'
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, RotateCcw } from 'lucide-react'

export default function ResetPassword() {
  const toast = useToast()
  const nav = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || !confirmPassword) {
      toast('Please enter both passwords.', 'error')
      return
    }
    if (password !== confirmPassword) {
      toast('Passwords do not match.', 'error')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast('Password updated successfully! Please sign in.', 'success')
      nav('/login')
    }, 1000)
  }

  return (
    <AuthShell
      badge="Reset Password"
      titleLine1="Create New"
      titleLine2="Password"
      subtitle="Your new password must be different from your previous one."
      topRightAction={{
        linkText: 'Back to Sign In \u2190',
        to: '/login',
      }}
    >
      {/* Form Header */}
      <div className="text-center mb-6">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#0070f3]/20 text-[#00c8ff] ring-1 ring-[#00c8ff]/40 shadow-[0_0_15px_rgba(0,200,255,0.25)] mb-3">
          <RotateCcw size={20} className="text-[#00c8ff]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">Reset Password</h2>
        <p className="mt-1 text-xs text-slate-400">
          Enter your new password
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* New Password */}
        <div>
          <div className="relative flex items-center">
            <Lock size={16} className="pointer-events-none absolute left-3.5 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
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

        {/* Confirm Password */}
        <div>
          <div className="relative flex items-center">
            <Lock size={16} className="pointer-events-none absolute left-3.5 text-slate-400" />
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
              className="w-full rounded-xl border border-blue-500/25 bg-[#081534] py-2.5 pl-10 pr-10 text-xs text-white placeholder:text-slate-400 focus:border-cyan-400 focus:bg-[#0a1c48] focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 text-slate-400 hover:text-white transition"
              aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Update Password Button */}
        <Button
          type="submit"
          className="w-full bg-[#0070f3] hover:bg-[#005ed4] text-white py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-600/40 transition flex items-center justify-center gap-2 mt-2"
          loading={loading}
        >
          <span>Update Password</span>
          <ArrowRight size={15} />
        </Button>

        {/* Bottom Back to Sign In Link */}
        <div className="pt-3 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={13} />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </form>
    </AuthShell>
  )
}

