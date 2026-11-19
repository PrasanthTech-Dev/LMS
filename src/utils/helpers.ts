import type { Course, Enrollment } from '@/types'

export const cn = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ')

export const formatPrice = (n: number) => (n === 0 ? 'Free' : `$${n.toLocaleString('en-US')}`)

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

export const timeAgo = (iso: string) => {
  const diff = (new Date('2026-11-16T12:00:00').getTime() - new Date(iso).getTime()) / 1000
  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)}d ago`
  return formatDate(iso)
}

export const formatCompact = (n: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

export const courseLessonIds = (c: Course) => c.chapters.flatMap((ch) => ch.lessons.map((l) => l.id))

export const courseProgress = (c: Course, e?: Enrollment) => {
  const total = courseLessonIds(c).length
  if (!e || total === 0) return 0
  return Math.round((e.completedLessons.length / total) * 100)
}

export const initials = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
