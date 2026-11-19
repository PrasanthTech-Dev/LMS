import { useEffect, useState, type ReactNode } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'
import { Avatar } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { logout } from '@/store/slices'
import { Logo } from './Logo'
import { NotificationBell } from './NotificationBell'
import { UserMenu } from './UserMenu'
import { cn } from '@/utils/helpers'

export interface NavItem {
  to: string
  label: string
  icon: ReactNode
  end?: boolean
}

export const DashboardLayout = ({ items, section }: { items: NavItem[]; section: string }) => {
  const [open, setOpen] = useState(false)
  const user = useAppSelector((s) => s.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const activeItem = items.find((i) => (i.end ? location.pathname === i.to : location.pathname.startsWith(i.to)))
  const pageTitle = activeItem?.label ?? 'Overview'

  // Lock body scroll when mobile slide drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const nav = (
    <nav className="flex flex-col gap-1 p-3" aria-label={section}>
      {user && (
        <div className="mb-2 flex flex-col items-center rounded-2xl border border-brand-500/15 bg-ink-850 p-4 text-center">
          <Avatar name={user.name} size={56} />
          <p className="mt-2 max-w-full truncate text-sm font-semibold text-white">{user.name}</p>
          <p className="text-xs capitalize text-slate-400">{user.role}</p>
        </div>
      )}
      <p className="px-3 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{section}</p>
      {items.map((i) => (
        <NavLink
          key={i.to}
          to={i.to}
          end={i.end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
              isActive ? 'bg-brand-600/15 text-brand-300 ring-1 ring-brand-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white',
            )
          }
        >
          {i.icon}
          {i.label}
        </NavLink>
      ))}
      <button onClick={() => { dispatch(logout()); navigate('/') }} className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10">
        <LogOut className="h-[18px] w-[18px]" /> Logout
      </button>
    </nav>
  )

  return (
    <div className="h-screen w-full overflow-hidden lg:grid lg:grid-cols-[17rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden h-screen flex-col overflow-y-auto overflow-x-hidden border-r border-white/[0.06] bg-ink-900/70 lg:flex">
        <div className="flex h-16 shrink-0 items-center px-5"><Logo /></div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden">{nav}</div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col overflow-hidden border-r border-white/[0.06] bg-ink-900 shadow-2xl">
            <div className="flex h-16 shrink-0 items-center justify-between px-5 border-b border-white/[0.04]">
              <Logo />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-lg p-1 text-slate-400 hover:bg-white/5 hover:text-white cursor-pointer"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden">{nav}</div>
          </aside>
        </div>
      )}

      <div className="flex h-screen min-w-0 flex-col overflow-hidden">
        <header className="sticky top-0 shrink-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-ink-950/90 px-3 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/5 active:scale-95 lg:hidden cursor-pointer"
            >
              <Menu size={22} className="stroke-[2.5]" />
            </button>
          </div>

          {/* Center page title on mobile view */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none lg:hidden">
            <h1 className="text-lg font-bold tracking-tight text-white">{pageTitle}</h1>
          </div>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-2.5 sm:gap-3">
            <NotificationBell />
            <UserMenu />
          </div>
        </header>

        {/* Content container: scrollable only within this section */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
