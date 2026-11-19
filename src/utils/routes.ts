import type { Role } from '@/types'

export const dashboardPath = (role: Role) =>
  role === 'admin' ? '/admin' : role === 'instructor' ? '/instructor' : '/dashboard'
