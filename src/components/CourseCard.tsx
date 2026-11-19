import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Heart, Star, Users } from 'lucide-react'
import type { Course } from '@/types'
import { Badge } from '@/components/ui'
import { useToast } from '@/components/ui/Toast'
import { useAppDispatch, useAppSelector } from '@/store'
import { toggleWishlist } from '@/store/slices'
import { cn, formatCompact, formatPrice } from '@/utils/helpers'

export const CourseCard = ({ course, index = 0 }: { course: Course; index?: number }) => {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const wished = useAppSelector((s) => s.learning.wishlist.includes(course.id))
  const enrolled = useAppSelector((s) => s.learning.enrollments.some((e) => e.courseId === course.id && e.userId === s.auth.user?.id))

  const onWish = () => {
    dispatch(toggleWishlist(course.id))
    toast(wished ? 'Removed from wishlist' : 'Added to wishlist', wished ? 'info' : 'success')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.05 }}
      className="card card-hover group flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-video overflow-hidden bg-ink-800">
        <Link to={`/courses/${course.id}`} tabIndex={-1} aria-hidden="true">
          <img src={course.thumbnail} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex gap-2">
          {course.bestseller && <Badge tone="amber">Bestseller</Badge>}
          <Badge tone="blue">{course.level}</Badge>
        </div>
        <button
          onClick={onWish}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wished}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink-950/70 backdrop-blur transition hover:bg-ink-950"
        >
          <Heart size={17} className={cn(wished ? 'fill-red-500 text-red-500' : 'text-white')} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Link to={`/courses/${course.id}`} className="line-clamp-2 text-base font-semibold leading-snug text-white transition hover:text-brand-300">
          {course.title}
        </Link>
        <p className="mt-1 text-sm text-slate-400">{course.instructorName}</p>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          <Star size={13} className="fill-amber-400 text-amber-400" />
          <span className="font-semibold text-amber-400">{course.rating.toFixed(1)}</span>
          <span>({formatCompact(course.reviewCount)} reviews)</span>
        </p>
        <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1"><Clock size={13} /> {course.duration}h</span>
          <span className="inline-flex items-center gap-1"><Users size={13} /> {formatCompact(course.students)}</span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-white">{formatPrice(course.price)}</span>
            <span className="text-xs text-slate-500 line-through">{formatPrice(course.originalPrice)}</span>
          </p>
          <Link
            to={`/courses/${course.id}`}
            className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-500"
          >
            {enrolled ? 'Continue' : 'Enroll Now'}
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
