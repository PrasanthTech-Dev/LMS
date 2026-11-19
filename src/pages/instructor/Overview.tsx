import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BookOpen, DollarSign, Plus, Users } from 'lucide-react'
import { Avatar, Badge, Button, EmptyState, PageHeader, ProgressBar, SelectFilter, Skeleton, StatCard } from '@/components/ui'
import { ProgressRing } from '@/components/ProgressRing'
import { axisProps, chartTooltip, gridProps } from '@/components/charts'
import { useAppSelector } from '@/store'
import { courseRoster, courseTrend } from '@/utils/analytics'
import { formatCompact, formatDate, formatPrice } from '@/utils/helpers'

const ranges = [
  { value: '2', label: 'Last 30 Days' },
  { value: '3', label: 'Last 90 Days' },
  { value: '6', label: 'Last 6 Months' },
]

export default function InstructorOverview() {
  const user = useAppSelector((s) => s.auth.user)!
  const { items, status } = useAppSelector((s) => s.courses)
  const enrollments = useAppSelector((s) => s.learning.enrollments)
  const [range, setRange] = useState('6')
  const mine = items.filter((c) => c.instructorId === user.id)

  if (status === 'loading' || status === 'idle') return <div className="space-y-4"><Skeleton className="h-10 w-1/3" /><div className="grid gap-4 sm:grid-cols-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)}</div><Skeleton className="h-72" /></div>

  const students = mine.reduce((n, c) => n + c.students, 0)
  const revenue = mine.reduce((n, c) => n + c.students * c.price * 0.7, 0)
  const trend = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((m, i) => ({ month: m, revenue: Math.round(mine.reduce((n, c) => n + (courseTrend(c)[i]?.revenue ?? 0) * 0.7, 0)) })).slice(-Number(range))
  const top = [...mine].sort((a, b) => b.students - a.students)[0]
  const share = top && students ? Math.round((top.students / students) * 100) : 0
  const recent = mine.flatMap((c) => courseRoster(c, enrollments).map((r) => ({ ...r, course: c.title }))).sort((a, b) => b.enrolledAt.localeCompare(a.enrolledAt)).filter((r, i, arr) => arr.findIndex((x) => x.name === r.name) === i).slice(0, 5)

  return (
    <>
      <PageHeader title="Instructor Dashboard" subtitle={`Welcome back, ${user.name.split(' ')[0]}. Here's how your courses are performing.`}
        actions={<><SelectFilter value={range} onChange={setRange} options={ranges} /><Link to="/instructor/courses"><Button icon={<Plus size={16} />}>New course</Button></Link></>} />
      {mine.length === 0 ? (
        <EmptyState icon={<BookOpen size={26} />} title="Create your first course" message="Share your expertise with learners around the world." action={<Link to="/instructor/courses"><Button>Create course</Button></Link>} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="My Courses" value={String(mine.length)} icon={<BookOpen size={20} />} />
            <StatCard label="Total Students" value={formatCompact(students)} icon={<Users size={20} />} tone="cyan" trend="+12% this month" />
            <StatCard label="Total Earnings" value={`$${formatCompact(revenue)}`} icon={<DollarSign size={20} />} tone="green" trend="+8% this month" />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <section className="card p-5 xl:col-span-2">
              <h2 className="text-lg">Course Performance</h2>
              <p className="mb-4 text-xs text-slate-500">Earnings over time</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend}>
                    <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.55} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid {...gridProps} />
                    <XAxis dataKey="month" {...axisProps} />
                    <YAxis {...axisProps} width={48} tickFormatter={(v) => `$${formatCompact(v)}`} />
                    <Tooltip {...chartTooltip} formatter={(v) => formatPrice(Math.round(Number(v)))} />
                    <Area type="monotone" dataKey="revenue" stroke="#60a5fa" strokeWidth={2.5} fill="url(#g1)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="card flex flex-col items-center p-5 text-center">
              <h2 className="w-full text-left text-lg">Top Course</h2>
              {top && (
                <>
                  <div className="my-5"><ProgressRing value={share} size={140} label="of students" /></div>
                  <p className="font-semibold text-white">{top.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{formatCompact(top.students)} students · {top.rating.toFixed(1)} rating</p>
                </>
              )}
            </section>
          </div>

          <section className="card mt-6 p-5">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-lg">Recent Enrollments</h2><Link to="/instructor/students" className="text-sm text-brand-400 hover:text-brand-300">View all</Link></div>
            <ul className="divide-y divide-white/[0.05]">
              {recent.map((r) => (
                <li key={r.id} className="flex items-center gap-3 py-3">
                  <Avatar name={r.name} size={34} />
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-white">{r.name}</p><p className="truncate text-xs text-slate-500">{r.course}</p></div>
                  <div className="hidden w-32 sm:block"><ProgressBar value={r.progress} /></div>
                  <Badge tone="slate">{formatDate(r.enrolledAt)}</Badge>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </>
  )
}
