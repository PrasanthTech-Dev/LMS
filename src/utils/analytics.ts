import { monthlyRevenue, users } from '@/data/mock'
import type { Course, Enrollment } from '@/types'
import { courseLessonIds } from '@/utils/helpers'

const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)

export interface CourseStudent {
  id: string
  name: string
  email: string
  enrolledAt: string
  progress: number
}

/** Deterministic dummy roster so instructor screens have realistic data without a backend. */
export const courseRoster = (course: Course, real: Enrollment[]): CourseStudent[] => {
  const total = courseLessonIds(course).length
  const students = users.filter((u) => u.role === 'student')
  const roster: CourseStudent[] = students
    .filter((u) => hash(course.id + u.id) % 3 !== 0 && u.id !== 's1')
    .map((u) => ({
      id: `${course.id}-${u.id}`,
      name: u.name,
      email: u.email,
      enrolledAt: `2026-${String(6 + (hash(u.id + course.id) % 5)).padStart(2, '0')}-${String(1 + (hash(u.id) % 27)).padStart(2, '0')}`,
      progress: hash(u.id + course.id) % 101,
    }))
  for (const e of real.filter((x) => x.courseId === course.id)) {
    const u = users.find((x) => x.id === e.userId)
    roster.unshift({ id: e.id, name: u?.name ?? 'Student', email: u?.email ?? '', enrolledAt: e.enrolledAt, progress: total ? Math.round((e.completedLessons.length / total) * 100) : 0 })
  }
  return roster
}

/** Monthly enrolments/revenue for a single course, scaled from platform trend. */
export const courseTrend = (course: Course) => {
  const share = (hash(course.id) % 20) / 100 + 0.08
  return monthlyRevenue.map((m) => ({
    month: m.month,
    enrollments: Math.round(m.enrollments * share),
    revenue: Math.round(m.enrollments * share * course.price),
  }))
}

export const completionRate = (course: Course) => 38 + (hash(course.id) % 40)
