import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Award, Timer, Check, CheckCircle2, ChevronDown, ClipboardList, Download, FileQuestion, FileText, Menu, PlayCircle, Upload, X } from 'lucide-react'
import { Badge, Button, ProgressBar, Skeleton, Tabs } from '@/components/ui'
import { ProgressRing } from '@/components/ProgressRing'
import { useToast } from '@/components/ui/Toast'
import { useAppDispatch, useAppSelector } from '@/store'
import { pushNotification, saveQuizScore, submitAssignment, toggleLesson } from '@/store/slices'
import { quizBank } from '@/data/mock'
import { cn, courseLessonIds, courseProgress } from '@/utils/helpers'
import type { Lesson } from '@/types'

const VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
const icon = (t: Lesson['type']) => ({ video: PlayCircle, reading: FileText, quiz: FileQuestion, assignment: ClipboardList })[t]

export default function Player() {
  const { courseId, lessonId } = useParams()
  const nav = useNavigate()
  const toast = useToast()
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)!
  const { items, status } = useAppSelector((s) => s.courses)
  const learning = useAppSelector((s) => s.learning)
  const course = items.find((c) => c.id === courseId)
  const enrollment = learning.enrollments.find((e) => e.courseId === courseId && e.userId === user.id)

  const [sidebar, setSidebar] = useState(false)
  const [tab, setTab] = useState('overview')
  const [openCh, setOpenCh] = useState<string[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)

  const flat = useMemo(() => (course ? course.chapters.flatMap((ch) => ch.lessons.map((l) => ({ ...l, chapter: ch.title }))) : []), [course])
  const current = flat.find((l) => l.id === lessonId) ?? flat.find((l) => !enrollment?.completedLessons.includes(l.id)) ?? flat[0]
  const idx = flat.findIndex((l) => l.id === current?.id)

  useEffect(() => {
    if (current && course) {
      const ch = course.chapters.find((c) => c.lessons.some((l) => l.id === current.id))
      if (ch) setOpenCh((o) => (o.includes(ch.id) ? o : [...o, ch.id]))
    }
  }, [current, course])

  useEffect(() => {
    if (sidebar) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebar])

  if (!course) {
    if (status === 'loading' || status === 'idle') return <div className="space-y-4 p-8"><Skeleton className="h-8 w-1/3" /><Skeleton className="aspect-video w-full max-w-4xl" /></div>
    return <Navigate to="/courses" replace />
  }
  if (!enrollment) return <Navigate to={`/courses/${course.id}`} replace />
  if (!current) return null

  const done = enrollment.completedLessons.includes(current.id)
  const progress = courseProgress(course, enrollment)
  const total = courseLessonIds(course).length

  const go = (i: number) => flat[i] && nav(`/learn/${course.id}/${flat[i].id}`)
  const toggle = () => {
    const willComplete = !done
    dispatch(toggleLesson({ courseId: course.id, userId: user.id, lessonId: current.id, totalLessons: total }))
    if (willComplete) {
      const doneCount = enrollment.completedLessons.length + 1
      if (doneCount >= total) {
        toast('🎉 Course completed! Your certificate is ready.')
        dispatch(pushNotification({ title: 'Certificate ready', message: `Your certificate for ${course.title} is ready to download.`, type: 'success' }))
      } else toast('Lesson marked as complete')
    }
  }
  const completeAndNext = () => {
    if (!done) toggle()
    go(idx + 1)
  }

  return (
    <div className="flex h-screen flex-col bg-ink-950 overflow-hidden">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/[0.06] bg-ink-900 px-3 sm:px-5">
        <Link to="/dashboard/my-learning" aria-label="Back to My Learning" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/5"><ArrowLeft size={18} /></Link>
        <h1 className="min-w-0 flex-1 truncate text-sm font-medium sm:text-base">{course.title}</h1>
        <div className="hidden w-48 items-center gap-3 sm:flex"><ProgressBar value={progress} /><span className="text-xs text-slate-400">{progress}%</span></div>
        {progress === 100 && <Link to="/dashboard/certificates"><Button size="sm" variant="outline" icon={<Award size={14} />}>Certificate</Button></Link>}
        <button onClick={() => setSidebar(true)} aria-label="Open course content" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/5 lg:hidden"><Menu size={18} /></button>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto max-w-4xl p-4 sm:p-6">
            {current.type === 'video' && (
              <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-black shadow-2xl">
                <video key={current.id} ref={videoRef} controls playsInline preload="metadata" poster={course.thumbnail} className="aspect-video w-full" onEnded={() => !done && toggle()}>
                  <source src={VIDEO} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            {current.type === 'reading' && <ReadingView lesson={current} />}
            {current.type === 'quiz' && <QuizView key={current.id} quizKey={`${course.id}:${current.id}`} score={learning.quizScores[`${course.id}:${current.id}`]} onPass={(s) => { dispatch(saveQuizScore({ key: `${course.id}:${current.id}`, score: s })); if (s >= 60 && !done) toggle() }} />}
            {current.type === 'assignment' && <AssignmentView submitted={learning.submissions[`${course.id}:${current.id}`]} onSubmit={(f) => { dispatch(submitAssignment({ key: `${course.id}:${current.id}`, fileName: f })); if (!done) toggle(); toast('Assignment submitted') }} />}

            <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-brand-400">{current.chapter}</p>
                <h2 className="mt-1 text-xl sm:text-2xl">{current.title}</h2>
                <div className="mt-2 flex gap-2"><Badge tone="slate" className="capitalize">{current.type}</Badge><Badge tone="slate">{current.duration} min</Badge></div>
              </div>
              <Button variant={done ? 'secondary' : 'primary'} onClick={toggle} icon={done ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Check size={16} />}>
                {done ? 'Completed' : 'Mark as complete'}
              </Button>
            </div>

            <div className="mt-5 flex justify-between gap-3 border-y border-white/[0.06] py-4">
              <Button variant="outline" disabled={idx <= 0} onClick={() => go(idx - 1)} icon={<ArrowLeft size={16} />}>Previous</Button>
              <Button disabled={idx >= flat.length - 1} onClick={completeAndNext}>Next lesson <ArrowRight size={16} /></Button>
            </div>

            <div className="mt-6 space-y-5">
              <Tabs value={tab} onChange={setTab} tabs={[{ id: 'overview', label: 'Overview' }, { id: 'resources', label: 'Resources' }, { id: 'notes', label: 'My notes' }]} />
              {tab === 'overview' && <p className="text-sm leading-relaxed text-slate-300">{course.description}</p>}
              {tab === 'resources' && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {course.materials.map((m) => (
                    <button key={m.id} onClick={() => toast(`Downloading ${m.name}`, 'info')} className="card flex items-center gap-3 p-4 text-left transition hover:border-brand-500/40">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-[11px] font-bold text-brand-300">{m.type}</span>
                      <span className="min-w-0 flex-1"><span className="block truncate text-sm text-white">{m.name}</span><span className="text-xs text-slate-500">{m.size}</span></span>
                      <Download size={16} className="text-brand-400" />
                    </button>
                  ))}
                </div>
              )}
              {tab === 'notes' && <Notes key={current.id} storageKey={`lms_note_${user.id}_${current.id}`} />}
            </div>
          </div>
        </main>

        {/* Curriculum sidebar */}
        <aside className={cn('fixed inset-0 z-40 lg:static lg:z-auto lg:block lg:w-96 lg:shrink-0', sidebar ? 'block' : 'hidden')}>
          <div className="absolute inset-0 bg-black/70 lg:hidden" onClick={() => setSidebar(false)} />
          <div className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col border-l border-white/[0.06] bg-ink-900 lg:static lg:w-full lg:max-w-none">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.06] px-4">
              <h3 className="text-sm">Course Chapters</h3>
              <button onClick={() => setSidebar(false)} aria-label="Close" className="text-slate-400 lg:hidden"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {course.chapters.map((ch, ci) => {
                const isOpen = openCh.includes(ch.id)
                const doneInCh = ch.lessons.filter((l) => enrollment.completedLessons.includes(l.id)).length
                return (
                  <div key={ch.id} className="border-b border-white/[0.04]">
                    <button onClick={() => setOpenCh((o) => (isOpen ? o.filter((x) => x !== ch.id) : [...o, ch.id]))} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-2 px-4 py-3.5 text-left hover:bg-white/[0.03]">
                      <span><span className="block text-sm font-medium text-white">{ci + 1}. {ch.title}</span><span className="text-xs text-slate-500">{doneInCh}/{ch.lessons.length} completed</span></span>
                      <ChevronDown size={16} className={cn('text-slate-500 transition', isOpen && 'rotate-180')} />
                    </button>
                    {isOpen && ch.lessons.map((l) => {
                      const Icon = icon(l.type)
                      const isDone = enrollment.completedLessons.includes(l.id)
                      return (
                        <Link key={l.id} to={`/learn/${course.id}/${l.id}`} onClick={() => setSidebar(false)} className={cn('flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-white/[0.03]', l.id === current.id ? 'bg-brand-600/10 text-white' : 'text-slate-400')}>
                          {isDone ? <CheckCircle2 size={16} className="shrink-0 text-emerald-400" /> : <Icon size={16} className="shrink-0" />}
                          <span className="flex-1">{l.title}</span>
                          <span className="text-xs text-slate-600">{l.duration}m</span>
                        </Link>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

/* ---- Sub views ---- */
const ReadingView = ({ lesson }: { lesson: Lesson }) => (
  <article className="card space-y-4 p-6 sm:p-8">
    <h3 className="text-xl">{lesson.title}</h3>
    <p className="leading-relaxed text-slate-300">This reading summarises the key ideas from the previous lessons. Review each section carefully, then try applying the concepts in your own project before moving on.</p>
    <ul className="list-inside list-disc space-y-2 text-slate-300 marker:text-brand-400">
      <li>Break problems into small, testable pieces.</li>
      <li>Prefer clear, readable code over clever shortcuts.</li>
      <li>Validate assumptions early with quick experiments.</li>
      <li>Document decisions so teammates can follow your reasoning.</li>
    </ul>
    <p className="leading-relaxed text-slate-300">When you are ready, mark this lesson as complete and continue with the next one.</p>
  </article>
)

const QuizView = ({ quizKey, score, onPass }: { quizKey: string; score?: number; onPass: (s: number) => void }) => {
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [finished, setFinished] = useState(false)
  const n = quizBank.length
  const q = quizBank[i]
  const correct = quizBank.filter((x) => answers[x.id] === x.answer).length
  const result = Math.round((correct / n) * 100)

  if (finished) {
    return (
      <div className="card space-y-5 p-6 text-center sm:p-8" data-quiz={quizKey}>
        <ProgressRing value={result} size={130} label={`${correct}/${n} correct`} />
        <h3 className="text-xl">{result >= 60 ? 'Great job! Quiz passed' : 'Keep practising'}</h3>
        <p className="text-sm text-slate-400">{result >= 60 ? 'This lesson has been marked as complete.' : 'You need at least 60% to pass. Review the lessons and try again.'}</p>
        <ul className="mx-auto max-w-lg space-y-2 text-left text-sm">
          {quizBank.map((x, qi) => (
            <li key={x.id} className="flex items-start gap-2.5 text-slate-300">
              {answers[x.id] === x.answer ? <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" /> : <X size={16} className="mt-0.5 shrink-0 text-red-400" />}
              <span>{qi + 1}. {x.question}{answers[x.id] !== x.answer && <span className="block text-xs text-emerald-300">Correct: {x.options[x.answer]}</span>}</span>
            </li>
          ))}
        </ul>
        <Button variant="outline" onClick={() => { setAnswers({}); setI(0); setFinished(false) }}>Retake quiz</Button>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden" data-quiz={quizKey}>
      <div className="flex items-center justify-between border-b border-brand-500/15 px-5 py-4 sm:px-7">
        <h3 className="text-lg">Quiz: <span className="text-brand-300">React Basics</span></h3>
        <div className="flex items-center gap-3">
          {score !== undefined && <Badge tone={score >= 60 ? 'green' : 'amber'}>Best: {score}%</Badge>}
          <span className="text-sm text-slate-400">Question {i + 1} of {n}</span>
        </div>
      </div>
      <div className="h-1 bg-ink-700"><div className="h-full bg-gradient-to-r from-brand-600 to-accent-400 transition-all" style={{ width: `${((i + 1) / n) * 100}%` }} /></div>
      <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[14rem_1fr]">
        <div className="hidden items-center justify-center rounded-2xl bg-gradient-to-br from-brand-700/60 to-ink-800 p-6 md:flex" aria-hidden="true">
          <div className="relative"><ClipboardList size={90} className="text-brand-300" /><span className="absolute -bottom-2 -right-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 glow"><Timer size={24} /></span></div>
        </div>
        <fieldset>
          <legend className="mb-4 text-lg font-semibold text-white">{q.question}</legend>
          <div className="grid gap-2.5">
            {q.options.map((o, oi) => {
              const picked = answers[q.id] === oi
              return (
                <label key={o} className={cn('flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition', picked ? 'border-brand-500 bg-brand-500/10 text-white' : 'border-brand-500/15 bg-ink-900 text-slate-300 hover:border-brand-500/40')}>
                  <input type="radio" name={q.id} checked={picked} onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))} className="h-4 w-4 accent-brand-500" />
                  {o}
                </label>
              )
            })}
          </div>
          <div className="mt-6 flex justify-between gap-3">
            <Button type="button" variant="ghost" disabled={i === 0} onClick={() => setI(i - 1)}>Previous</Button>
            {i < n - 1 ? (
              <Button type="button" disabled={answers[q.id] === undefined} onClick={() => setI(i + 1)}>Next Question <ArrowRight size={15} /></Button>
            ) : (
              <Button type="button" disabled={answers[q.id] === undefined} onClick={() => { setFinished(true); onPass(result) }}>Submit Quiz</Button>
            )}
          </div>
        </fieldset>
      </div>
    </div>
  )
}

const AssignmentView = ({ submitted, onSubmit }: { submitted?: string; onSubmit: (name: string) => void }) => {
  const [file, setFile] = useState<File | null>(null)
  const [err, setErr] = useState('')
  const pick = (f?: File) => {
    if (!f) return
    if (f.size > 10 * 1024 * 1024) return setErr('File must be smaller than 10 MB')
    setErr('')
    setFile(f)
  }
  return (
    <div className="card space-y-5 p-6 sm:p-8">
      <h3 className="text-xl">Assignment</h3>
      <p className="text-sm leading-relaxed text-slate-300">Apply what you've learned by building a small project. Upload your work as a ZIP or PDF. Your instructor will review it and share feedback.</p>
      {submitted ? (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200"><CheckCircle2 size={18} /> Submitted: {submitted}</div>
      ) : (
        <>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/15 p-8 text-center transition hover:border-brand-500/60 hover:bg-brand-500/5">
            <Upload className="text-brand-400" />
            <span className="text-sm text-slate-300">{file ? file.name : 'Click to choose a file (ZIP, PDF — max 10 MB)'}</span>
            <input type="file" accept=".zip,.pdf" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
          </label>
          {err && <p role="alert" className="text-sm text-red-400">{err}</p>}
          <Button disabled={!file} onClick={() => file && onSubmit(file.name)}>Submit assignment</Button>
        </>
      )}
    </div>
  )
}

const Notes = ({ storageKey }: { storageKey: string }) => {
  const [text, setText] = useState(() => { try { return localStorage.getItem(storageKey) ?? '' } catch { return '' } })
  return (
    <div>
      <textarea value={text} onChange={(e) => { setText(e.target.value); try { localStorage.setItem(storageKey, e.target.value) } catch { /* ignore */ } }} rows={6} placeholder="Jot down notes for this lesson. They're saved automatically." aria-label="Lesson notes" className="input resize-y" />
    </div>
  )
}
