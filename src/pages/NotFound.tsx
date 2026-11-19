import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="gradient-text text-7xl font-bold">404</p>
      <h1 className="mt-4 text-2xl">Page not found</h1>
      <p className="mt-2 max-w-md text-slate-400">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="mt-6"><Button>Back to home</Button></Link>
    </div>
  )
}
