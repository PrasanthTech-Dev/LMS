import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'

export interface FeatureItem {
  text: string
  icon?: ReactNode
}

export interface AuthShellProps {
  badge: string
  titleLine1: string
  titleLine2: string
  subtitle: string
  features?: FeatureItem[]
  artImage?: string
  artAlt?: string
  topRightAction: {
    label?: string
    linkText: string
    to: string
  }
  children: ReactNode
}

export const AuthShell = ({
  badge,
  titleLine1,
  titleLine2,
  subtitle,
  features,
  artImage,
  artAlt,
  topRightAction,
  children,
}: AuthShellProps) => {
  return (
    <div className="relative min-h-screen bg-[#030712] text-white flex flex-col justify-between overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Deep space ambient radial glows */}
      <div className="pointer-events-none absolute left-[28%] top-[8%] h-[550px] w-[650px] -translate-x-1/2 rounded-full bg-[#0066ff]/25 blur-[150px]" />
      <div className="pointer-events-none absolute left-[38%] top-[30%] h-[380px] w-[480px] -translate-x-1/2 rounded-full bg-[#00c8ff]/18 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-20 right-[15%] h-[420px] w-[500px] rounded-full bg-[#0055ff]/15 blur-[140px]" />

      {/* 2. Twinkling star / sparkle dots */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <span className="absolute left-[12%] top-[18%] h-1 w-1 rounded-full bg-cyan-300 opacity-60 shadow-[0_0_8px_#00c8ff] animate-pulse" />
        <span className="absolute left-[28%] top-[14%] h-1.5 w-1.5 rounded-full bg-white opacity-70 shadow-[0_0_10px_#ffffff]" />
        <span className="absolute left-[42%] top-[22%] h-1 w-1 rounded-full bg-cyan-400 opacity-80 shadow-[0_0_8px_#00c8ff] animate-ping" style={{ animationDuration: '4s' }} />
        <span className="absolute left-[20%] top-[48%] h-1 w-1 rounded-full bg-blue-300 opacity-50 shadow-[0_0_6px_#0070f3]" />
        <span className="absolute left-[34%] top-[65%] h-1.5 w-1.5 rounded-full bg-cyan-200 opacity-75 shadow-[0_0_8px_#00c8ff]" />
        <span className="absolute left-[48%] top-[55%] h-1 w-1 rounded-full bg-white opacity-60 shadow-[0_0_6px_#ffffff] animate-pulse" />
      </div>

      {/* 3. Glowing curved ribbon waves at the bottom (matching reference image) */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-44 sm:h-56 overflow-hidden z-0">
        <svg
          viewBox="0 0 1440 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveCyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.5" />
              <stop offset="25%" stopColor="#0070f3" stopOpacity="0.38" />
              <stop offset="70%" stopColor="#0040c0" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#00d2ff" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="waveStrokeCyan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.95" />
              <stop offset="20%" stopColor="#00c8ff" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#0066ff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#00d2ff" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="waveBlueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#003cd2" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#001864" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0055ff" stopOpacity="0.35" />
            </linearGradient>
            <filter id="neonWaveGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Back deep blue wave */}
          <path
            d="M0,170 C300,90 520,210 820,135 C1100,65 1280,185 1440,115 L1440,240 L0,240 Z"
            fill="url(#waveBlueGrad)"
          />
          {/* Front glowing cyan wave */}
          <path
            d="M0,195 C220,115 440,225 720,155 C980,85 1200,205 1440,135 L1440,240 L0,240 Z"
            fill="url(#waveCyanGrad)"
          />
          {/* Neon crest stroke */}
          <path
            d="M0,195 C220,115 440,225 720,155 C980,85 1200,205 1440,135"
            stroke="url(#waveStrokeCyan)"
            strokeWidth="2.5"
            filter="url(#neonWaveGlow)"
            fill="none"
          />
        </svg>
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.04] bg-[#030712]/75 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
          {/* Logo */}
          <Logo />

          {/* Center Navigation Links */}
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main Navigation">
            <Link to="/" className="text-xs font-medium text-slate-300 hover:text-white transition">
              Home
            </Link>
            <Link to="/courses" className="flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-white transition">
              Courses <ChevronDown size={12} className="opacity-80" />
            </Link>
            <Link to="/instructors" className="text-xs font-medium text-slate-300 hover:text-white transition">
              Instructors
            </Link>
            <a href="/#about" className="text-xs font-medium text-slate-300 hover:text-white transition">
              About
            </a>
            <a href="/#reviews" className="text-xs font-medium text-slate-300 hover:text-white transition">
              Reviews
            </a>
            <a href="/#contact" className="text-xs font-medium text-slate-300 hover:text-white transition">
              Contact
            </a>
          </nav>

          {/* Top Right Action Link */}
          <div className="text-xs">
            {topRightAction.label && (
              <span className="text-slate-400 mr-1.5 hidden sm:inline">
                {topRightAction.label}
              </span>
            )}
            <Link
              to={topRightAction.to}
              className="font-semibold text-[#00c8ff] hover:text-cyan-300 hover:underline transition"
            >
              {topRightAction.linkText}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center py-6 sm:py-10">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-6 xl:gap-8">
            {/* Left & Center Section: Headline, Features, and optional 3D Art */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 xl:col-span-7"
            >
              <div
                className={`flex flex-col ${
                  artImage
                    ? 'lg:flex-row items-center lg:items-center justify-between gap-6 xl:gap-8'
                    : 'items-start justify-center max-w-xl'
                }`}
              >
                {/* Text and Feature Bullets Column */}
                <div
                  className={`w-full ${
                    artImage
                      ? 'lg:max-w-xs xl:max-w-sm shrink-0'
                      : 'max-w-xl'
                  } flex flex-col justify-center`}
                >
                  {/* Pill Badge */}
                  <div className="inline-flex self-start items-center rounded-full border border-cyan-400/40 bg-[#071330]/90 px-3.5 py-1 text-[11px] font-semibold text-[#00c8ff] shadow-[0_0_15px_rgba(0,200,255,0.25)] backdrop-blur-md">
                    {badge}
                  </div>

                  {/* Big Heading */}
                  <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-[1.12]">
                    {titleLine1} <br />
                    <span className="text-[#00c8ff] drop-shadow-[0_0_30px_rgba(0,200,255,0.45)]">
                      {titleLine2}
                    </span>
                  </h1>

                  {/* Subtitle */}
                  <p className="mt-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                    {subtitle}
                  </p>

                  {/* Feature Bullets List (with custom rounded squircle icons) */}
                  {features && features.length > 0 && (
                    <div className="mt-6 sm:mt-8 space-y-3.5 sm:space-y-4">
                      {features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-gradient-to-br from-[#00c8ff]/25 to-[#0070f3]/25 border border-cyan-400/40 text-[#00c8ff] shadow-[0_0_12px_rgba(0,200,255,0.25)] shrink-0">
                            {feat.icon}
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-slate-200">
                            {feat.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3D Art Graphic (only rendered when artImage is passed) */}
                {artImage && (
                  <div className="relative flex items-center justify-center w-full lg:w-auto shrink-0">
                    <div className="relative w-56 sm:w-64 md:w-72 lg:w-72 xl:w-84 max-w-full">
                      {/* Glowing backlight behind art */}
                      <div className="absolute inset-4 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
                      <img
                        src={artImage}
                        alt={artAlt || ''}
                        className="relative w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right Column: Form Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end"
            >
              <div className="w-full max-w-md rounded-3xl border border-blue-500/25 bg-[#060e24]/95 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(0,112,243,0.18)] backdrop-blur-xl">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 border-t border-white/[0.04] py-3.5 text-center text-xs text-slate-500">
        © 2026 EduLearn. All rights reserved.
      </footer>
    </div>
  )
}
