import { useState } from 'react'
import { Badge, PageHeader, SelectFilter } from '@/components/ui'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { enrollmentRows } from '@/data/mock'
import { formatDate, formatPrice } from '@/utils/helpers'
import { statusTone } from './Overview'

type Row = (typeof enrollmentRows)[number]

const columns: Column<Row>[] = [
  { key: 'id', header: 'ID', render: (r) => <span className="text-slate-500">#{r.id.toUpperCase()}</span> },
  { key: 'student', header: 'Student', sortValue: (r) => r.student, render: (r) => <span className="font-medium text-white">{r.student}</span> },
  { key: 'course', header: 'Course', sortValue: (r) => r.course, render: (r) => <span className="line-clamp-1 max-w-[20rem]">{r.course}</span> },
  { key: 'date', header: 'Date', sortValue: (r) => r.date, render: (r) => formatDate(r.date) },
  { key: 'amount', header: 'Amount', sortValue: (r) => r.amount, render: (r) => formatPrice(r.amount) },
  { key: 'status', header: 'Status', render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
]

export default function AdminEnrollments() {
  const [filter, setFilter] = useState('all')
  const rows = enrollmentRows.filter((r) => filter === 'all' || r.status === filter)
  return (
    <>
      <PageHeader title="Enrolment management" subtitle="All course enrolments and payment status." />
      <DataTable rows={rows} columns={columns} rowKey={(r) => r.id} searchText={(r) => `${r.student} ${r.course}`} searchPlaceholder="Search enrolments..."
        toolbar={<SelectFilter value={filter} onChange={setFilter} options={[{ value: 'all', label: 'All payments' }, { value: 'Paid', label: 'Paid' }, { value: 'Pending', label: 'Pending' }, { value: 'Refunded', label: 'Refunded' }]} />} />
    </>
  )
}
