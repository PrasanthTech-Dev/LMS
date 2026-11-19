import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { authService, courseService } from '@/services/lmsService'
import { getErrorMessage } from '@/services/api'
import { seedEnrollments, seedNotifications, users as seedUsers } from '@/data/mock'
import type { Course, Enrollment, Notification, Role, User } from '@/types'

// Auto-migrate legacy user credentials and names in localStorage
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    for (const key of ['lms_users', 'lms_user', 'lms_notifications']) {
      const raw = localStorage.getItem(key)
      if (raw && (raw.includes('Moorthi') || raw.includes('edunext.dev'))) {
        const cleaned = raw
          .replace(/Moorthi/g, 'Prasanth')
          .replace(/@edunext\.dev/gi, '@edulearn.dev')
        localStorage.setItem(key, cleaned)
      }
    }
  }
} catch {
  /* storage unavailable */
}

const sanitizeUser = (u: User): User => {
  const updated = { ...u }
  if (updated.id === 's1' || updated.name === 'Moorthi') {
    updated.name = 'Prasanth'
  }
  if (updated.email && (updated.email.includes('@edunext.dev') || updated.id === 's1')) {
    updated.email = updated.email.replace(/@edunext\.dev/gi, '@edulearn.dev')
    if (updated.id === 's1' && !updated.email.includes('student@edulearn.dev')) {
      updated.email = 'student@edulearn.dev'
    }
  }
  return updated
}

const load = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as T
    if (key === 'lms_users' && Array.isArray(parsed)) {
      return parsed.map((item) => sanitizeUser(item as unknown as User)) as unknown as T
    }
    if (key === 'lms_user' && parsed && typeof parsed === 'object') {
      return sanitizeUser(parsed as unknown as User) as unknown as T
    }
    return parsed
  } catch {
    return fallback
  }
}

/* ---------------- Auth ---------------- */
interface AuthState {
  user: User | null
  token: string | null
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}

export const login = createAsyncThunk('auth/login', async (p: { email: string; password: string }, { rejectWithValue }) => {
  try {
    return await authService.login(p.email, p.password)
  } catch (e) {
    return rejectWithValue(getErrorMessage(e))
  }
})

export const register = createAsyncThunk(
  'auth/register',
  async (p: { name: string; email: string; password: string; role: Role }, { rejectWithValue }) => {
    try {
      return await authService.register(p)
    } catch (e) {
      return rejectWithValue(getErrorMessage(e))
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: load<User | null>('lms_user', null),
    token: load<string | null>('lms_token_state', null),
    status: 'idle',
    error: null,
  } as AuthState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
    },
    updateProfile(state, a: PayloadAction<Partial<User>>) {
      if (state.user) state.user = { ...state.user, ...a.payload }
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (b) => {
    for (const thunk of [login, register]) {
      b.addCase(thunk.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      b.addCase(thunk.fulfilled, (s, a) => {
        s.status = 'idle'
        s.user = a.payload.user
        s.token = a.payload.token
      })
      b.addCase(thunk.rejected, (s, a) => {
        s.status = 'failed'
        s.error = (a.payload as string) ?? 'Authentication failed'
      })
    }
  },
})

/* ---------------- Courses ---------------- */
interface CoursesState {
  items: Course[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

export const fetchCourses = createAsyncThunk('courses/fetch', async (_, { rejectWithValue }) => {
  try {
    return await courseService.list()
  } catch (e) {
    return rejectWithValue(getErrorMessage(e))
  }
})

const coursesSlice = createSlice({
  name: 'courses',
  initialState: { items: [], status: 'idle', error: null } as CoursesState,
  reducers: {
    addCourse(state, a: PayloadAction<Course>) {
      state.items.unshift(a.payload)
    },
    updateCourse(state, a: PayloadAction<Partial<Course> & { id: string }>) {
      const i = state.items.findIndex((c) => c.id === a.payload.id)
      if (i >= 0) state.items[i] = { ...state.items[i], ...a.payload }
    },
    deleteCourse(state, a: PayloadAction<string>) {
      state.items = state.items.filter((c) => c.id !== a.payload)
    },
    addReview(state, a: PayloadAction<{ courseId: string; review: Course['reviews'][number] }>) {
      const c = state.items.find((x) => x.id === a.payload.courseId)
      if (c) {
        c.reviews.unshift(a.payload.review)
        c.reviewCount += 1
      }
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchCourses.pending, (s) => {
      s.status = 'loading'
      s.error = null
    })
    b.addCase(fetchCourses.fulfilled, (s, a) => {
      s.status = 'succeeded'
      // keep locally created courses when refetching
      const local = s.items.filter((c) => !a.payload.some((r) => r.id === c.id))
      s.items = [...local, ...a.payload]
    })
    b.addCase(fetchCourses.rejected, (s, a) => {
      s.status = 'failed'
      s.error = (a.payload as string) ?? 'Failed to load courses'
    })
  },
})

/* ---------------- Learning (enrollments, wishlist, quiz results) ---------------- */
interface LearningState {
  enrollments: Enrollment[]
  wishlist: string[]
  quizScores: Record<string, number>
  submissions: Record<string, string>
  subscription: string
}

const learningSlice = createSlice({
  name: 'learning',
  initialState: load<LearningState>('lms_learning', {
    enrollments: seedEnrollments,
    wishlist: ['c5', 'c2'],
    quizScores: {},
    submissions: {},
    subscription: 'Free',
  }),
  reducers: {
    enroll(state, a: PayloadAction<{ courseId: string; userId: string }>) {
      if (!state.enrollments.some((e) => e.courseId === a.payload.courseId && e.userId === a.payload.userId)) {
        state.enrollments.push({
          id: `e${Date.now()}`,
          courseId: a.payload.courseId,
          userId: a.payload.userId,
          enrolledAt: new Date().toISOString().slice(0, 10),
          completedLessons: [],
        })
      }
      state.wishlist = state.wishlist.filter((id) => id !== a.payload.courseId)
    },
    toggleWishlist(state, a: PayloadAction<string>) {
      state.wishlist = state.wishlist.includes(a.payload)
        ? state.wishlist.filter((id) => id !== a.payload)
        : [...state.wishlist, a.payload]
    },
    toggleLesson(state, a: PayloadAction<{ courseId: string; userId: string; lessonId: string; totalLessons: number }>) {
      const e = state.enrollments.find((x) => x.courseId === a.payload.courseId && x.userId === a.payload.userId)
      if (!e) return
      e.completedLessons = e.completedLessons.includes(a.payload.lessonId)
        ? e.completedLessons.filter((l) => l !== a.payload.lessonId)
        : [...e.completedLessons, a.payload.lessonId]
      e.completedAt = e.completedLessons.length >= a.payload.totalLessons ? (e.completedAt ?? new Date().toISOString().slice(0, 10)) : undefined
    },
    saveQuizScore(state, a: PayloadAction<{ key: string; score: number }>) {
      state.quizScores[a.payload.key] = a.payload.score
    },
    submitAssignment(state, a: PayloadAction<{ key: string; fileName: string }>) {
      state.submissions[a.payload.key] = a.payload.fileName
    },
    setSubscription(state, a: PayloadAction<string>) {
      state.subscription = a.payload
    },
  },
})

/* ---------------- Notifications ---------------- */
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: load<Notification[]>('lms_notifications', seedNotifications),
  reducers: {
    markRead: (s, a: PayloadAction<string>) => {
      const n = s.find((x) => x.id === a.payload)
      if (n) n.read = true
    },
    markAllRead: (s) => {
      s.forEach((n) => (n.read = true))
    },
    removeNotification: (s, a: PayloadAction<string>) => s.filter((n) => n.id !== a.payload),
    pushNotification: (s, a: PayloadAction<Omit<Notification, 'id' | 'read' | 'createdAt'>>) => {
      s.unshift({ ...a.payload, id: `n${Date.now()}`, read: false, createdAt: new Date().toISOString() })
    },
  },
})

/* ---------------- Platform users (admin) ---------------- */
const usersSlice = createSlice({
  name: 'users',
  initialState: load<User[]>('lms_users', seedUsers),
  reducers: {
    setUserStatus: (s, a: PayloadAction<{ id: string; status: 'active' | 'suspended' }>) => {
      const u = s.find((x) => x.id === a.payload.id)
      if (u) u.status = a.payload.status
    },
    removeUser: (s, a: PayloadAction<string>) => s.filter((u) => u.id !== a.payload),
  },
})

export const { logout, updateProfile, clearAuthError } = authSlice.actions
export const { addCourse, updateCourse, deleteCourse, addReview } = coursesSlice.actions
export const { enroll, toggleWishlist, toggleLesson, saveQuizScore, submitAssignment, setSubscription } = learningSlice.actions
export const { markRead, markAllRead, removeNotification, pushNotification } = notificationsSlice.actions
export const { setUserStatus, removeUser } = usersSlice.actions

export const reducers = {
  auth: authSlice.reducer,
  courses: coursesSlice.reducer,
  learning: learningSlice.reducer,
  notifications: notificationsSlice.reducer,
  users: usersSlice.reducer,
}
