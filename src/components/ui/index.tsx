import { forwardRef, useEffect, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { AlertTriangle, Inbox, Loader2, Star, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn, initials } from '@/utils/helpers'

/* ---------- Button ---------- */
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
}
const variants = {
  primary: 'bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-500',
  secondary: 'bg-ink-700 text-slate-100 hover:bg-ink-600',
  ghost: 'text-slate-300 hover:bg-white/5 hover:text-white',
  danger: 'bg-red-500/10 text-red-400 hover:bg-red-500/20',
  outline: 'border border-white/10 text-slate-200 hover:border-brand-500/50 hover:bg-brand-500/10',
}
const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' }

export const Button = forwardRef<HTMLButtonElement, BtnProps>(function Button(
  { variant = 'primary', size = 'md', loading, icon, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </button>
  )
})

/* ---------- Badge ---------- */
export const Badge = ({ children, tone = 'blue', className }: { children: ReactNode; tone?: 'blue' | 'green' | 'amber' | 'red' | 'slate' | 'cyan'; className?: string }) => {
  const tones = {
    blue: 'bg-brand-500/15 text-brand-300 ring-brand-500/20',
    green: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/20',
    amber: 'bg-amber-500/15 text-amber-300 ring-amber-500/20',
    red: 'bg-red-500/15 text-red-300 ring-red-500/20',
    slate: 'bg-slate-500/15 text-slate-300 ring-slate-500/20',
    cyan: 'bg-cyan-500/15 text-cyan-300 ring-cyan-500/20',
  }
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset', tones[tone], className)}>
      {children}
    </span>
  )
}

/* ---------- Rating ---------- */
export const Rating = ({ value, count, size = 14 }: { value: number; count?: number; size?: number }) => (
  <span className="inline-flex items-center gap-1.5 text-sm">
    <span className="font-semibold text-amber-400">{value.toFixed(1)}</span>
    <span className="flex" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'} />
      ))}
    </span>
    {count !== undefined && <span className="text-slate-500">({count.toLocaleString()})</span>}
  </span>
)

/* ---------- ProgressBar ---------- */
export const ProgressBar = ({ value, className }: { value: number; className?: string }) => (
  <div
    role="progressbar"
    aria-valuenow={value}
    aria-valuemin={0}
    aria-valuemax={100}
    className={cn('h-2 w-full overflow-hidden rounded-full bg-ink-700', className)}
  >
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={cn('h-full rounded-full', value === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-brand-600 to-accent-400')}
    />
  </div>
)

/* ---------- Avatar ---------- */
export const Avatar = ({ name, size = 36 }: { name: string; size?: number }) => (
  <span
    style={{ width: size, height: size, fontSize: size * 0.38 }}
    className="inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-accent-500 font-semibold text-white"
  >
    {initials(name)}
  </span>
)

/* ---------- Skeleton / states ---------- */
export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse rounded-lg bg-ink-700/70', className)} />
)

export const CourseCardSkeleton = () => (
  <div className="card overflow-hidden">
    <Skeleton className="aspect-video rounded-none" />
    <div className="space-y-3 p-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-5 w-1/3" />
    </div>
  </div>
)

export const EmptyState = ({ title, message, action, icon }: { title: string; message?: string; action?: ReactNode; icon?: ReactNode }) => (
  <div className="card flex flex-col items-center justify-center px-6 py-14 text-center">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">{icon ?? <Inbox size={26} />}</div>
    <h3 className="text-lg">{title}</h3>
    {message && <p className="mt-1.5 max-w-sm text-sm text-slate-400">{message}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
)

export const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="card flex flex-col items-center px-6 py-14 text-center" role="alert">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
      <AlertTriangle size={26} />
    </div>
    <h3 className="text-lg">Something went wrong</h3>
    <p className="mt-1.5 max-w-sm text-sm text-slate-400">{message}</p>
    {onRetry && (
      <Button className="mt-5" variant="outline" onClick={onRetry}>
        Try again
      </Button>
    )}
  </div>
)

/* ---------- Modal ---------- */
export const Modal = ({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) => {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className={cn('card max-h-[92vh] w-full overflow-y-auto rounded-b-none bg-ink-850 p-5 shadow-2xl sm:rounded-2xl sm:p-6', wide ? 'sm:max-w-2xl' : 'sm:max-w-md')}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg">{title}</h3>
              <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white">
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------- Page header, stat card, tabs ---------- */
export const PageHeader = ({
  title,
  subtitle,
  actions,
  className,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
  className?: string
}) => (
  <div className={cn(actions ? 'mb-4 sm:mb-6' : 'mb-0 sm:mb-6', 'flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between', className)}>
    <div className="hidden sm:block">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2 w-full sm:w-auto">{actions}</div>}
  </div>
)

export const StatCard = ({
  label,
  value,
  icon,
  trend,
  tone = 'blue',
  className,
}: {
  label: string
  value: string
  icon: ReactNode
  trend?: string
  tone?: 'blue' | 'green' | 'cyan' | 'amber'
  className?: string
}) => {
  const tones = {
    blue: 'bg-brand-500/15 text-brand-400',
    green: 'bg-emerald-500/15 text-emerald-400',
    cyan: 'bg-cyan-500/15 text-cyan-400',
    amber: 'bg-amber-500/15 text-amber-400',
  }
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={cn('card p-3.5 sm:p-5', className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-slate-400 sm:text-sm">{label}</p>
          <p className="mt-1 text-lg font-bold text-white sm:mt-2 sm:text-2xl">{value}</p>
          {trend && <p className="mt-1 truncate text-[11px] text-emerald-400 sm:text-xs">{trend}</p>}
        </div>
        <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11', tones[tone])}>{icon}</span>
      </div>
    </motion.div>
  )
}

export const Tabs = ({ tabs, value, onChange }: { tabs: { id: string; label: string }[]; value: string; onChange: (id: string) => void }) => (
  <div role="tablist" className="flex gap-1 overflow-x-auto rounded-xl border border-white/[0.06] bg-ink-900 p-1">
    {tabs.map((t) => (
      <button
        key={t.id}
        role="tab"
        aria-selected={value === t.id}
        onClick={() => onChange(t.id)}
        className={cn(
          'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition',
          value === t.id ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white',
        )}
      >
        {t.label}
      </button>
    ))}
  </div>
)

/* ---------- Compact select filter ---------- */
export const SelectFilter = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} aria-label="Filter" className="input w-full max-w-xs sm:w-auto">
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
)
