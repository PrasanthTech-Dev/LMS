import { Link } from 'react-router-dom'
import { BookOpen, Star, Users } from 'lucide-react'
import { Avatar, Button, EmptyState } from '@/components/ui'
import { useAppSelector } from '@/store'
import { formatCompact } from '@/utils/helpers'

export default function Instructors() {
  const users = useAppSelector((s) => s.users).filter((u) => u.role === 'instructor' && u.status !== 'suspended')
  const courses = useAppSelector((s) => s.courses.items).filter((c) => c.status === 'published')
  return (
    <div className="container-x py-12">
      <h1 className="text-3xl sm:text-4xl">Our Instructors</h1>
      <p className="mt-2 text-slate-400">Learn from practitioners who build what they teach.</p>
      {users.length === 0 ? (
        <div className="mt-8"><EmptyState title="No instructors yet" /></div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {users.map((u) => {
            const mine = courses.filter((c) => c.instructorId === u.id)
            const students = mine.reduce((n, c) => n + c.students, 0)
            const rating = mine.length ? mine.reduce((n, c) => n + c.rating, 0) / mine.length : 0
            return (
              <div key={u.id} className="card card-hover flex flex-col items-center p-6 text-center">
                <Avatar name={u.name} size={72} />
                <h3 className="mt-4 text-lg">{u.name}</h3>
                <p className="mt-1 line-clamp-2 min-h-10 text-xs text-slate-400">{u.bio ?? 'Expert instructor at EduLearn'}</p>
                <div className="mt-4 grid w-full grid-cols-3 gap-2 text-xs text-slate-400">
                  <span className="flex flex-col items-center gap-1"><BookOpen size={14} className="text-brand-400" />{mine.length} courses</span>
                  <span className="flex flex-col items-center gap-1"><Users size={14} className="text-brand-400" />{formatCompact(students)}</span>
                  <span className="flex flex-col items-center gap-1"><Star size={14} className="fill-amber-400 text-amber-400" />{rating.toFixed(1)}</span>
                </div>
                <Link to={`/courses?q=${encodeURIComponent(u.name)}`} className="mt-5 w-full"><Button variant="outline" size="sm" className="w-full">View courses</Button></Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
