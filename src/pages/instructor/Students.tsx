import { useMemo, useState } from 'react'
import { Users } from 'lucide-react'
import { Avatar, Badge, Button, EmptyState, PageHeader, ProgressBar, SelectFilter } from '@/components/ui'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { useAppSelector } from '@/store'
import { courseRoster, type CourseStudent } from '@/utils/analytics'
import { formatDate } from '@/utils/helpers'

type Row = CourseStudent & { course: string }

export default function InstructorStudents() {
  const user = useAppSelector((s) => s.auth.user)!
  const courses = useAppSelector((s) => s.courses.items).filter((c) => c.instructorId === user.id)
  const enrollments = useAppSelector((s) => s.learning.enrollments)
  const [courseId, setCourseId] = useState('all')

  const rows: Row[] = useMemo(
    () => courses.filter((c) => courseId === 'all' || c.id === courseId).flatMap((c) => courseRoster(c, enrollments).map((s) => ({ ...s, course: c.title }))),
    [courses, enrollments, courseId],
  )

  const columns: Column<Row>[] = [
    { key: 'name', header: 'Student', sortValue: (r) => r.name, render: (r) => <div className="flex items-center gap-3"><Avatar name={r.name} size={32} /><div><p className="font-medium text-white">{r.name}</p><p className="text-xs text-slate-500">{r.email}</p></div></div> },
    { key: 'course', header: 'Course', sortValue: (r) => r.course, render: (r) => <span className="line-clamp-1 max-w-[16rem]">{r.course}</span> },
    { key: 'date', header: 'Enrolled', sortValue: (r) => r.enrolledAt, render: (r) => formatDate(r.enrolledAt) },
    { key: 'progress', header: 'Progress', sortValue: (r) => r.progress, render: (r) => <div className="flex min-w-32 items-center gap-2"><ProgressBar value={r.progress} /><span className="w-9 text-xs text-slate-400">{r.progress}%</span></div> },
    { key: 'status', header: 'Status', render: (r) => <Badge tone={r.progress < 15 ? 'amber' : 'green'}>{r.progress < 15 ? 'Inactive' : 'Active'}</Badge> },
    { key: 'action', header: 'Action', render: () => <Button size="sm" variant="outline">View</Button> },
  ]

  return (
    <>
      <PageHeader title="Manage Enrolled Students" subtitle={`${rows.length} enrolled across your courses`} />
      {courses.length === 0 ? (
        <EmptyState icon={<Users size={26} />} title="No students yet" message="Publish a course to start enrolling students." />
      ) : (
        <DataTable
          rows={rows}
          columns={columns}
          rowKey={(r) => r.id}
          searchText={(r) => `${r.name} ${r.email} ${r.course}`}
          searchPlaceholder="Search students..."
          toolbar={<SelectFilter value={courseId} onChange={setCourseId} options={[{ value: 'all', label: 'All courses' }, ...courses.map((c) => ({ value: c.id, label: c.title }))]} />}
        />
      )}
    </>
  )
}
