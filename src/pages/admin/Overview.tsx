import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BookOpen, DollarSign, GraduationCap, UserCog } from 'lucide-react'
import { Badge, PageHeader, SelectFilter, StatCard } from '@/components/ui'
import { ProgressRing } from '@/components/ProgressRing'
import { PIE_COLORS, axisProps, chartTooltip, gridProps } from '@/components/charts'
import { useAppSelector } from '@/store'
import { enrollmentRows, monthlyRevenue } from '@/data/mock'
import { formatCompact, formatDate, formatPrice } from '@/utils/helpers'

export const statusTone = (s: string) => (s === 'Paid' ? 'green' : s === 'Pending' ? 'amber' : 'red') as 'green' | 'amber' | 'red'

const ranges = [
  { value: '2', label: 'Last 30 Days' },
  { value: '3', label: 'Last 90 Days' },
  { value: '6', label: 'Last 6 Months' },
]

export default function AdminOverview() {
  const users = useAppSelector((s) => s.users)
  const courses = useAppSelector((s) => s.courses.items)
  const [range, setRange] = useState('6')
  const students = users.filter((u) => u.role === 'student').length
  const instructors = users.filter((u) => u.role === 'instructor').length
  const revenue = monthlyRevenue.reduce((n, m) => n + m.revenue, 0) + 100000
  const data = monthlyRevenue.slice(-Number(range))
  const active = users.filter((u) => u.status !== 'suspended').length
  const activePct = Math.round((active / Math.max(1, users.length)) * 100)

  const byCat = Object.entries(
    courses.reduce<Record<string, number>>((a, c) => ({ ...a, [c.category]: (a[c.category] ?? 0) + c.students }), {})
  ).map(([name, value]) => ({ name, value }))

  const totalCat = byCat.reduce((sum, c) => sum + c.value, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Platform health and analytics at a glance."
        actions={
          <div className="w-full sm:w-auto">
            <SelectFilter value={range} onChange={setRange} options={ranges} />
          </div>
        }
      />

      {/* Top 4 Stat Cards: 2x2 grid on mobile, 4-col on desktop */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
        <StatCard
          label="Total Students"
          value={formatCompact(students + 25000)}
          icon={<GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />}
          trend="+320 this week"
        />
        <StatCard
          label="Total Instructors"
          value={formatCompact(instructors + 1190)}
          icon={<UserCog className="h-4 w-4 sm:h-5 sm:w-5" />}
          tone="cyan"
        />
        <StatCard
          label="Total Courses"
          value={String(courses.length + 640)}
          icon={<BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />}
          tone="amber"
        />
        <StatCard
          label="Total Revenue"
          value={`$${formatCompact(revenue)}`}
          icon={<DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />}
          tone="green"
          trend="+14% vs last period"
        />
      </div>

      {/* Row 1: Revenue Analytics & Platform Stats */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 xl:gap-6">
        {/* Revenue Analytics Bar Chart */}
        <section className="card min-w-0 overflow-hidden p-4 sm:p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-white sm:text-lg">Revenue Analytics</h2>
              <p className="text-xs text-slate-400">Monthly gross platform revenue</p>
            </div>
            <Link
              to="/admin/revenue"
              className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-brand-400 transition hover:text-brand-300 sm:text-sm"
            >
              <span>View Report</span>
              <span>→</span>
            </Link>
          </div>
          <div className="h-64 sm:h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...axisProps} tick={{ fontSize: 11 }} />
                <YAxis {...axisProps} width={45} tick={{ fontSize: 10 }} tickFormatter={(v) => `$${formatCompact(v)}`} />
                <Tooltip {...chartTooltip} formatter={(v) => [formatPrice(Number(v)), 'Revenue']} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Platform Stats & Health Ring */}
        <section className="card min-w-0 overflow-hidden p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-white sm:text-lg">Platform Stats</h2>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/25">
              {activePct}% Health
            </span>
          </div>

          <div className="my-5 flex flex-col items-center justify-center text-center">
            <ProgressRing value={activePct} size={135} stroke={10} label="Active Users" />
            <p className="mt-3 text-xs text-slate-400">{active} of {users.length} accounts active</p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-white/[0.06] rounded-xl border border-white/[0.06] bg-ink-900/60 p-2.5 text-center">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Active</p>
              <p className="mt-0.5 text-xs font-semibold text-emerald-400 sm:text-sm">{active}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Suspended</p>
              <p className="mt-0.5 text-xs font-semibold text-amber-400 sm:text-sm">{users.length - active}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Rate</p>
              <p className="mt-0.5 text-xs font-semibold text-brand-400 sm:text-sm">{activePct}%</p>
            </div>
          </div>
        </section>
      </div>

      {/* Row 2: Students by Category Donut Chart & Recent Activities */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 xl:gap-6">
        {/* Students by Category */}
        <section className="card min-w-0 overflow-hidden p-4 sm:p-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-white sm:text-lg">Students by category</h2>
            <span className="text-xs text-slate-400">{byCat.length} Categories</span>
          </div>

          <div className="h-48 sm:h-52 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byCat}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={44}
                  outerRadius={74}
                  paddingAngle={3}
                  stroke="none"
                >
                  {byCat.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip {...chartTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="mt-3 space-y-2 text-xs text-slate-400">
            {byCat.slice(0, 5).map((c, i) => {
              const pct = totalCat > 0 ? Math.round((c.value / totalCat) * 100) : 0
              return (
                <li key={c.name} className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                    <span className="truncate text-slate-300">{c.name}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="font-medium text-slate-200">{formatCompact(c.value)}</span>
                    <span className="text-[11px] text-slate-500">({pct}%)</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Recent Activities */}
        <section className="card min-w-0 overflow-hidden p-4 sm:p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-white sm:text-lg">Recent Activities</h2>
              <p className="text-xs text-slate-400">Latest student enrollments</p>
            </div>
            <Link
              to="/admin/enrollments"
              className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-brand-400 transition hover:text-brand-300 sm:text-sm"
            >
              <span>View all</span>
              <span>→</span>
            </Link>
          </div>

          {/* Mobile Card List View (sm:hidden) */}
          <div className="space-y-2.5 sm:hidden">
            {enrollmentRows.slice(0, 5).map((r) => (
              <div key={r.id} className="rounded-xl border border-white/[0.06] bg-ink-900/50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-white">{r.student}</span>
                  <Badge tone={statusTone(r.status)} className="shrink-0">{r.status}</Badge>
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-slate-400">{r.course}</p>
                <div className="mt-2 flex items-center justify-between border-t border-white/[0.04] pt-1.5 text-xs text-slate-500">
                  <span>{formatDate(r.date)}</span>
                  <span className="font-semibold text-slate-200">{formatPrice(r.amount)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (hidden sm:block) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wider text-slate-500">
                  <th className="pb-3 font-semibold">Student</th>
                  <th className="pb-3 font-semibold">Course</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {enrollmentRows.slice(0, 5).map((r) => (
                  <tr key={r.id} className="transition hover:bg-white/[0.02]">
                    <td className="py-3 font-medium text-white">{r.student}</td>
                    <td className="py-3 text-slate-400">
                      <span className="line-clamp-1 max-w-[15rem]">{r.course}</span>
                    </td>
                    <td className="py-3 text-slate-500">{formatDate(r.date)}</td>
                    <td className="py-3 font-medium text-slate-200">{formatPrice(r.amount)}</td>
                    <td className="py-3">
                      <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
