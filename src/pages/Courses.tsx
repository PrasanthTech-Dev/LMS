import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BarChart3, Brain, Briefcase, Cloud, Code2, Filter, LayoutGrid, Palette, Search, SearchX, Shield, Smartphone, X } from 'lucide-react'
import { Button, CourseCardSkeleton, EmptyState, ErrorState } from '@/components/ui'
import { CourseCard } from '@/components/CourseCard'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchCourses } from '@/store/slices'
import { categories } from '@/data/mock'
import { cn } from '@/utils/helpers'

const catIcon = [Code2, BarChart3, Palette, Smartphone, Cloud, Shield, Briefcase, Brain]
const levels = ['Beginner', 'Intermediate', 'Advanced']
const sorts = [
  { id: 'popular', label: 'Popular' },
  { id: 'rating', label: 'Highest rated' },
  { id: 'new', label: 'Newest' },
  { id: 'low', label: 'Price: low to high' },
  { id: 'high', label: 'Price: high to low' },
]
const priceRanges = [
  { id: 'all', label: 'Any price' },
  { id: 'u40', label: 'Under $40' },
  { id: '40-70', label: '$40 – $70' },
  { id: 'o70', label: 'Above $70' },
]

export default function Courses() {
  const dispatch = useAppDispatch()
  const { items, status, error } = useAppSelector((s) => s.courses)
  const [params, setParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showFilters])

  const q = params.get('q') ?? ''
  const category = params.get('category') ?? ''
  const level = params.get('level') ?? ''
  const price = params.get('price') ?? 'all'
  const minRating = Number(params.get('rating') ?? 0)
  const sort = params.get('sort') ?? 'popular'

  const setParam = (k: string, val: string) => {
    const next = new URLSearchParams(params)
    if (val && val !== 'all' && val !== '0') next.set(k, val)
    else next.delete(k)
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    let list = items.filter((c) => c.status === 'published')
    const t = q.trim().toLowerCase()
    if (t) list = list.filter((c) => [c.title, c.subtitle, c.instructorName, c.category, ...c.tags].join(' ').toLowerCase().includes(t))
    if (category) list = list.filter((c) => c.category === category)
    if (level) list = list.filter((c) => c.level === level)
    if (minRating) list = list.filter((c) => c.rating >= minRating)
    if (price === 'u40') list = list.filter((c) => c.price < 40)
    if (price === '40-70') list = list.filter((c) => c.price >= 40 && c.price <= 70)
    if (price === 'o70') list = list.filter((c) => c.price > 70)
    const s = [...list]
    if (sort === 'popular') s.sort((a, b) => b.students - a.students)
    if (sort === 'rating') s.sort((a, b) => b.rating - a.rating)
    if (sort === 'new') s.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    if (sort === 'low') s.sort((a, b) => a.price - b.price)
    if (sort === 'high') s.sort((a, b) => b.price - a.price)
    return s
  }, [items, q, category, level, price, minRating, sort])

  const hasFilters = !!(q || category || level || minRating || price !== 'all')
  const loading = status === 'loading' || status === 'idle'

  const Radio = ({ name, value, label, current }: { name: string; value: string; label: string; current: string }) => (
    <label className={cn('flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition hover:bg-white/5', current === value ? 'text-white' : 'text-slate-400')}>
      <input type="radio" name={name} checked={current === value} onChange={() => setParam(name, value)} className="h-4 w-4 accent-brand-500" />
      {label}
    </label>
  )

  const catButton = (value: string, label: string, Icon: typeof Code2) => (
    <button key={label} onClick={() => setParam('category', value)} aria-pressed={category === value} className={cn('flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition', category === value ? 'bg-brand-600 font-medium text-white shadow-lg shadow-brand-600/25' : 'text-slate-400 hover:bg-white/5 hover:text-white')}>
      <Icon size={16} /> {label}
    </button>
  )

  const filters = (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 px-1 text-sm">Categories</h4>
        <div className="space-y-1">
          {catButton('', 'All Categories', LayoutGrid)}
          {categories.map((c, i) => catButton(c, c, catIcon[i]))}
        </div>
      </div>
      <div>
        <h4 className="mb-2 px-1 text-sm">Level</h4>
        <Radio name="level" value="" label="All levels" current={level} />
        {levels.map((l) => <Radio key={l} name="level" value={l} label={l} current={level} />)}
      </div>
      <div>
        <h4 className="mb-2 px-1 text-sm">Price</h4>
        {priceRanges.map((p) => <Radio key={p.id} name="price" value={p.id} label={p.label} current={price} />)}
      </div>
      <div>
        <h4 className="mb-2 px-1 text-sm">Rating</h4>
        {[0, 4.5, 4.0].map((r) => <Radio key={r} name="rating" value={String(r)} label={r === 0 ? 'Any rating' : `${r} & up`} current={String(minRating)} />)}
      </div>
    </div>
  )

  return (
    <div className="container-x py-10">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl">Our Courses</h1>
          {!loading && status !== 'failed' && <p className="mt-1 text-sm text-slate-400">Showing 1-{filtered.length} of {filtered.length} courses</p>}
        </div>
        <div className="flex flex-1 flex-col gap-3 sm:flex-row lg:max-w-2xl lg:justify-end">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={q} onChange={(e) => setParam('q', e.target.value)} placeholder="Search courses..." aria-label="Search courses" className="input pl-10" />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-400">
            Sort by:
            <select value={sort} onChange={(e) => setParam('sort', e.target.value)} aria-label="Sort courses" className="input w-40">
              {sorts.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </label>
          <Button variant="outline" className="lg:hidden" icon={<Filter size={16} />} onClick={() => setShowFilters(true)}>Filters</Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[15rem_1fr]">
        <aside className="hidden lg:block">
          <div className="card sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto p-4">{filters}</div>
        </aside>

        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/70" onClick={() => setShowFilters(false)} />
            <div className="absolute bottom-0 max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-ink-850 p-5">
              <div className="mb-4 flex items-center justify-between"><h3>Filters</h3><button onClick={() => setShowFilters(false)} aria-label="Close filters"><X size={20} /></button></div>
              {filters}
              <Button className="mt-6 w-full" onClick={() => setShowFilters(false)}>Show {filtered.length} courses</Button>
            </div>
          </div>
        )}

        <section aria-live="polite">
          {hasFilters && !loading && <div className="mb-4 text-right text-sm"><button onClick={() => setParams({}, { replace: true })} className="text-brand-400 hover:text-brand-300">Clear all filters</button></div>}
          {status === 'failed' ? (
            <ErrorState message={error ?? 'Failed to load courses'} onRetry={() => dispatch(fetchCourses())} />
          ) : loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)}</div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={<SearchX size={26} />} title="No courses match your filters" message="Try a different keyword or clear some filters to see more results." action={<Button variant="outline" onClick={() => setParams({}, { replace: true })}>Reset filters</Button>} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}</div>
          )}
        </section>
      </div>
    </div>
  )
}
