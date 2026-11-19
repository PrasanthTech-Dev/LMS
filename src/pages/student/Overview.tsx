import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle2, Clock, PlayCircle, TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Button, EmptyState, PageHeader, ProgressBar, Skeleton } from '@/components/ui'
import { axisProps, chartTooltip, gridProps } from '@/components/charts'
import { useAppSelector } from '@/store'
import { weeklyActivity } from '@/data/mock'
import { courseProgress } from '@/utils/helpers'

const Stat = ({ label, value, icon: Icon, spark }: { label: string; value: string; icon: typeof BookOpen; spark?: boolean }) => (
  <div className="card flex items-center justify-between p-5">
    <div><p className="text-xs text-slate-400">{label}</p><p className="mt-1 text-3xl font-bold text-white">{value}</p></div>
    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400">{spark ? <TrendingUp size={22} /> : <Icon size={22} />}</span>
  </div>
)

export default function StudentOverview() {
  const user = useAppSelector((s) => s.auth.user)!
  const { items, status } = useAppSelector((s) => s.courses)
  const enrollments = useAppSelector((s) => s.learning.enrollments).filter((e) => e.userId === user.id)

  const rows = enrollments.map((e) => ({ e, c: items.find((c) => c.id === e.courseId) })).filter((r) => r.c)
  const completed = rows.filter((r) => courseProgress(r.c!, r.e) === 100)
  const hours = Math.round(rows.reduce((h, r) => h + (r.c!.duration * courseProgress(r.c!, r.e)) / 100, 0))

  return (
    <>
      <PageHeader title={`Welcome back, ${user.name.split(' ')[0]}! 👋`} subtitle="Continue your learning journey" actions={<Link to="/courses"><Button variant="outline">Browse courses</Button></Link>} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Enrolled Courses" value={String(rows.length)} icon={BookOpen} />
        <Stat label="Completed Courses" value={String(completed.length)} icon={CheckCircle2} />
        <Stat label="Learning Hours" value={`${hours}h`} icon={Clock} spark />
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg">My Courses</h2><Link to="/dashboard/my-learning" className="text-sm text-brand-400 hover:text-brand-300">View All →</Link></div>
        {status === 'loading' || status === 'idle' ? (
          <div className="grid gap-4 sm:grid-cols-3"><Skeleton className="h-52" /><Skeleton className="h-52" /><Skeleton className="h-52" /></div>
        ) : rows.length === 0 ? (
          <EmptyState title="No courses yet" message="Enrol in a course to start tracking your learning progress." action={<Link to="/courses"><Button>Explore courses</Button></Link>} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {rows.slice(0, 6).map(({ e, c }) => {
              const p = courseProgress(c!, e)
              return (
                <Link key={e.id} to={`/learn/${c!.id}`} className="card card-hover group overflow-hidden">
                  <div className="relative"><img src={c!.thumbnail} alt="" className="aspect-video w-full object-cover" />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100"><PlayCircle size={40} /></span></div>
                  <div className="p-4">
                    <p className="line-clamp-1 font-semibold text-white">{c!.title}</p>
                    <div className="mt-3"><ProgressBar value={p} /></div>
                    <p className="mt-2 text-xs text-slate-400">{p === 100 ? 'Completed' : `${p}% Complete`}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <section className="card mt-8 p-5">
        <h2 className="mb-1 text-lg">Weekly activity</h2>
        <p className="mb-4 text-xs text-slate-500">Hours learned this week</p>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyActivity}>
              <CartesianGrid {...gridProps} /><XAxis dataKey="day" {...axisProps} /><YAxis {...axisProps} width={28} />
              <Tooltip {...chartTooltip} /><Bar dataKey="hours" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  )
}
