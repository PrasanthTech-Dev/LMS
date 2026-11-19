import { api, USE_MOCK } from './api'
import { courses, demoCredentials, users } from '@/data/mock'
import type { Course, Role, User } from '@/types'
import { sleep } from '@/utils/helpers'

/**
 * Service layer. Each function hits the real API when VITE_USE_MOCK=false,
 * otherwise resolves with dummy data after a short delay to exercise loading states.
 */

export interface AuthResult {
  user: User
  token: string
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResult> {
    if (!USE_MOCK) return (await api.post<AuthResult>('/auth/login', { email, password })).data
    await sleep(700)
    const demo = (Object.values(demoCredentials) as { email: string; password: string }[]).find(
      (d) => d.email.toLowerCase() === email.toLowerCase() && d.password === password,
    )
    const registered = readRegistered().find((r) => r.user.email.toLowerCase() === email.toLowerCase() && r.password === password)
    const user = demo ? users.find((u) => u.email === demo.email) : registered?.user
    if (!user) throw new Error('Invalid email or password.')
    return { user, token: `mock-token-${user.id}` }
  },

  async register(input: { name: string; email: string; password: string; role: Role }): Promise<AuthResult> {
    if (!USE_MOCK) return (await api.post<AuthResult>('/auth/register', input)).data
    await sleep(800)
    const exists = users.some((u) => u.email === input.email) || readRegistered().some((r) => r.user.email === input.email)
    if (exists) throw new Error('An account with this email already exists.')
    const user: User = {
      id: `u${Date.now()}`,
      name: input.name,
      email: input.email,
      role: input.role,
      joinedAt: new Date().toISOString().slice(0, 10),
      status: 'active',
    }
    const list = readRegistered()
    list.push({ user, password: input.password })
    try {
      localStorage.setItem('lms_registered', JSON.stringify(list))
    } catch {
      /* ignore */
    }
    return { user, token: `mock-token-${user.id}` }
  },
}

function readRegistered(): { user: User; password: string }[] {
  try {
    return JSON.parse(localStorage.getItem('lms_registered') ?? '[]')
  } catch {
    return []
  }
}

export const courseService = {
  async list(): Promise<Course[]> {
    if (!USE_MOCK) return (await api.get<Course[]>('/courses')).data
    await sleep(600)
    return structuredClone(courses)
  },
}
