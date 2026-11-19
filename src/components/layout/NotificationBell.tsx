import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, CheckCheck } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store'
import { markAllRead, markRead } from '@/store/slices'
import { timeAgo, cn } from '@/utils/helpers'

export const NotificationBell = () => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  const items = useAppSelector((s) => s.notifications)
  const unread = items.filter((n) => !n.read).length

  useEffect(() => {
    const h = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-[#0c1833] text-slate-200 transition hover:border-cyan-500/40 hover:bg-[#102046] hover:text-white active:scale-95 cursor-pointer shadow-sm"
      >
        <Bell size={18} className="text-slate-200" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-[#ef4444] px-1 text-[10px] font-bold text-white ring-2 ring-[#030712] shadow-sm">
            {unread}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="card fixed inset-x-3 top-16 z-50 overflow-hidden bg-ink-850 shadow-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-96"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <h4 className="text-sm">Notifications</h4>
              <button onClick={() => dispatch(markAllRead())} className="inline-flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300">
                <CheckCheck size={14} /> Mark all read
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {items.length === 0 && <p className="p-6 text-center text-sm text-slate-500">You're all caught up.</p>}
              {items.slice(0, 5).map((n) => (
                <button
                  key={n.id}
                  onClick={() => dispatch(markRead(n.id))}
                  className={cn('flex w-full gap-3 border-b border-white/[0.04] px-4 py-3 text-left transition hover:bg-white/[0.03]', !n.read && 'bg-brand-500/5')}
                >
                  <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.read ? 'bg-transparent' : 'bg-brand-500')} />
                  <span>
                    <span className="block text-sm font-medium text-white">{n.title}</span>
                    <span className="block text-xs text-slate-400">{n.message}</span>
                    <span className="mt-1 block text-[11px] text-slate-500">{timeAgo(n.createdAt)}</span>
                  </span>
                </button>
              ))}
            </div>
            <Link to="/dashboard/notifications" onClick={() => setOpen(false)} className="block px-4 py-3 text-center text-sm text-brand-400 hover:bg-white/[0.03]">
              View all notifications
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
