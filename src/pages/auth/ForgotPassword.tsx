import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthShell } from './AuthShell'
import { Button } from '@/components/ui'
import { useToast } from '@/components/ui/Toast'
import { ArrowLeft, ArrowRight, Lock, Mail } from 'lucide-react'

export default function ForgotPassword() {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast('Please enter your email address.', 'error')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
      toast('Password reset link sent to your email!', 'success')
    }, 1000)
  }

  return (
    <AuthShell
      badge="Need Help?"
      titleLine1="Forgot Your"
      titleLine2="Password?"
      subtitle="No worries! Enter your email address and we'll send you a reset link."
      topRightAction={{
        linkText: 'Back to Sign In \u2190',
        to: '/login',
      }}
    >
      {/* Form Header */}
      <div className="text-center mb-6">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#0070f3]/20 text-[#00c8ff] ring-1 ring-[#00c8ff]/40 shadow-[0_0_15px_rgba(0,200,255,0.25)] mb-3">
          <Lock size={20} className="text-[#00c8ff]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">Forgot Password</h2>
        <p className="mt-1 text-xs text-slate-400">
          Enter your email address to receive a password reset link
        </p>
      </div>

      {sent ? (
        <div className="space-y-4 text-center">
          <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-xs text-cyan-200">
            A password reset link has been dispatched to <strong>{email}</strong>. Please check your inbox or spam folder.
          </div>
          <Link
            to="/reset-password"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00c8ff] hover:underline"
          >
            Demo: Go to Reset Password screen &rarr;
          </Link>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
            >
              <ArrowLeft size={13} />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
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

          {/* Send Reset Link Button */}
          <Button
            type="submit"
            className="w-full bg-[#0070f3] hover:bg-[#005ed4] text-white py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-600/40 transition flex items-center justify-center gap-2 mt-2"
            loading={loading}
          >
            <span>Send Reset Link</span>
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
      )}
    </AuthShell>
  )
}

