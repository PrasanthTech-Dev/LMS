import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store'
import { dashboardPath } from '@/utils/routes'
import type { Role } from '@/types'

export const ProtectedRoute = ({ roles }: { roles: Role[] }) => {
  const user = useAppSelector((s) => s.auth.user)
  const loc = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  if (!roles.includes(user.role)) return <Navigate to={dashboardPath(user.role)} replace />
  return <Outlet />
}
