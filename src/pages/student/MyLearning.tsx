import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, BookOpen, PlayCircle } from 'lucide-react'
import { Badge, Button, EmptyState, PageHeader, ProgressBar, Skeleton, Tabs } from '@/components/ui'
import { useAppSelector } from '@/store'
import { ProgressRing } from '@/components/ProgressRing'
import { courseLessonIds, courseProgress, formatDate } from '@/utils/helpers'

export default function MyLearning() {
  const user = useAppSelector((s) => s.auth.user)!
  const { items, status } = useAppSelector((s) => s.courses)
  const enrollments = useAppSelector((s) => s.learning.enrollments).filter((e) => e.userId === user.id)
  const [tab, setTab] = useState('all')

  const rows = enrollments.map((e) => ({ e, c: items.find((c) => c.id === e.courseId)! })).filter((r) => r.c)
  const shown = rows.filter((r) => {
    const p = courseProgress(r.c, r.e)
    return tab === 'all' || (tab === 'progress' ? p < 100 : p === 100)
  })

  return (
    <>
      <PageHeader title="My Learning" subtitle="Track your enrolled courses and completion status." />
      {rows.length > 0 && (() => {
        const feat = rows.find((r) => courseProgress(r.c, r.e) < 100) ?? rows[0]
        const lessons = courseLessonIds(feat.c)
        const quizIds = feat.c.chapters.flatMap((ch) => ch.lessons.filter((l) => l.type === 'quiz').map((l) => l.id))
        const quizDone = quizIds.filter((id) => feat.e.completedLessons.includes(id)).length
        const p = courseProgress(feat.c, feat.e)
        return (
          <div className="mb-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <img src={feat.c.thumbnail} alt="" className="aspect-video w-full rounded-xl object-cover sm:w-44" />
              <div className="min-w-0 flex-1">
                <h2 className="text-lg">{feat.c.title}</h2>
                <Badge tone={p === 100 ? 'green' : 'blue'}>{p === 100 ? 'Completed' : 'In Progress'}</Badge>
                <div className="mt-3 flex items-center gap-3"><ProgressBar value={p} /><span className="text-xs text-slate-400">{p}%</span></div>
                <Link to={`/learn/${feat.c.id}`}><Button className="mt-4" size="sm">Continue Learning →</Button></Link>
              </div>
            </div>
            <div className="card flex items-center gap-5 p-5">
              <ProgressRing value={p} size={110} />
              <div className="space-y-1.5 text-sm">
                <h3 className="text-base">Learning Progress</h3>
                <p className="text-slate-400">Lessons Completed <span className="font-semibold text-white">{feat.e.completedLessons.length}/{lessons.length}</span></p>
                <p className="text-slate-400">Quizzes Passed <span className="font-semibold text-white">{quizDone}/{quizIds.length}</span></p>
                <p className="text-slate-400">Certificate <span className={p === 100 ? 'font-semibold text-emerald-400' : 'font-semibold text-brand-300'}>{p === 100 ? 'Ready' : 'Soon'}</span></p>
              </div>
            </div>
          </div>
        )
      })()}
      <div className="mb-6 max-w-md">
        <Tabs value={tab} onChange={setTab} tabs={[{ id: 'all', label: `All (${rows.length})` }, { id: 'progress', label: 'In progress' }, { id: 'done', label: 'Completed' }]} />
      </div>

      {status === 'loading' || status === 'idle' ? (
        <div className="space-y-4">{[1, 2].map((i) => <Skeleton key={i} className="h-36 w-full" />)}</div>
      ) : shown.length === 0 ? (
        <EmptyState icon={<BookOpen size={26} />} title={tab === 'done' ? 'No completed courses yet' : 'Nothing here yet'} message="Courses you enrol in will show up here with live progress." action={<Link to="/courses"><Button>Browse courses</Button></Link>} />
      ) : (
        <div className="space-y-4">
          {shown.map(({ e, c }) => {
            const p = courseProgress(c, e)
            const total = courseLessonIds(c).length
            return (
              <div key={e.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <img src={c.thumbnail} alt="" className="aspect-video w-full rounded-xl object-cover sm:w-52" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={`/courses/${c.id}`} className="text-base font-medium text-white hover:text-brand-300">{c.title}</Link>
                    {p === 100 ? <Badge tone="green">Completed</Badge> : p === 0 ? <Badge tone="slate">Not started</Badge> : <Badge tone="blue">In progress</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{c.instructorName} · Enrolled {formatDate(e.enrolledAt)}</p>
                  <div className="mt-4 flex items-center gap-3"><ProgressBar value={p} /><span className="w-10 text-right text-xs text-slate-400">{p}%</span></div>
                  <p className="mt-1.5 text-xs text-slate-500">{e.completedLessons.length} of {total} lessons completed</p>
                </div>
                <div className="flex gap-2 sm:flex-col">
                  <Link to={`/learn/${c.id}`} className="flex-1"><Button className="w-full" size="sm" icon={<PlayCircle size={15} />}>{p === 0 ? 'Start' : p === 100 ? 'Review' : 'Continue'}</Button></Link>
                  {p === 100 && <Link to="/dashboard/certificates" className="flex-1"><Button className="w-full" size="sm" variant="outline" icon={<Award size={15} />}>Certificate</Button></Link>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
