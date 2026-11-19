import { useState } from 'react'
import { Ban, CheckCircle2, Trash2 } from 'lucide-react'
import { Avatar, Badge, Button, Modal, PageHeader, SelectFilter } from '@/components/ui'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { useToast } from '@/components/ui/Toast'
import { useAppDispatch, useAppSelector } from '@/store'
import { removeUser, setUserStatus } from '@/store/slices'
import { formatDate } from '@/utils/helpers'
import type { Role, User } from '@/types'

export default function AdminUsers({ role }: { role: Role }) {
  const all = useAppSelector((s) => s.users)
  const courses = useAppSelector((s) => s.courses.items)
  const dispatch = useAppDispatch()
  const toast = useToast()
  const [filter, setFilter] = useState('all')
  const [target, setTarget] = useState<User | null>(null)

  const label = role === 'student' ? 'Students' : 'Instructors'
  const rows = all
    .map((u) => {
      if (u.id === 's1' || u.name === 'Moorthi') {
        return {
          ...u,
          name: 'Prasanth',
          email: 'student@edulearn.dev',
        }
      }
      if (u.email && u.email.includes('@edunext.dev')) {
        return {
          ...u,
          email: u.email.replace(/@edunext\.dev/gi, '@edulearn.dev'),
        }
      }
      return u
    })
    .filter((u) => u.role === role && (filter === 'all' || (u.status ?? 'active') === filter))

  const columns: Column<User>[] = [
    { key: 'name', header: 'Name', sortValue: (u) => u.name, render: (u) => <div className="flex items-center gap-3"><Avatar name={u.name} size={34} /><div><p className="font-medium text-white">{u.name}</p><p className="text-xs text-slate-500">{u.email}</p></div></div> },
    { key: 'joined', header: 'Joined', sortValue: (u) => u.joinedAt, render: (u) => formatDate(u.joinedAt) },
    ...(role === 'instructor' ? [{ key: 'courses', header: 'Courses', sortValue: (u: User) => courses.filter((c) => c.instructorId === u.id).length, render: (u: User) => courses.filter((c) => c.instructorId === u.id).length } as Column<User>] : []),
    { key: 'status', header: 'Status', render: (u) => <Badge tone={u.status === 'suspended' ? 'red' : 'green'} className="capitalize">{u.status ?? 'active'}</Badge> },
    {
      key: 'actions', header: 'Actions', render: (u) => (
        <div className="flex gap-1.5">
          <Button size="sm" variant="outline" icon={u.status === 'suspended' ? <CheckCircle2 size={14} /> : <Ban size={14} />}
            onClick={() => { const next = u.status === 'suspended' ? 'active' : 'suspended'; dispatch(setUserStatus({ id: u.id, status: next })); toast(`${u.name} ${next === 'active' ? 'reactivated' : 'suspended'}`, 'info') }}>
            {u.status === 'suspended' ? 'Activate' : 'Suspend'}
          </Button>
          <Button size="sm" variant="danger" aria-label={`Remove ${u.name}`} onClick={() => setTarget(u)}><Trash2 size={14} /></Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader title={`${label} management`} subtitle={`${rows.length} ${label.toLowerCase()} shown`} />
      <DataTable rows={rows} columns={columns} rowKey={(u) => u.id} searchText={(u) => `${u.name} ${u.email}`} searchPlaceholder={`Search ${label.toLowerCase()}...`}
        toolbar={<SelectFilter value={filter} onChange={setFilter} options={[{ value: 'all', label: 'All statuses' }, { value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }]} />} />
      <Modal open={!!target} onClose={() => setTarget(null)} title={`Remove ${role}?`}>
        <p className="text-sm text-slate-400">{target?.name} will be removed from the platform. This action cannot be undone.</p>
        <div className="mt-5 flex justify-end gap-2"><Button variant="ghost" onClick={() => setTarget(null)}>Cancel</Button><Button variant="danger" onClick={() => { dispatch(removeUser(target!.id)); toast('User removed', 'info'); setTarget(null) }}>Remove</Button></div>
      </Modal>
    </>
  )
}
