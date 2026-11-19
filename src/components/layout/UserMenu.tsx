import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, LayoutDashboard, LogOut, UserRound } from 'lucide-react'
import { initials } from '@/utils/helpers'
import { useAppDispatch, useAppSelector } from '@/store'
import { logout } from '@/store/slices'
import { dashboardPath } from '@/utils/routes'

export const UserMenu = () => {
  const user = useAppSelector((s) => s.auth.user)
  const dispatch = useAppDispatch()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  if (!user) return null
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="User menu"
        className="flex items-center gap-2 rounded-full p-0.5 transition hover:opacity-90 active:scale-95 cursor-pointer"
      >
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0284c7] to-[#38bdf8] text-xs font-bold text-white shadow-sm ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#030712]">
          {initials(user.name)}
        </div>
        <span className="hidden text-sm font-medium text-white md:block">{user.name.split(' ')[0]}</span>
        <ChevronDown size={15} className="hidden text-slate-400 md:block" />
      </button>
      {open && (
        <div className="card absolute right-0 top-12 z-50 w-56 overflow-hidden bg-ink-850 py-1 shadow-2xl">
          <div className="border-b border-white/[0.06] px-4 py-3">
            <p className="truncate text-sm font-medium text-white">{user.name}</p>
            <p className="truncate text-xs capitalize text-slate-400">{user.role} · {user.email}</p>
          </div>
          <Link to={dashboardPath(user.role)} onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white">
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          {user.role === 'student' && (
            <Link to="/dashboard/profile" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white">
              <UserRound size={16} /> Profile
            </Link>
          )}
          <button
            onClick={() => {
              dispatch(logout())
              nav('/')
            }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      )}
    </div>
  )
}
