export type Role = 'student' | 'instructor' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
  bio?: string
  phone?: string
  location?: string
  joinedAt: string
  status?: 'active' | 'suspended'
}

export type Level = 'Beginner' | 'Intermediate' | 'Advanced'

export interface Lesson {
  id: string
  title: string
  type: 'video' | 'reading' | 'quiz' | 'assignment'
  duration: number // minutes
  preview?: boolean
}

export interface Chapter {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Material {
  id: string
  name: string
  size: string
  type: 'PDF' | 'ZIP' | 'DOCX' | 'XLSX'
}

export interface Review {
  id: string
  user: string
  rating: number
  comment: string
  date: string
}

export interface Course {
  id: string
  title: string
  subtitle: string
  description: string
  category: string
  level: Level
  instructorId: string
  instructorName: string
  thumbnail: string
  price: number
  originalPrice: number
  rating: number
  reviewCount: number
  students: number
  duration: number // hours
  language: string
  updatedAt: string
  tags: string[]
  outcomes: string[]
  requirements: string[]
  chapters: Chapter[]
  materials: Material[]
  reviews: Review[]
  status: 'published' | 'draft' | 'pending'
  bestseller?: boolean
}

export interface Enrollment {
  id: string
  courseId: string
  userId: string
  enrolledAt: string
  completedLessons: string[]
  completedAt?: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  answer: number
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning'
  read: boolean
  createdAt: string
}

export interface Plan {
  id: string
  name: string
  price: number
  period: string
  features: string[]
  highlight?: boolean
}
