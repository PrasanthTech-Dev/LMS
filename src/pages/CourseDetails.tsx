import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Check, ChevronDown, Clock, Download, FileQuestion, FileText, Globe, Heart, PlayCircle, Award, Smartphone, Users, ClipboardList, Lock } from 'lucide-react'
import { Avatar, Badge, Button, ErrorState, Modal, ProgressBar, Rating, Skeleton, Tabs } from '@/components/ui'
import { TextArea, useForm, v } from '@/components/ui/Form'
import { useToast } from '@/components/ui/Toast'
import { useAppDispatch, useAppSelector } from '@/store'
import { addReview, enroll, pushNotification, toggleWishlist } from '@/store/slices'
import { cn, courseLessonIds, courseProgress, formatCompact, formatDate, formatPrice } from '@/utils/helpers'
import type { Lesson } from '@/types'

const lessonIcon = (t: Lesson['type']) => ({ video: PlayCircle, reading: FileText, quiz: FileQuestion, assignment: ClipboardList })[t]

export default function CourseDetails() {
  const { id } = useParams()
  const nav = useNavigate()
  const toast = useToast()
  const dispatch = useAppDispatch()
  const { items, status } = useAppSelector((s) => s.courses)
  const user = useAppSelector((s) => s.auth.user)
  const { enrollments, wishlist } = useAppSelector((s) => s.learning)
  const course = items.find((c) => c.id === id)

  const [tab, setTab] = useState('overview')
  const [open, setOpen] = useState<string[]>(['0'])
  const [checkout, setCheckout] = useState(false)
  const [paying, setPaying] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [stars, setStars] = useState(5)
  const { field, submit, reset } = useForm({ comment: '' }, { comment: [v.required('Review'), v.min(10, 'Review')] })

  const enrollment = useMemo(() => enrollments.find((e) => e.courseId === id && e.userId === user?.id), [enrollments, id, user])
  const wished = !!id && wishlist.includes(id)

  if (!course) {
    if (status === 'loading' || status === 'idle') {
      return <div className="container-x space-y-4 py-12"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-6 w-1/2" /><Skeleton className="h-72 w-full" /></div>
    }
    return <div className="container-x py-16"><ErrorState message="This course could not be found." onRetry={() => nav('/courses')} /></div>
  }

  const totalLessons = courseLessonIds(course).length
  const progress = courseProgress(course, enrollment)
  const discount = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
  const ratingBars = [5, 4, 3, 2, 1].map((s) => ({ s, pct: course.reviews.length ? Math.round((course.reviews.filter((r) => Math.round(r.rating) === s).length / course.reviews.length) * 100) : 0 }))

  const requireLogin = () => {
    toast('Please log in to continue', 'info')
    nav('/login', { state: { from: `/courses/${course.id}` } })
  }
  const startCheckout = () => {
    if (!user) return requireLogin()
    if (user.role !== 'student') return toast('Only student accounts can enrol in courses', 'info')
    setCheckout(true)
  }
  const pay = async () => {
    setPaying(true)
    await new Promise((r) => setTimeout(r, 1100))
    dispatch(enroll({ courseId: course.id, userId: user!.id }))
    dispatch(pushNotification({ title: 'Enrolment confirmed', message: `You are now enrolled in ${course.title}.`, type: 'success' }))
    setPaying(false)
    setCheckout(false)
    toast('Enrolled successfully! Happy learning 🎉')
    nav(`/learn/${course.id}`)
  }
  const onWish = () => {
    if (!user) return requireLogin()
    dispatch(toggleWishlist(course.id))
    toast(wished ? 'Removed from wishlist' : 'Added to wishlist', wished ? 'info' : 'success')
  }
  const onReview = submit((vals) => {
    dispatch(addReview({ courseId: course.id, review: { id: `r${Date.now()}`, user: user!.name, rating: stars, comment: vals.comment, date: new Date().toISOString().slice(0, 10) } }))
    toast('Thanks for your review!')
    reset()
    setReviewOpen(false)
  })

  const CTA = (
    <div className="space-y-3">
      {enrollment ? (
        <>
          <div>
            <div className="mb-1.5 flex justify-between text-xs text-slate-400"><span>Your progress</span><span>{progress}%</span></div>
            <ProgressBar value={progress} />
          </div>
          <Link to={`/learn/${course.id}`}><Button size="lg" className="w-full" icon={<PlayCircle size={18} />}>{progress === 0 ? 'Start learning' : progress === 100 ? 'Review course' : 'Continue learning'}</Button></Link>
        </>
      ) : (
        <>
          <Button size="lg" className="w-full" onClick={startCheckout}>Enrol now</Button>
          <Link to="/pricing" className="block"><Button variant="outline" className="w-full">Or get a subscription</Button></Link>
        </>
      )}
      <Button variant="ghost" className="w-full" onClick={onWish} icon={<Heart size={16} className={cn(wished && 'fill-red-500 text-red-500')} />}>
        {wished ? 'Saved to wishlist' : 'Add to wishlist'}
      </Button>
    </div>
  )

  return (
    <>
      {/* Header */}
      <section className="border-b border-white/[0.06] bg-gradient-to-b from-brand-700/10 to-transparent">
        <div className="container-x grid gap-8 py-10 lg:grid-cols-[1fr_22rem] lg:py-14">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
              <Link to="/courses" className="hover:text-white">Courses</Link> <span>/</span> <Link to={`/courses?category=${encodeURIComponent(course.category)}`} className="hover:text-white">{course.category}</Link>
            </nav>
            <div className="mb-3 flex flex-wrap gap-2">
              {course.bestseller && <Badge tone="amber">Bestseller</Badge>}
              <Badge>{course.level}</Badge>
              {course.tags.map((t) => <Badge key={t} tone="slate">{t}</Badge>)}
            </div>
            <h1 className="text-3xl leading-tight sm:text-4xl">{course.title}</h1>
            <p className="mt-3 max-w-3xl text-lg text-slate-300">{course.subtitle}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
              <Rating value={course.rating} count={course.reviewCount} />
              <span className="inline-flex items-center gap-1.5"><Users size={15} /> {formatCompact(course.students)} students</span>
              <span className="inline-flex items-center gap-1.5"><Clock size={15} /> {course.duration} hours</span>
              <span className="inline-flex items-center gap-1.5"><Globe size={15} /> {course.language}</span>
            </div>
            <p className="mt-3 text-sm text-slate-400">Created by <span className="font-medium text-brand-300">{course.instructorName}</span> · Updated {formatDate(course.updatedAt)}</p>
          </motion.div>

          {/* Sticky purchase card (desktop) */}
          <aside className="hidden lg:block">
            <div className="card sticky top-24 overflow-hidden shadow-2xl shadow-brand-600/10">
              <img src={course.thumbnail} alt="" className="aspect-video w-full object-cover" />
              <div className="space-y-4 p-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">{formatPrice(course.price)}</span>
                  <span className="text-slate-500 line-through">{formatPrice(course.originalPrice)}</span>
                  <Badge tone="green">{discount}% off</Badge>
                </div>
                {CTA}
                <ul className="space-y-2.5 border-t border-white/[0.06] pt-4 text-sm text-slate-300">
                  <li className="flex items-center gap-2.5"><PlayCircle size={16} className="text-brand-400" /> {course.duration} hours on-demand video</li>
                  <li className="flex items-center gap-2.5"><Download size={16} className="text-brand-400" /> {course.materials.length} downloadable resources</li>
                  <li className="flex items-center gap-2.5"><Smartphone size={16} className="text-brand-400" /> Access on mobile and desktop</li>
                  <li className="flex items-center gap-2.5"><Award size={16} className="text-brand-400" /> Certificate of completion</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <div className="container-x grid gap-8 py-10 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0 space-y-8">
          <Tabs value={tab} onChange={setTab} tabs={[{ id: 'overview', label: 'Overview' }, { id: 'curriculum', label: 'Curriculum' }, { id: 'resources', label: 'Resources' }, { id: 'instructor', label: 'Instructor' }, { id: 'reviews', label: `Reviews (${course.reviewCount.toLocaleString()})` }]} />

          {tab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="mb-3 text-xl">About this course</h2>
                <p className="leading-relaxed text-slate-300">{course.description}</p>
              </div>
              <div className="card p-6">
                <h2 className="mb-4 text-xl">What you'll learn</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {course.outcomes.map((o) => <li key={o} className="flex gap-3 text-sm text-slate-300"><Check size={17} className="mt-0.5 shrink-0 text-emerald-400" /> {o}</li>)}
                </ul>
              </div>
              <div>
                <h2 className="mb-3 text-xl">Requirements</h2>
                <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-300 marker:text-brand-400">{course.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
              </div>
            </div>
          )}

          {tab === 'curriculum' && (
            <div>
              <p className="mb-4 text-sm text-slate-400">{course.chapters.length} chapters · {totalLessons} lessons · {course.duration}h total</p>
              <div className="space-y-3">
                {course.chapters.map((ch, ci) => {
                  const isOpen = open.includes(String(ci))
                  return (
                    <div key={ch.id} className="card overflow-hidden">
                      <button onClick={() => setOpen((o) => (isOpen ? o.filter((x) => x !== String(ci)) : [...o, String(ci)]))} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-white/[0.02]">
                        <span><span className="block text-xs text-brand-400">Chapter {ci + 1}</span><span className="font-medium text-white">{ch.title}</span></span>
                        <span className="flex items-center gap-3 text-xs text-slate-500">{ch.lessons.length} lessons <ChevronDown size={18} className={cn('transition', isOpen && 'rotate-180')} /></span>
                      </button>
                      {isOpen && (
                        <ul className="border-t border-white/[0.06]">
                          {ch.lessons.map((l) => {
                            const Icon = lessonIcon(l.type)
                            const done = enrollment?.completedLessons.includes(l.id)
                            return (
                              <li key={l.id} className="flex items-center gap-3 px-5 py-3 text-sm text-slate-300">
                                {done ? <Check size={16} className="text-emerald-400" /> : <Icon size={16} className="text-slate-500" />}
                                <span className="flex-1">{l.title}</span>
                                {l.preview && !enrollment && <Badge tone="cyan">Preview</Badge>}
                                {!l.preview && !enrollment && <Lock size={13} className="text-slate-600" />}
                                <span className="text-xs text-slate-500">{l.duration}m</span>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {tab === 'resources' && (
            <div>
              <h2 className="mb-4 text-xl">Downloadable study materials</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {course.materials.map((m) => (
                  <div key={m.id} className="card flex items-center gap-3 p-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-xs font-bold text-brand-300">{m.type}</span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-white">{m.name}</span><span className="text-xs text-slate-500">{m.size}</span></span>
                    {enrollment ? <Download size={17} className="text-brand-400" /> : <Lock size={15} className="text-slate-600" />}
                  </div>
                ))}
              </div>
              {!enrollment && <p className="mt-4 text-sm text-slate-500">Enrol in this course to download all resources.</p>}
            </div>
          )}

          {tab === 'instructor' && (
            <div className="card flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:text-left">
              <Avatar name={course.instructorName} size={88} />
              <div>
                <h2 className="text-xl">{course.instructorName}</h2>
                <p className="mt-1 text-sm text-slate-400">Senior instructor · {course.category}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">Industry practitioner with years of hands-on experience, teaching through real projects, clear explanations and practical exercises.</p>
                <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-slate-400 sm:justify-start"><span>{formatCompact(course.students)} students</span><span>{course.rating.toFixed(1)} rating</span><span>{course.reviewCount.toLocaleString()} reviews</span></div>
              </div>
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-6">
              <div className="card grid gap-6 p-6 sm:grid-cols-[10rem_1fr]">
                <div className="text-center">
                  <p className="text-5xl font-bold text-white">{course.rating.toFixed(1)}</p>
                  <div className="mt-2 flex justify-center"><Rating value={course.rating} /></div>
                  <p className="mt-1 text-xs text-slate-500">Course rating</p>
                </div>
                <div className="space-y-2">
                  {ratingBars.map((b) => (
                    <div key={b.s} className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="w-8">{b.s} ★</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-700"><div className="h-full rounded-full bg-amber-400" style={{ width: `${b.pct}%` }} /></div>
                      <span className="w-9 text-right">{b.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              {enrollment && <Button variant="outline" onClick={() => setReviewOpen(true)}>Write a review</Button>}
              <div className="space-y-4">
                {course.reviews.map((r) => (
                  <div key={r.id} className="card p-5">
                    <div className="flex items-center justify-between"><span className="font-medium text-white">{r.user}</span><span className="text-xs text-slate-500">{formatDate(r.date)}</span></div>
                    <div className="mt-1"><Rating value={r.rating} size={13} /></div>
                    <p className="mt-3 text-sm text-slate-300">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile purchase block */}
        <div className="lg:hidden">
          <div className="card space-y-4 p-5">
            <div className="flex items-baseline gap-2"><span className="text-3xl font-bold text-white">{formatPrice(course.price)}</span><span className="text-slate-500 line-through">{formatPrice(course.originalPrice)}</span><Badge tone="green">{discount}% off</Badge></div>
            {CTA}
          </div>
        </div>
      </div>

      {/* Checkout */}
      <Modal open={checkout} onClose={() => !paying && setCheckout(false)} title="Complete enrolment">
        <div className="space-y-4">
          <div className="flex gap-3 rounded-xl bg-ink-900 p-3">
            <img src={course.thumbnail} alt="" className="h-16 w-28 rounded-lg object-cover" />
            <div className="min-w-0"><p className="line-clamp-2 text-sm font-medium text-white">{course.title}</p><p className="text-xs text-slate-500">{course.instructorName}</p></div>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-400"><dt>Original price</dt><dd className="line-through">{formatPrice(course.originalPrice)}</dd></div>
            <div className="flex justify-between text-emerald-400"><dt>Discount ({discount}%)</dt><dd>-{formatPrice(course.originalPrice - course.price)}</dd></div>
            <div className="flex justify-between border-t border-white/[0.06] pt-3 text-base font-semibold text-white"><dt>Total</dt><dd>{formatPrice(course.price)}</dd></div>
          </dl>
          <p className="flex items-center gap-2 text-xs text-slate-500"><BookOpen size={14} /> Demo checkout — no real payment is processed.</p>
          <Button size="lg" className="w-full" loading={paying} onClick={pay}>Pay {formatPrice(course.price)} & enrol</Button>
        </div>
      </Modal>

      {/* Review */}
      <Modal open={reviewOpen} onClose={() => setReviewOpen(false)} title="Write a review">
        <form onSubmit={onReview} noValidate className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-slate-300">Your rating</p>
            <div className="flex gap-1" role="radiogroup" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} onClick={() => setStars(n)} role="radio" aria-checked={stars === n} aria-label={`${n} stars`} className={cn('text-2xl transition', n <= stars ? 'text-amber-400' : 'text-slate-600')}>★</button>
              ))}
            </div>
          </div>
          <TextArea label="Your review" placeholder="Share your experience with this course..." {...field('comment')} />
          <Button type="submit" className="w-full">Submit review</Button>
        </form>
      </Modal>
    </>
  )
}
