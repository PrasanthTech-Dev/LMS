import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, Download, Eye } from 'lucide-react'
import { Button, EmptyState, Modal, PageHeader } from '@/components/ui'
import { useToast } from '@/components/ui/Toast'
import { useAppSelector } from '@/store'
import { renderCertificate } from '@/utils/certificate'
import { courseProgress, formatDate } from '@/utils/helpers'

export default function Certificates() {
  const user = useAppSelector((s) => s.auth.user)!
  const { items } = useAppSelector((s) => s.courses)
  const enrollments = useAppSelector((s) => s.learning.enrollments).filter((e) => e.userId === user.id)
  const toast = useToast()
  const [preview, setPreview] = useState<string | null>(null)

  const earned = useMemo(
    () =>
      enrollments
        .map((e) => ({ e, c: items.find((c) => c.id === e.courseId) }))
        .filter((r) => r.c && courseProgress(r.c, r.e) === 100)
        .map(({ e, c }) => ({
          id: `LS-${e.id.toUpperCase()}-${c!.id.toUpperCase()}`,
          course: c!.title,
          instructor: c!.instructorName,
          date: formatDate(e.completedAt ?? e.enrolledAt),
        })),
    [enrollments, items],
  )

  const make = (c: (typeof earned)[number]) => renderCertificate({ student: user.name, course: c.course, instructor: c.instructor, date: c.date, id: c.id })
  const download = (c: (typeof earned)[number]) => {
    const a = document.createElement('a')
    a.href = make(c)
    a.download = `certificate-${c.id}.png`
    a.click()
    toast('Certificate downloaded')
  }

  return (
    <>
      <PageHeader title="Certificates" subtitle="Your achievements, ready to download and share." />
      {earned.length === 0 ? (
        <EmptyState icon={<Award size={26} />} title="No certificates yet" message="Complete all lessons in a course to earn your certificate." action={<Link to="/dashboard/my-learning"><Button>Go to My Learning</Button></Link>} />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {earned.map((c) => (
            <div key={c.id} className="card relative overflow-hidden p-6">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-600/20 blur-2xl" />
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400"><Award size={24} /></span>
              <h3 className="text-lg">{c.course}</h3>
              <p className="mt-1 text-sm text-slate-400">Issued {c.date} · {c.instructor}</p>
              <p className="mt-1 text-xs text-slate-600">ID: {c.id}</p>
              <div className="mt-5 flex gap-2">
                <Button variant="outline" size="sm" icon={<Eye size={15} />} onClick={() => setPreview(make(c))}>Preview</Button>
                <Button size="sm" icon={<Download size={15} />} onClick={() => download(c)}>Download</Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={!!preview} onClose={() => setPreview(null)} title="Certificate preview" wide>
        {preview && <img src={preview} alt="Certificate of completion" className="w-full rounded-xl" />}
      </Modal>
    </>
  )
}
