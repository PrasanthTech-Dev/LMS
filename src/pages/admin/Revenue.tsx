import { Bar, BarChart, CartesianGrid, Line, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts'
import { DollarSign, Receipt, TrendingUp, Wallet } from 'lucide-react'
import { PageHeader, StatCard } from '@/components/ui'
import { axisProps, chartTooltip, gridProps } from '@/components/charts'
import { useAppSelector } from '@/store'
import { monthlyRevenue } from '@/data/mock'
import { formatCompact, formatPrice } from '@/utils/helpers'

export default function AdminRevenue() {
  const courses = useAppSelector((s) => s.courses.items)
  const total = monthlyRevenue.reduce((n, m) => n + m.revenue, 0)
  const orders = monthlyRevenue.reduce((n, m) => n + m.enrollments, 0)
  const top = [...courses].sort((a, b) => b.students * b.price - a.students * a.price).slice(0, 5)
  const max = top[0] ? top[0].students * top[0].price : 1

  return (
    <>
      <PageHeader title="Revenue analytics" subtitle="Earnings, orders and top performing courses." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Gross revenue" value={formatPrice(total)} icon={<DollarSign size={20} />} tone="green" />
        <StatCard label="Platform share (30%)" value={formatPrice(Math.round(total * 0.3))} icon={<Wallet size={20} />} />
        <StatCard label="Orders" value={orders.toLocaleString()} icon={<Receipt size={20} />} tone="cyan" />
        <StatCard label="Avg. order value" value={formatPrice(Math.round(total / orders))} icon={<TrendingUp size={20} />} tone="amber" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="card p-5 xl:col-span-2">
          <h2 className="mb-4 text-lg">Revenue vs enrolments</h2>
          <div className="h-80"><ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyRevenue}>
              <CartesianGrid {...gridProps} /><XAxis dataKey="month" {...axisProps} />
              <YAxis yAxisId="l" {...axisProps} width={50} tickFormatter={(v) => `$${formatCompact(v)}`} /><YAxis yAxisId="r" orientation="right" {...axisProps} width={36} />
              <Tooltip {...chartTooltip} /><Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
              <Bar yAxisId="l" dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Line yAxisId="r" type="monotone" dataKey="enrollments" name="Enrolments" stroke="#22d3ee" strokeWidth={2.5} dot={{ r: 4 }} />
            </ComposedChart></ResponsiveContainer></div>
        </section>
        <section className="card p-5">
          <h2 className="mb-4 text-lg">Top earning courses</h2>
          <ul className="space-y-4">
            {top.map((c) => {
              const v = c.students * c.price
              return (
                <li key={c.id}><div className="mb-1.5 flex justify-between gap-3 text-sm"><span className="line-clamp-1 text-slate-200">{c.title}</span><span className="shrink-0 text-slate-400">${formatCompact(v)}</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-ink-700"><div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-accent-400" style={{ width: `${(v / max) * 100}%` }} /></div></li>
              )
            })}
          </ul>
        </section>
      </div>
    </>
  )
}
