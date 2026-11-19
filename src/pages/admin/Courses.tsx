import { useState } from 'react'
import { Check, EyeOff, Trash2 } from 'lucide-react'
import { Badge, Button, Modal, PageHeader, Rating, SelectFilter } from '@/components/ui'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { useToast } from '@/components/ui/Toast'
import { useAppDispatch, useAppSelector } from '@/store'
import { deleteCourse, updateCourse } from '@/store/slices'
import { formatCompact, formatPrice } from '@/utils/helpers'
import type { Course } from '@/types'

const tone = (s: Course['status']) => (s === 'published' ? 'green' : s === 'pending' ? 'amber' : 'slate') as 'green' | 'amber' | 'slate'

export default function AdminCourses() {
  const courses = useAppSelector((s) => s.courses.items)
  const dispatch = useAppDispatch()
  const toast = useToast()
  const [filter, setFilter] = useState('all')
  const [target, setTarget] = useState<Course | null>(null)
  const rows = courses.filter((c) => filter === 'all' || c.status === filter)

  const columns: Column<Course>[] = [
    { key: 'title', header: 'Course', sortValue: (c) => c.title, render: (c) => <div className="flex items-center gap-3"><img src={c.thumbnail} alt="" className="h-10 w-16 rounded-lg object-cover" /><div className="min-w-0"><p className="line-clamp-1 max-w-[18rem] font-medium text-white">{c.title}</p><p className="text-xs text-slate-500">{c.instructorName} · {c.category}</p></div></div> },
    { key: 'students', header: 'Students', sortValue: (c) => c.students, render: (c) => formatCompact(c.students) },
    { key: 'price', header: 'Price', sortValue: (c) => c.price, render: (c) => formatPrice(c.price) },
    { key: 'rating', header: 'Rating', sortValue: (c) => c.rating, render: (c) => <Rating value={c.rating} size={12} /> },
    { key: 'status', header: 'Status', render: (c) => <Badge tone={tone(c.status)} className="capitalize">{c.status}</Badge> },
    {
      key: 'act', header: 'Actions', render: (c) => (
        <div className="flex gap-1.5">
          {c.status !== 'published' ? (
            <Button size="sm" icon={<Check size={14} />} onClick={() => { dispatch(updateCourse({ id: c.id, status: 'published' })); toast('Course published') }}>Approve</Button>
          ) : (
            <Button size="sm" variant="outline" icon={<EyeOff size={14} />} onClick={() => { dispatch(updateCourse({ id: c.id, status: 'draft' })); toast('Course unpublished', 'info') }}>Unpublish</Button>
          )}
          <Button size="sm" variant="danger" aria-label="Delete course" onClick={() => setTarget(c)}><Trash2 size={14} /></Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader title="Course management" subtitle="Review, approve and moderate courses." />
      <DataTable rows={rows} columns={columns} rowKey={(c) => c.id} searchText={(c) => `${c.title} ${c.instructorName} ${c.category}`} searchPlaceholder="Search courses..."
        toolbar={<SelectFilter value={filter} onChange={setFilter} options={[{ value: 'all', label: 'All statuses' }, { value: 'published', label: 'Published' }, { value: 'pending', label: 'Pending review' }, { value: 'draft', label: 'Draft' }]} />} />
      <Modal open={!!target} onClose={() => setTarget(null)} title="Delete course?">
        <p className="text-sm text-slate-400">“{target?.title}” will be permanently deleted.</p>
        <div className="mt-5 flex justify-end gap-2"><Button variant="ghost" onClick={() => setTarget(null)}>Cancel</Button><Button variant="danger" onClick={() => { dispatch(deleteCourse(target!.id)); toast('Course deleted', 'info'); setTarget(null) }}>Delete</Button></div>
      </Modal>
    </>
  )
}
