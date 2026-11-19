import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CheckCircle2, Star, TrendingUp, Users } from 'lucide-react'
import { EmptyState, PageHeader, ProgressBar, Rating, SelectFilter, StatCard } from '@/components/ui'
import { axisProps, chartTooltip, gridProps } from '@/components/charts'
import { useAppSelector } from '@/store'
import { completionRate, courseTrend } from '@/utils/analytics'
import { formatCompact, formatPrice } from '@/utils/helpers'

export default function Performance() {
  const user = useAppSelector((s) => s.auth.user)!
  const courses = useAppSelector((s) => s.courses.items).filter((c) => c.instructorId === user.id && c.status !== 'draft')
  const [id, setId] = useState('')
  const course = courses.find((c) => c.id === id) ?? courses[0]

  if (!course) return <><PageHeader title="Performance" /><EmptyState icon={<TrendingUp size={26} />} title="No published courses" message="Performance analytics appear once you publish a course." /></>

  const trend = courseTrend(course)
  const dist = [5, 4, 3, 2, 1].map((s) => ({ star: `${s}★`, count: Math.round(course.reviewCount * ({ 5: 0.62, 4: 0.24, 3: 0.09, 2: 0.03, 1: 0.02 }[s] as number)) }))

  return (
    <>
      <PageHeader title="Performance" subtitle="Track enrolments, revenue and learner satisfaction per course." actions={<SelectFilter value={course.id} onChange={setId} options={courses.map((c) => ({ value: c.id, label: c.title }))} />} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total students" value={formatCompact(course.students)} icon={<Users size={20} />} />
        <StatCard label="Completion rate" value={`${completionRate(course)}%`} icon={<CheckCircle2 size={20} />} tone="green" />
        <StatCard label="Rating" value={course.rating.toFixed(1)} icon={<Star size={20} />} tone="amber" />
        <StatCard label="Revenue (6 mo)" value={formatPrice(trend.reduce((n, t) => n + t.revenue, 0))} icon={<TrendingUp size={20} />} tone="cyan" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="mb-4 text-lg">New enrolments</h2>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={trend}><CartesianGrid {...gridProps} /><XAxis dataKey="month" {...axisProps} /><YAxis {...axisProps} width={32} /><Tooltip {...chartTooltip} /><Line type="monotone" dataKey="enrollments" stroke="#22d3ee" strokeWidth={2.5} dot={{ r: 4, fill: '#22d3ee' }} /></LineChart></ResponsiveContainer></div>
        </section>
        <section className="card p-5">
          <h2 className="mb-4 text-lg">Rating distribution</h2>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={dist} layout="vertical"><CartesianGrid {...gridProps} horizontal={false} vertical /><XAxis type="number" {...axisProps} /><YAxis type="category" dataKey="star" {...axisProps} width={36} /><Tooltip {...chartTooltip} /><Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer></div>
        </section>
      </div>
      <section className="card mt-6 p-5">
        <h2 className="mb-4 text-lg">Learner engagement</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {[['Course completion', completionRate(course)], ['Quiz pass rate', Math.min(96, completionRate(course) + 21)], ['Assignment submission', Math.max(30, completionRate(course) - 9)]].map(([l, v]) => (
            <div key={l as string}><div className="mb-2 flex justify-between text-sm text-slate-300"><span>{l}</span><span>{v}%</span></div><ProgressBar value={v as number} /></div>
          ))}
        </div>
        <div className="mt-5"><Rating value={course.rating} count={course.reviewCount} /></div>
      </section>
    </>
  )
}
