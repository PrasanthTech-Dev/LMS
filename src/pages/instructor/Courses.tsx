import { useState } from 'react'
import { Edit3, Eye, FileUp, Plus, Trash2, Video, BookOpen, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Button, EmptyState, Modal, PageHeader, Tabs } from '@/components/ui'
import { SelectField, TextArea, TextField, useForm, v } from '@/components/ui/Form'
import { useToast } from '@/components/ui/Toast'
import { useAppDispatch, useAppSelector } from '@/store'
import { addCourse, deleteCourse, updateCourse } from '@/store/slices'
import { categories } from '@/data/mock'
import { cover } from '@/utils/cover'
import { formatCompact, formatPrice } from '@/utils/helpers'
import type { Chapter, Course, Level, Lesson, Material } from '@/types'

type Vals = { title: string; subtitle: string; category: string; level: string; price: string; originalPrice: string; description: string }

const rules = {
  title: [v.required('Title'), v.min(8, 'Title')],
  subtitle: [v.required('Subtitle'), v.min(10, 'Subtitle')],
  category: [v.required('Category')],
  level: [v.required('Level')],
  price: [v.required('Price'), v.number('Price')],
  originalPrice: [v.required('Original price'), v.number('Original price')],
  description: [v.required('Description'), v.min(30, 'Description')],
}

export default function InstructorCourses() {
  const user = useAppSelector((s) => s.auth.user)!
  const courses = useAppSelector((s) => s.courses.items).filter((c) => c.instructorId === user.id)
  const dispatch = useAppDispatch()
  const toast = useToast()
  const [editing, setEditing] = useState<Course | 'new' | null>(null)
  const [deleting, setDeleting] = useState<Course | null>(null)

  return (
    <>
      <PageHeader title="My Courses" subtitle="Create, edit and publish your courses." actions={<Button icon={<Plus size={16} />} onClick={() => setEditing('new')}>Create course</Button>} />

      {courses.length === 0 ? (
        <EmptyState icon={<BookOpen size={26} />} title="No courses yet" message="Create your first course and start teaching." action={<Button onClick={() => setEditing('new')}>Create course</Button>} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((c) => (
            <div key={c.id} className="card flex flex-col overflow-hidden">
              <div className="relative aspect-video"><img src={c.thumbnail} alt="" className="h-full w-full object-cover" />
                <Badge tone={c.status === 'published' ? 'green' : c.status === 'draft' ? 'slate' : 'amber'} className="absolute left-3 top-3 capitalize">{c.status}</Badge>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 text-base">{c.title}</h3>
                <p className="mt-1 text-xs text-slate-500">{c.category} · {c.level}</p>
                <div className="mt-3 flex items-center justify-between text-sm text-slate-400"><span>{formatCompact(c.students)} students</span><span className="font-semibold text-white">{formatPrice(c.price)}</span></div>
                <div className="mt-auto flex gap-2 pt-4">
                  <Button size="sm" variant="outline" className="flex-1" icon={<Edit3 size={14} />} onClick={() => setEditing(c)}>Edit</Button>
                  {c.status === 'published' && <Link to={`/courses/${c.id}`}><Button size="sm" variant="ghost" aria-label="View public page"><Eye size={15} /></Button></Link>}
                  <Button size="sm" variant="danger" aria-label="Delete course" onClick={() => setDeleting(c)}><Trash2 size={15} /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <CourseEditor key={editing === 'new' ? 'new' : editing.id} course={editing === 'new' ? null : editing} onClose={() => setEditing(null)} instructor={{ id: user.id, name: user.name }}
        onSave={(data, isNew) => {
          if (isNew) dispatch(addCourse(data as Course))
          else dispatch(updateCourse(data as Course))
          toast(isNew ? 'Course created as draft' : 'Course updated')
          setEditing(null)
        }} />}

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete course?">
        <p className="text-sm text-slate-400">“{deleting?.title}” will be permanently removed. This action cannot be undone.</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => { dispatch(deleteCourse(deleting!.id)); toast('Course deleted', 'info'); setDeleting(null) }}>Delete</Button>
        </div>
      </Modal>
    </>
  )
}

/* ------------------------------------------------------------------ */

interface EditorProps { course: Course | null; instructor: { id: string; name: string }; onClose: () => void; onSave: (c: Partial<Course> & { id: string }, isNew: boolean) => void }

function CourseEditor({ course, instructor, onClose, onSave }: EditorProps) {
  const [tab, setTab] = useState('details')
  const [status, setStatus] = useState<Course['status']>(course?.status ?? 'draft')
  const [chapters, setChapters] = useState<Chapter[]>(course?.chapters ?? [])
  const [materials, setMaterials] = useState<Material[]>(course?.materials ?? [])
  const [thumb, setThumb] = useState(course?.thumbnail ?? '')
  const [uploadErr, setUploadErr] = useState('')
  const { field, submit } = useForm<Vals>(
    { title: course?.title ?? '', subtitle: course?.subtitle ?? '', category: course?.category ?? categories[0], level: course?.level ?? 'Beginner', price: String(course?.price ?? ''), originalPrice: String(course?.originalPrice ?? ''), description: course?.description ?? '' },
    rules,
  )

  const addChapter = () => setChapters((c) => [...c, { id: `ch${Date.now()}`, title: `Chapter ${c.length + 1}`, lessons: [] }])
  const renameChapter = (id: string, title: string) => setChapters((c) => c.map((x) => (x.id === id ? { ...x, title } : x)))
  const removeChapter = (id: string) => setChapters((c) => c.filter((x) => x.id !== id))
  const addLesson = (cid: string, type: Lesson['type'], title: string, duration = 8) =>
    setChapters((c) => c.map((x) => (x.id === cid ? { ...x, lessons: [...x.lessons, { id: `l${Date.now()}${Math.random().toString(36).slice(2, 5)}`, title, type, duration }] } : x)))
  const removeLesson = (cid: string, lid: string) => setChapters((c) => c.map((x) => (x.id === cid ? { ...x, lessons: x.lessons.filter((l) => l.id !== lid) } : x)))

  const uploadVideo = (cid: string, f?: File) => {
    if (!f) return
    if (!f.type.startsWith('video/')) return setUploadErr('Please choose a video file (MP4, WebM)')
    setUploadErr('')
    addLesson(cid, 'video', f.name.replace(/\.[^.]+$/, ''), Math.max(1, Math.round(f.size / 1_500_000)))
  }
  const uploadMaterial = (files: FileList | null) => {
    if (!files) return
    const next: Material[] = [...files].map((f, i) => {
      const ext = f.name.split('.').pop()?.toUpperCase()
      const type = (['PDF', 'ZIP', 'DOCX', 'XLSX'].includes(ext ?? '') ? ext : 'PDF') as Material['type']
      return { id: `m${Date.now()}${i}`, name: f.name, size: f.size > 1_000_000 ? `${(f.size / 1_000_000).toFixed(1)} MB` : `${Math.max(1, Math.round(f.size / 1000))} KB`, type }
    })
    setMaterials((m) => [...m, ...next])
  }
  const pickThumb = (f?: File) => {
    if (!f) return
    if (!f.type.startsWith('image/')) return setUploadErr('Thumbnail must be an image')
    setUploadErr('')
    setThumb(URL.createObjectURL(f))
  }

  const save = submit((vals) => {
    const id = course?.id ?? `c${Date.now()}`
    onSave(
      {
        ...(course ?? {
          description: '', rating: 0, reviewCount: 0, students: 0, duration: 0, language: 'English', tags: [], outcomes: ['Build real-world projects'], requirements: ['No prior experience required'], reviews: [],
          instructorId: instructor.id, instructorName: instructor.name,
        }),
        id,
        title: vals.title, subtitle: vals.subtitle, category: vals.category, level: vals.level as Level,
        price: Number(vals.price), originalPrice: Number(vals.originalPrice), description: vals.description,
        thumbnail: thumb || cover(vals.title.split(' ')[0] || 'Course', vals.category),
        chapters, materials, status,
        duration: Math.max(1, Math.round(chapters.flatMap((c) => c.lessons).reduce((n, l) => n + l.duration, 0) / 60)) || course?.duration || 1,
        updatedAt: new Date().toISOString().slice(0, 10),
      },
      !course,
    )
  })

  return (
    <Modal open onClose={onClose} title={course ? 'Edit course' : 'Create new course'} wide>
      <form onSubmit={save} noValidate className="space-y-5">
        <Tabs value={tab} onChange={setTab} tabs={[{ id: 'details', label: 'Details' }, { id: 'curriculum', label: `Curriculum (${chapters.length})` }, { id: 'materials', label: `Materials (${materials.length})` }]} />
        {uploadErr && <p role="alert" className="text-sm text-red-400">{uploadErr}</p>}

        <div className={tab === 'details' ? 'space-y-4' : 'hidden'}>
          <TextField label="Course title" placeholder="e.g. Complete React Masterclass" {...field('title')} />
          <TextField label="Subtitle" placeholder="One-line summary" {...field('subtitle')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Category" {...field('category')}>{categories.map((c) => <option key={c}>{c}</option>)}</SelectField>
            <SelectField label="Level" {...field('level')}>{['Beginner', 'Intermediate', 'Advanced'].map((l) => <option key={l}>{l}</option>)}</SelectField>
            <TextField label="Price ($)" inputMode="numeric" {...field('price')} />
            <TextField label="Original price ($)" inputMode="numeric" {...field('originalPrice')} />
          </div>
          <TextArea label="Description" placeholder="What will students learn?" {...field('description')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-sm font-medium text-slate-300">Thumbnail</p>
              <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-500/30 bg-ink-900 p-4 text-center text-sm text-slate-400 hover:border-brand-500/70">
                {thumb ? <img src={thumb} alt="" className="h-20 w-36 rounded-lg object-cover" /> : <FileUp size={26} className="text-brand-400" />} {thumb ? 'Change image' : 'Upload Course Thumbnail (Drag & Drop or Click)'}
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => pickThumb(e.target.files?.[0])} />
              </label>
            </div>
            <SelectField label="Status" value={status} onChange={(e) => setStatus(e.target.value as Course['status'])}>
              <option value="draft">Draft</option><option value="pending">Submit for review</option><option value="published">Published</option>
            </SelectField>
          </div>
        </div>

        {tab === 'curriculum' && (
          <div className="space-y-4">
            {chapters.length === 0 && <p className="rounded-xl bg-ink-900 p-4 text-center text-sm text-slate-500">No chapters yet. Add your first chapter to begin.</p>}
            {chapters.map((ch) => (
              <div key={ch.id} className="rounded-xl border border-white/[0.08] bg-ink-900 p-4">
                <div className="flex items-center gap-2">
                  <input value={ch.title} onChange={(e) => renameChapter(ch.id, e.target.value)} aria-label="Chapter title" className="input font-medium" />
                  <button type="button" onClick={() => removeChapter(ch.id)} aria-label="Remove chapter" className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400"><Trash2 size={16} /></button>
                </div>
                <ul className="mt-3 space-y-2">
                  {ch.lessons.map((l) => (
                    <li key={l.id} className="flex items-center gap-2 rounded-lg bg-ink-800 px-3 py-2 text-sm text-slate-300">
                      <Badge tone="slate" className="capitalize">{l.type}</Badge><span className="flex-1 truncate">{l.title}</span><span className="text-xs text-slate-500">{l.duration}m</span>
                      <button type="button" onClick={() => removeLesson(ch.id, l.id)} aria-label="Remove lesson" className="text-slate-500 hover:text-red-400"><X size={14} /></button>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-brand-600/15 px-3 py-1.5 text-xs font-medium text-brand-300 hover:bg-brand-600/25"><Video size={14} /> Upload video<input type="file" accept="video/*" className="sr-only" onChange={(e) => uploadVideo(ch.id, e.target.files?.[0])} /></label>
                  <Button type="button" size="sm" variant="secondary" onClick={() => addLesson(ch.id, 'reading', 'New reading', 5)}>+ Reading</Button>
                  <Button type="button" size="sm" variant="secondary" onClick={() => addLesson(ch.id, 'quiz', 'New quiz', 10)}>+ Quiz</Button>
                  <Button type="button" size="sm" variant="secondary" onClick={() => addLesson(ch.id, 'assignment', 'New assignment', 30)}>+ Assignment</Button>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" icon={<Plus size={15} />} onClick={addChapter}>Add chapter</Button>
          </div>
        )}

        {tab === 'materials' && (
          <div className="space-y-3">
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/15 p-8 text-center hover:border-brand-500/60"><FileUp className="text-brand-400" /><span className="text-sm text-slate-300">Upload PDFs, ZIPs, documents</span><input type="file" multiple className="sr-only" onChange={(e) => uploadMaterial(e.target.files)} /></label>
            {materials.map((m) => (
              <div key={m.id} className="flex items-center gap-3 rounded-xl bg-ink-900 px-4 py-3 text-sm"><Badge tone="blue">{m.type}</Badge><span className="flex-1 truncate text-slate-200">{m.name}</span><span className="text-xs text-slate-500">{m.size}</span>
                <button type="button" onClick={() => setMaterials((x) => x.filter((y) => y.id !== m.id))} aria-label="Remove file" className="text-slate-500 hover:text-red-400"><X size={15} /></button></div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-white/[0.06] pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit">{course ? 'Save changes' : 'Create course'}</Button>
        </div>
      </form>
    </Modal>
  )
}
