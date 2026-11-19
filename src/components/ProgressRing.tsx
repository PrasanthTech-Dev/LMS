import { useId } from 'react'
import { motion } from 'framer-motion'

export const ProgressRing = ({ value, size = 120, stroke = 11, label }: { value: number; size?: number; stroke?: number; label?: string }) => {
  const id = useId()
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }} role="img" aria-label={`${value}% complete`}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2563eb" /><stop offset="1" stopColor="#38bdf8" /></linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#12275a" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#${id})`} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - value / 100) }} transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <span className="absolute text-center">
        <span className="block text-2xl font-bold text-white" style={{ fontSize: size * 0.22 }}>{value}%</span>
        {label && <span className="block text-[10px] text-slate-400">{label}</span>}
      </span>
    </div>
  )
}
