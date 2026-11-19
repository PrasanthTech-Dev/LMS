import { Download } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Button, PageHeader, ProgressBar } from '@/components/ui'
import { axisProps, chartTooltip, gridProps } from '@/components/charts'
import { useToast } from '@/components/ui/Toast'
import { useAppSelector } from '@/store'
import { enrollmentRows, monthlyRevenue } from '@/data/mock'
import { completionRate } from '@/utils/analytics'

const download = (name: string, rows: (string | number)[][]) => {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = name
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function AdminReports() {
  const courses = useAppSelector((s) => s.courses.items)
  const users = useAppSelector((s) => s.users)
  const toast = useToast()

  const exports = [
    { label: 'Users report', file: 'users.csv', rows: () => [['Name', 'Email', 'Role', 'Joined', 'Status'], ...users.map((u) => [u.name, u.email, u.role, u.joinedAt, u.status ?? 'active'])] },
    { label: 'Courses report', file: 'courses.csv', rows: () => [['Title', 'Instructor', 'Category', 'Price', 'Students', 'Rating', 'Status'], ...courses.map((c) => [c.title, c.instructorName, c.category, c.price, c.students, c.rating, c.status])] },
    { label: 'Enrolments report', file: 'enrollments.csv', rows: () => [['Student', 'Course', 'Date', 'Amount', 'Status'], ...enrollmentRows.map((r) => [r.student, r.course, r.date, r.amount, r.status])] },
    { label: 'Revenue report', file: 'revenue.csv', rows: () => [['Month', 'Revenue', 'Enrolments'], ...monthlyRevenue.map((m) => [m.month, m.revenue, m.enrollments])] },
  ]

  return (
    <>
      <PageHeader title="Reports & statistics" subtitle="Platform-wide metrics and CSV exports." />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="mb-4 text-lg">Enrolments per month</h2>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthlyRevenue}><CartesianGrid {...gridProps} /><XAxis dataKey="month" {...axisProps} /><YAxis {...axisProps} width={36} /><Tooltip {...chartTooltip} /><Bar dataKey="enrollments" fill="#22d3ee" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </section>
        <section className="card p-5">
          <h2 className="mb-4 text-lg">Course completion rates</h2>
          <ul className="space-y-4">
            {courses.filter((c) => c.status === 'published').slice(0, 6).map((c) => (
              <li key={c.id}><div className="mb-1.5 flex justify-between gap-3 text-sm"><span className="line-clamp-1 text-slate-300">{c.title}</span><span className="text-slate-400">{completionRate(c)}%</span></div><ProgressBar value={completionRate(c)} /></li>
            ))}
          </ul>
        </section>
      </div>
      <section className="card mt-6 p-5">
        <h2 className="mb-4 text-lg">Export data</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {exports.map((e) => (
            <Button key={e.file} variant="outline" icon={<Download size={15} />} onClick={() => { download(e.file, e.rows()); toast(`${e.label} exported`) }}>{e.label}</Button>
          ))}
        </div>
      </section>
    </>
  )
}
