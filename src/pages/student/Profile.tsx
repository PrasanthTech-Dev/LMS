import { useState } from 'react'
import { Avatar, Badge, Button, PageHeader } from '@/components/ui'
import { TextArea, TextField, useForm, v } from '@/components/ui/Form'
import { useToast } from '@/components/ui/Toast'
import { useAppDispatch, useAppSelector } from '@/store'
import { updateProfile } from '@/store/slices'
import { ProgressRing } from '@/components/ProgressRing'
import { courseProgress, formatDate } from '@/utils/helpers'

export default function Profile() {
  const user = useAppSelector((s) => s.auth.user)!
  const plan = useAppSelector((s) => s.learning.subscription)
  const dispatch = useAppDispatch()
  const toast = useToast()
  const [saving, setSaving] = useState(false)
  const courses = useAppSelector((s) => s.courses.items)
  const mine = useAppSelector((s) => s.learning.enrollments).filter((e) => e.userId === user.id)
  const prog = mine.map((e) => ({ e, c: courses.find((c) => c.id === e.courseId) })).filter((r) => r.c).map((r) => courseProgress(r.c!, r.e))
  const done = prog.filter((p) => p === 100).length
  const overall = prog.length ? Math.round(prog.reduce((a, b) => a + b, 0) / prog.length) : 0

  const { field, submit } = useForm(
    { name: user.name, email: user.email, phone: user.phone ?? '', location: user.location ?? '', bio: user.bio ?? '' },
    {
      name: [v.required('Name'), v.min(2, 'Name')],
      email: [v.required('Email'), v.email()],
      phone: [(x) => (!x || /^[+\d][\d\s-]{7,}$/.test(x) ? undefined : 'Enter a valid phone number')],
      location: [],
      bio: [(x) => (x.length <= 240 ? undefined : 'Bio must be 240 characters or fewer')],
    },
  )

  const onSave = submit(async (vals) => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    dispatch(updateProfile(vals))
    setSaving(false)
    toast('Profile updated')
  })

  return (
    <>
      <PageHeader title="Student Profile" subtitle="Manage your personal information." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card flex flex-col items-center p-6 text-center">
          <Avatar name={user.name} size={96} />
          <h2 className="mt-4 text-xl">{user.name}</h2>
          <p className="text-sm text-slate-400">{user.email}</p>
          <div className="mt-3 flex gap-2"><Badge className="capitalize">{user.role}</Badge><Badge tone="cyan">{plan} plan</Badge></div>
          <p className="mt-4 text-xs text-slate-500">Member since {formatDate(user.joinedAt)}</p>
          <div className="mt-6 w-full border-t border-brand-500/15 pt-5">
            <h3 className="mb-4 text-sm">Learning Progress</h3>
            <div className="flex items-center justify-center gap-5">
              <ProgressRing value={overall} size={96} label="Overall" />
              <dl className="space-y-1 text-left text-xs text-slate-400">
                <div>Completed <span className="ml-1 font-semibold text-white">{done}</span></div>
                <div>In Progress <span className="ml-1 font-semibold text-white">{prog.length - done}</span></div>
                <div>Total Courses <span className="ml-1 font-semibold text-white">{prog.length}</span></div>
              </dl>
            </div>
          </div>
        </div>
        <form onSubmit={onSave} noValidate className="card space-y-4 p-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Full name" {...field('name')} />
            <TextField label="Email" type="email" {...field('email')} />
            <TextField label="Phone" placeholder="+91 98765 43210" {...field('phone')} />
            <TextField label="Location" placeholder="City, Country" {...field('location')} />
          </div>
          <TextArea label="Bio" hint="Up to 240 characters" placeholder="Tell us a little about yourself..." {...field('bio')} />
          <div className="flex justify-end"><Button type="submit" loading={saving}>Save changes</Button></div>
        </form>
      </div>
    </>
  )
}
