import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { Button, EmptyState, PageHeader, Rating, Skeleton } from '@/components/ui'
import { useToast } from '@/components/ui/Toast'
import { useAppDispatch, useAppSelector } from '@/store'
import { toggleWishlist } from '@/store/slices'
import { formatPrice } from '@/utils/helpers'

export default function Wishlist() {
  const { items, status } = useAppSelector((s) => s.courses)
  const wishlist = useAppSelector((s) => s.learning.wishlist)
  const dispatch = useAppDispatch()
  const toast = useToast()
  const list = items.filter((c) => wishlist.includes(c.id))

  return (
    <>
      <PageHeader title="My Wishlist" subtitle={`Courses you saved for later · ${list.length} saved`} />
      {status === 'loading' || status === 'idle' ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
      ) : list.length === 0 ? (
        <EmptyState icon={<Heart size={26} />} title="Your wishlist is empty" message="Tap the heart on any course to save it for later." action={<Link to="/courses"><Button>Explore courses</Button></Link>} />
      ) : (
        <ul className="space-y-3">
          {list.map((c) => (
            <li key={c.id} className="card flex items-center gap-4 p-3 sm:p-4">
              <img src={c.thumbnail} alt="" className="h-16 w-28 shrink-0 rounded-lg object-cover sm:h-20 sm:w-36" />
              <div className="min-w-0 flex-1">
                <Link to={`/courses/${c.id}`} className="line-clamp-1 font-semibold text-white hover:text-brand-300">{c.title}</Link>
                <div className="mt-1 hidden sm:block"><Rating value={c.rating} size={12} /></div>
                <p className="mt-1 text-sm font-semibold text-brand-300">{formatPrice(c.price)}</p>
              </div>
              <Link to={`/courses/${c.id}`}><Button size="sm">View Details</Button></Link>
              <button onClick={() => { dispatch(toggleWishlist(c.id)); toast('Removed from wishlist', 'info') }} aria-label={`Remove ${c.title} from wishlist`} className="rounded-lg p-2 transition hover:bg-red-500/10"><Heart size={20} className="fill-red-500 text-red-500" /></button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
