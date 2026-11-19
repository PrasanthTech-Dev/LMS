import { useState, useEffect, useRef, type FormEvent } from 'react'
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Send,
  UserRound,
  X,
} from 'lucide-react'
import { Logo } from './Logo'
import { cn, initials } from '@/utils/helpers'
import { useAppDispatch, useAppSelector } from '@/store'
import { logout } from '@/store/slices'
import { dashboardPath } from '@/utils/routes'

// Clean social icons
const FacebookIcon = () => (
  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const YoutubeIcon = () => (
  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

const TwitterIcon = () => (
  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const LinkedinIcon = () => (
  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
)

const InstagramIcon = () => (
  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

type NavKey = 'home' | 'courses' | 'instructors' | 'about' | 'reviews' | 'contact'

const getActiveNavFromLocation = (pathname: string, hash: string): NavKey => {
  if (pathname.startsWith('/courses')) return 'courses'
  if (pathname.startsWith('/instructors')) return 'instructors'
  if (pathname === '/') {
    if (hash === '#about') return 'about'
    if (hash === '#reviews') return 'reviews'
    if (hash === '#contact') return 'contact'
    return 'home'
  }
  return 'home'
}

export const PublicLayout = () => {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const nav = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()

  const [activeNav, setActiveNav] = useState<NavKey>(() =>
    getActiveNavFromLocation(location.pathname, location.hash)
  )
  const isClickScrollingRef = useRef(false)
  const clickTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    setActiveNav(getActiveNavFromLocation(location.pathname, location.hash))
  }, [location.pathname, location.hash])

  // Scroll spy on home page
  useEffect(() => {
    if (location.pathname !== '/') return

    const handleScroll = () => {
      if (isClickScrollingRef.current) return

      const scrollY = window.scrollY
      if (scrollY < 180) {
        setActiveNav('home')
        return
      }

      const aboutEl = document.getElementById('about')
      const reviewsEl = document.getElementById('reviews')
      const contactEl = document.getElementById('contact')

      const navHeight = 90
      const pos = scrollY + navHeight

      const contactTop = contactEl ? contactEl.offsetTop : Infinity
      const reviewsTop = reviewsEl ? reviewsEl.offsetTop : Infinity
      const aboutTop = aboutEl ? aboutEl.offsetTop : Infinity

      if (
        contactEl &&
        (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 100 || pos >= contactTop)
      ) {
        setActiveNav('contact')
      } else if (reviewsEl && pos >= reviewsTop - 60) {
        setActiveNav('reviews')
      } else if (aboutEl && pos >= aboutTop - 60) {
        setActiveNav('about')
      } else {
        setActiveNav('home')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname])

  const user = useAppSelector((s) => s.auth.user)
  const notifications = useAppSelector((s) => s.notifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  // Click outside to close user dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!userMenuRef.current?.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const scrollToSection = (id: string) => {
    setOpen(false)

    const performScroll = () => {
      const el = document.getElementById(id)
      if (el) {
        const navHeight = 72
        const targetPosition = el.getBoundingClientRect().top + window.pageYOffset - navHeight
        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth',
        })
      }
    }

    if (location.pathname !== '/') {
      nav(`/#${id}`)
    } else {
      window.history.pushState(null, '', `#${id}`)
      performScroll()
    }
  }

  const handleNavClick = (key: NavKey) => {
    setActiveNav(key)
    setOpen(false)
    isClickScrollingRef.current = true
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
    clickTimeoutRef.current = window.setTimeout(() => {
      isClickScrollingRef.current = false
    }, 1000)

    if (key === 'home') {
      if (location.pathname !== '/') {
        nav('/')
      } else {
        window.history.pushState(null, '', '/')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }

    if (key === 'courses') {
      nav('/courses')
      return
    }

    if (key === 'instructors') {
      nav('/instructors')
      return
    }

    scrollToSection(key)
  }

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const timer = setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          const navHeight = 72
          const targetPosition = el.getBoundingClientRect().top + window.pageYOffset - navHeight
          window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth',
          })
        }
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [location.pathname, location.hash])

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    if (q.trim()) {
      nav(`/courses?q=${encodeURIComponent(q.trim())}`)
    } else {
      nav('/courses')
    }
    setOpen(false)
  }

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#040a18] text-slate-200">
      {/* ======================================================== */}
      {/* NAVBAR (Exactly matching reference image layout & theme)  */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#03091e]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-10">
          {/* Left: Brand Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden items-center gap-1.5 lg:gap-2 md:flex" aria-label="Main Navigation">
            <Link
              to="/"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault()
                }
                handleNavClick('home')
              }}
              className={cn(
                'rounded-full px-4 py-1 text-xs transition duration-200 cursor-pointer select-none',
                activeNav === 'home'
                  ? 'bg-[#0070f3] text-white font-semibold shadow-sm shadow-blue-500/40'
                  : 'font-medium text-slate-200 hover:text-white'
              )}
            >
              Home
            </Link>

            <Link
              to="/courses"
              onClick={() => handleNavClick('courses')}
              className={cn(
                'rounded-full px-4 py-1 text-xs transition duration-200 cursor-pointer select-none flex items-center gap-1',
                activeNav === 'courses'
                  ? 'bg-[#0070f3] text-white font-semibold shadow-sm shadow-blue-500/40'
                  : 'font-medium text-slate-200 hover:text-white'
              )}
            >
              Courses <ChevronDown size={12} className={activeNav === 'courses' ? 'opacity-100' : 'opacity-80'} />
            </Link>

            <Link
              to="/instructors"
              onClick={() => handleNavClick('instructors')}
              className={cn(
                'rounded-full px-4 py-1 text-xs transition duration-200 cursor-pointer select-none',
                activeNav === 'instructors'
                  ? 'bg-[#0070f3] text-white font-semibold shadow-sm shadow-blue-500/40'
                  : 'font-medium text-slate-200 hover:text-white'
              )}
            >
              Instructors
            </Link>

            <button
              type="button"
              onClick={() => handleNavClick('about')}
              className={cn(
                'rounded-full px-4 py-1 text-xs transition duration-200 cursor-pointer select-none',
                activeNav === 'about'
                  ? 'bg-[#0070f3] text-white font-semibold shadow-sm shadow-blue-500/40'
                  : 'font-medium text-slate-200 hover:text-white'
              )}
            >
              About
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('reviews')}
              className={cn(
                'rounded-full px-4 py-1 text-xs transition duration-200 cursor-pointer select-none',
                activeNav === 'reviews'
                  ? 'bg-[#0070f3] text-white font-semibold shadow-sm shadow-blue-500/40'
                  : 'font-medium text-slate-200 hover:text-white'
              )}
            >
              Reviews
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('contact')}
              className={cn(
                'rounded-full px-4 py-1 text-xs transition duration-200 cursor-pointer select-none',
                activeNav === 'contact'
                  ? 'bg-[#0070f3] text-white font-semibold shadow-sm shadow-blue-500/40'
                  : 'font-medium text-slate-200 hover:text-white'
              )}
            >
              Contact
            </button>
          </nav>

          {/* Right: Search bar, Notification Bell, User Avatar */}
          <div className="flex items-center gap-3 sm:gap-3.5">
            {/* Search Pill Input */}
            <form onSubmit={onSearch} className="relative hidden md:block" role="search">
              <Search
                size={13}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search courses..."
                aria-label="Search courses"
                className="h-8 w-44 lg:w-52 rounded-full border border-blue-500/25 bg-[#091535]/90 pl-8 pr-3 text-xs text-white placeholder:text-slate-400 focus:border-cyan-400 focus:bg-[#0c1a40] focus:outline-none transition"
              />
            </form>

            {/* When NOT logged in: Show "Login" (and "Register") */}
            {!user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-full border border-blue-500/30 bg-[#071330] px-4 py-1.5 text-xs font-semibold text-slate-200 shadow-sm transition hover:border-cyan-400 hover:bg-[#0a1c44] hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex rounded-full bg-[#0070f3] px-4 py-1.5 text-xs font-semibold text-white shadow-sm shadow-blue-500/30 transition hover:bg-[#005cd4]"
                >
                  Register
                </Link>
              </div>
            ) : (
              /* When Logged In: Show Notification Bell + User Avatar & Name */
              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Notification Bell with Badge */}
                <Link
                  to="/dashboard/notifications"
                  className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/[0.08] bg-[#0c1833] text-slate-200 hover:border-cyan-500/40 hover:bg-[#102046] hover:text-white transition shadow-sm"
                  aria-label="Notifications"
                >
                  <Bell size={16} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ef4444] text-[9px] font-bold text-white shadow-sm ring-2 ring-[#03091e]">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Profile Pill with Name & Dropdown */}
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setUserMenuOpen((o) => !o)}
                    aria-label="User profile menu"
                    aria-expanded={userMenuOpen}
                    className="flex items-center gap-2 rounded-full p-0.5 cursor-pointer"
                  >
                    {/* Dynamic User Initial Icon with cyan ring */}
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0284c7] to-[#38bdf8] text-xs font-bold text-white shadow-sm ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#03091e]">
                      {initials(user.name)}
                    </div>
                    <span className="hidden sm:inline-block max-w-[110px] truncate text-xs font-bold text-white">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown size={13} className="hidden sm:block text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-2xl border border-blue-500/25 bg-[#06122e] py-1 shadow-2xl backdrop-blur-xl">
                      <div className="flex items-center gap-2.5 border-b border-white/[0.08] px-4 py-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0066ff] to-[#00d4ff] text-xs font-bold text-white shadow-sm ring-1 ring-cyan-400/60">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-white">{user.name}</p>
                          <p className="truncate text-[11px] capitalize text-cyan-400">
                            {user.role} · {user.email}
                          </p>
                        </div>
                      </div>
                      <Link
                        to={dashboardPath(user.role)}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 transition hover:bg-white/5 hover:text-white"
                      >
                        <LayoutDashboard size={14} className="text-cyan-400" /> Dashboard
                      </Link>
                      {user.role === 'student' && (
                        <Link
                          to="/dashboard/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 transition hover:bg-white/5 hover:text-white"
                        >
                          <UserRound size={14} className="text-cyan-400" /> Profile
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setUserMenuOpen(false)
                          dispatch(logout())
                          nav('/')
                        }}
                        className="flex w-full items-center gap-2.5 px-4 py-2 text-xs text-rose-400 transition hover:bg-rose-500/10 cursor-pointer text-left"
                      >
                        <LogOut size={14} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white/5 md:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {open && (
          <div className="border-t border-white/[0.08] bg-[#03091e] px-4 pb-4 pt-3 md:hidden">
            <form onSubmit={onSearch} className="relative mb-3">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search courses..."
                className="w-full rounded-full border border-blue-500/25 bg-[#091535] py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </form>
            <div className="space-y-1">
              <Link
                to="/"
                onClick={(e) => {
                  setOpen(false)
                  if (location.pathname === '/') {
                    e.preventDefault()
                  }
                  handleNavClick('home')
                }}
                className={cn(
                  'block rounded-full px-4 py-2 text-xs font-semibold transition',
                  activeNav === 'home'
                    ? 'bg-[#0070f3] text-white shadow-sm shadow-blue-500/40'
                    : 'text-slate-300 hover:bg-white/5'
                )}
              >
                Home
              </Link>
              <Link
                to="/courses"
                onClick={() => {
                  setOpen(false)
                  handleNavClick('courses')
                }}
                className={cn(
                  'block rounded-full px-4 py-2 text-xs font-semibold transition',
                  activeNav === 'courses'
                    ? 'bg-[#0070f3] text-white shadow-sm shadow-blue-500/40'
                    : 'text-slate-300 hover:bg-white/5'
                )}
              >
                Courses
              </Link>
              <Link
                to="/instructors"
                onClick={() => {
                  setOpen(false)
                  handleNavClick('instructors')
                }}
                className={cn(
                  'block rounded-full px-4 py-2 text-xs font-semibold transition',
                  activeNav === 'instructors'
                    ? 'bg-[#0070f3] text-white shadow-sm shadow-blue-500/40'
                    : 'text-slate-300 hover:bg-white/5'
                )}
              >
                Instructors
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  handleNavClick('about')
                }}
                className={cn(
                  'block w-full text-left rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer',
                  activeNav === 'about'
                    ? 'bg-[#0070f3] text-white shadow-sm shadow-blue-500/40'
                    : 'text-slate-300 hover:bg-white/5'
                )}
              >
                About
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  handleNavClick('reviews')
                }}
                className={cn(
                  'block w-full text-left rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer',
                  activeNav === 'reviews'
                    ? 'bg-[#0070f3] text-white shadow-sm shadow-blue-500/40'
                    : 'text-slate-300 hover:bg-white/5'
                )}
              >
                Reviews
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  handleNavClick('contact')
                }}
                className={cn(
                  'block w-full text-left rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer',
                  activeNav === 'contact'
                    ? 'bg-[#0070f3] text-white shadow-sm shadow-blue-500/40'
                    : 'text-slate-300 hover:bg-white/5'
                )}
              >
                Contact
              </button>

              {/* Mobile Auth State: Login button or User Profile */}
              {!user ? (
                <div className="mt-3 flex items-center gap-2 border-t border-white/[0.08] pt-3">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-lg border border-blue-500/30 bg-[#071330] py-2 text-center text-xs font-semibold text-white hover:border-cyan-400"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-lg bg-[#0070f3] py-2 text-center text-xs font-semibold text-white hover:bg-[#005cd4]"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="mt-3 border-t border-white/[0.08] pt-3">
                  <div className="flex items-center gap-2.5 px-3 py-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0066ff] to-[#00d4ff] text-xs font-bold text-white shadow-sm ring-1 ring-cyan-400/60">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-cyan-400 capitalize truncate">
                        {user.role} · {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <Link
                      to={dashboardPath(user.role)}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/dashboard/notifications"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-lg px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5"
                    >
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[9px] font-bold text-white">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={() => {
                        setOpen(false)
                        dispatch(logout())
                        nav('/')
                      }}
                      className="block w-full text-left rounded-lg px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer Matching Exact Design */}
      <footer id="contact" className="mt-14 border-t border-white/[0.08] bg-[#030815] scroll-mt-20">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
            {/* Col 1: Brand & Social */}
            <div className="lg:col-span-4">
              <Logo tagline />
              <div className="mt-5 flex items-center gap-2.5">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#081330] text-slate-300 transition hover:bg-[#0070f3] hover:text-white"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#081330] text-slate-300 transition hover:bg-[#ff0000] hover:text-white"
                >
                  <YoutubeIcon />
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#081330] text-slate-300 transition hover:bg-[#1da1f2] hover:text-white"
                >
                  <TwitterIcon />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#081330] text-slate-300 transition hover:bg-[#0077b5] hover:text-white"
                >
                  <LinkedinIcon />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#081330] text-slate-300 transition hover:bg-[#e1306c] hover:text-white"
                >
                  <InstagramIcon />
                </a>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
              <ul className="mt-3.5 space-y-2 text-xs text-slate-400">
                <li><Link to="/" className="transition hover:text-white">Home</Link></li>
                <li><Link to="/courses" className="transition hover:text-white">Courses</Link></li>
                <li><Link to="/instructors" className="transition hover:text-white">Instructors</Link></li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('about')}
                    className="transition hover:text-white cursor-pointer text-left"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('contact')}
                    className="transition hover:text-white cursor-pointer text-left"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Support */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Support</h4>
              <ul className="mt-3.5 space-y-2 text-xs text-slate-400">
                <li><a href="#" className="transition hover:text-white">Help Center</a></li>
                <li><a href="#" className="transition hover:text-white">FAQs</a></li>
                <li><a href="#" className="transition hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="transition hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="transition hover:text-white">Refund Policy</a></li>
              </ul>
            </div>

            {/* Col 4: Newsletter & Apps */}
            <div className="lg:col-span-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Newsletter</h4>
              <p className="mt-1.5 text-xs text-slate-400">
                Subscribe to our newsletter for latest updates and courses.
              </p>

              <form onSubmit={handleSubscribe} className="relative mt-3.5 flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-blue-500/25 bg-[#081330] py-2 pl-3.5 pr-11 text-xs text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1 flex h-7 w-7 items-center justify-center rounded-lg bg-[#0070f3] text-white hover:bg-blue-500 transition shadow-sm"
                >
                  <Send size={12} />
                </button>
              </form>
              {subscribed && (
                <p className="mt-1.5 text-xs text-cyan-400">Thank you for subscribing!</p>
              )}

              {/* App Store / Google Play badges */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {/* Apple App Store */}
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-lg border border-slate-700/80 bg-black/90 px-3 py-1.5 text-left transition hover:border-slate-500"
                >
                  <svg className="h-4.5 w-4.5 fill-current text-white" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.6-7.77-11.74-14.18-6-9.33-10.77-20.17-14.33-32.51-3.56-12.34-5.34-23.77-5.34-34.28 0-14.54 3.79-26.68 11.38-36.43 7.59-9.75 17.2-14.72 28.84-14.92 4.9.11 10.33 1.34 16.29 3.7 5.96 2.36 10.12 3.65 12.49 3.86 1.96-.21 6.35-1.55 13.17-4.01 6.82-2.47 12.52-3.61 17.1-3.44 13.43 1.05 24.08 6.29 31.95 15.7-11.73 7.07-17.48 16.63-17.26 28.69.22 9.68 3.91 17.82 11.08 24.42 7.17 6.6 15.74 10.33 25.72 11.19-2.28 6.85-5.06 13.78-8.34 20.79zM119.22 33.15c0-7.39 2.65-14.35 7.95-20.89 5.3-6.54 11.96-10.87 19.98-13 1.09 7.61-1.3 14.89-7.17 21.84-5.87 6.95-12.79 11.13-20.76 12.05z" />
                  </svg>
                  <div>
                    <div className="text-[8px] uppercase leading-none text-slate-400">Download on the</div>
                    <div className="text-[11px] font-semibold leading-tight text-white">App Store</div>
                  </div>
                </a>

                {/* Google Play Store */}
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-lg border border-slate-700/80 bg-black/90 px-3 py-1.5 text-left transition hover:border-slate-500"
                >
                  <svg className="h-4.5 w-4.5" viewBox="0 0 512 512">
                    <path fill="#fbb03b" d="M26.2 3.7C13.8 10.4 4.8 22.8 4.8 38.3v435.4c0 15.5 9 27.9 21.4 34.6l239.3-254.1L26.2 3.7z" />
                    <path fill="#e2264d" d="M366.1 143.1L265.5 254.2l100.6 111.1 57.6-33.3c16.3-9.5 26.5-26.9 26.5-45.8 0-18.9-10.2-36.3-26.5-45.8l-57.6-33.3z" />
                    <path fill="#439fe0" d="M26.2 508.3c8.9 4.8 19.6 4.9 29.5-.7l310.4-179.3-100.6-111.1L26.2 508.3z" />
                    <path fill="#69ba43" d="M366.1 143.1L55.7 4.4C45.8-1.2 35.1-.9 26.2 3.7l239.3 250.5 100.6-111.1z" />
                  </svg>
                  <div>
                    <div className="text-[8px] uppercase leading-none text-slate-400">GET IT ON</div>
                    <div className="text-[11px] font-semibold leading-tight text-white">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-5 text-xs text-slate-500 sm:flex-row">
            <div>© 2026 EduLearn. All rights reserved.</div>
            <div className="flex items-center gap-5">
              <a href="#" className="hover:text-slate-300 transition">Privacy Policy</a>
              <span className="text-slate-700">|</span>
              <a href="#" className="hover:text-slate-300 transition">Terms of Service</a>
              <span className="text-slate-700">|</span>
              <a href="#" className="hover:text-slate-300 transition">Contact</a>
            </div>
          </div>
        </div>

        {/* Scroll-to-Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-[#0070f3] text-white shadow-lg shadow-blue-600/40 hover:bg-[#005cd4] transition hover:scale-110 active:scale-95"
        >
          <ChevronUp size={19} />
        </button>
      </footer>
    </div>
  )
}
