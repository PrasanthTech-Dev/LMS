import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { BookOpen, Award, Bell, Heart, LayoutDashboard, GraduationCap, Users, UserRound, DollarSign, FileText, Library, ClipboardList, TrendingUp, UserCog } from 'lucide-react'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { DashboardLayout, type NavItem } from '@/components/layout/DashboardLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Skeleton } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchCourses } from '@/store/slices'

const Home = lazy(() => import('@/pages/Home'))
const Courses = lazy(() => import('@/pages/Courses'))
const CourseDetails = lazy(() => import('@/pages/CourseDetails'))
const Instructors = lazy(() => import('@/pages/Instructors'))
const Pricing = lazy(() => import('@/pages/Pricing'))
const Login = lazy(() => import('@/pages/auth/Login'))
const Register = lazy(() => import('@/pages/auth/Register'))
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const Player = lazy(() => import('@/pages/student/Player'))

const StudentHome = lazy(() => import('@/pages/student/Overview'))
const MyLearning = lazy(() => import('@/pages/student/MyLearning'))
const Wishlist = lazy(() => import('@/pages/student/Wishlist'))
const Certificates = lazy(() => import('@/pages/student/Certificates'))
const Profile = lazy(() => import('@/pages/student/Profile'))
const Notifications = lazy(() => import('@/pages/student/Notifications'))

const InstructorHome = lazy(() => import('@/pages/instructor/Overview'))
const InstructorCourses = lazy(() => import('@/pages/instructor/Courses'))
const InstructorStudents = lazy(() => import('@/pages/instructor/Students'))
const InstructorPerformance = lazy(() => import('@/pages/instructor/Performance'))

const AdminHome = lazy(() => import('@/pages/admin/Overview'))
const AdminUsers = lazy(() => import('@/pages/admin/Users'))
const AdminCourses = lazy(() => import('@/pages/admin/Courses'))
const AdminEnrollments = lazy(() => import('@/pages/admin/Enrollments'))
const AdminRevenue = lazy(() => import('@/pages/admin/Revenue'))
const AdminReports = lazy(() => import('@/pages/admin/Reports'))

const ic = 'h-[18px] w-[18px]'
const studentNav: NavItem[] = [
  { to: '/dashboard', label: 'Overview', icon: <LayoutDashboard className={ic} />, end: true },
  { to: '/dashboard/my-learning', label: 'My Learning', icon: <BookOpen className={ic} /> },
  { to: '/dashboard/wishlist', label: 'Wishlist', icon: <Heart className={ic} /> },
  { to: '/dashboard/certificates', label: 'Certificates', icon: <Award className={ic} /> },
  { to: '/dashboard/notifications', label: 'Notifications', icon: <Bell className={ic} /> },
  { to: '/dashboard/profile', label: 'Profile', icon: <UserRound className={ic} /> },
  { to: '/courses', label: 'Browse Courses', icon: <Library className={ic} /> },
]
const instructorNav: NavItem[] = [
  { to: '/instructor', label: 'Dashboard', icon: <LayoutDashboard className={ic} />, end: true },
  { to: '/instructor/courses', label: 'My Courses', icon: <BookOpen className={ic} /> },
  { to: '/instructor/students', label: 'Students', icon: <Users className={ic} /> },
  { to: '/instructor/performance', label: 'Performance', icon: <TrendingUp className={ic} /> },
]
const adminNav: NavItem[] = [
  { to: '/admin', label: 'Overview', icon: <LayoutDashboard className={ic} />, end: true },
  { to: '/admin/students', label: 'Students', icon: <GraduationCap className={ic} /> },
  { to: '/admin/instructors', label: 'Instructors', icon: <UserCog className={ic} /> },
  { to: '/admin/courses', label: 'Courses', icon: <BookOpen className={ic} /> },
  { to: '/admin/enrollments', label: 'Enrollments', icon: <ClipboardList className={ic} /> },
  { to: '/admin/revenue', label: 'Revenue', icon: <DollarSign className={ic} /> },
  { to: '/admin/reports', label: 'Reports', icon: <FileText className={ic} /> },
]

const PageLoader = () => (
  <div className="container-x space-y-4 py-10" aria-busy="true" aria-label="Loading">
    <Skeleton className="h-10 w-1/3" />
    <Skeleton className="h-64 w-full" />
    <Skeleton className="h-40 w-full" />
  </div>
)

const ScrollToTop = () => {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

export default function App() {
  const dispatch = useAppDispatch()
  const status = useAppSelector((s) => s.courses.status)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchCourses())
  }, [dispatch, status])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:id" element={<CourseDetails />} />
            <Route path="instructors" element={<Instructors />} />
            <Route path="pricing" element={<Pricing />} />
          </Route>

          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />

          <Route element={<ProtectedRoute roles={['student']} />}>
            <Route path="learn/:courseId/:lessonId?" element={<Player />} />
            <Route path="dashboard" element={<DashboardLayout items={studentNav} section="Student" />}>
              <Route index element={<StudentHome />} />
              <Route path="my-learning" element={<MyLearning />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={['instructor']} />}>
            <Route path="instructor" element={<DashboardLayout items={instructorNav} section="Instructor" />}>
              <Route index element={<InstructorHome />} />
              <Route path="courses" element={<InstructorCourses />} />
              <Route path="students" element={<InstructorStudents />} />
              <Route path="performance" element={<InstructorPerformance />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="admin" element={<DashboardLayout items={adminNav} section="Admin" />}>
              <Route index element={<AdminHome />} />
              <Route path="students" element={<AdminUsers role="student" />} />
              <Route path="instructors" element={<AdminUsers role="instructor" />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="enrollments" element={<AdminEnrollments />} />
              <Route path="revenue" element={<AdminRevenue />} />
              <Route path="reports" element={<AdminReports />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

