import { AlertTriangle, Bell, CheckCircle2, Info, Trash2 } from 'lucide-react'
import { Button, EmptyState, PageHeader } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { markAllRead, markRead, removeNotification } from '@/store/slices'
import { cn, timeAgo } from '@/utils/helpers'

const icons = {
  success: <CheckCircle2 className="text-emerald-400" size={20} />,
  info: <Info className="text-brand-400" size={20} />,
  warning: <AlertTriangle className="text-amber-400" size={20} />,
}

export default function Notifications() {
  const items = useAppSelector((s) => s.notifications)
  const dispatch = useAppDispatch()
  const unread = items.filter((n) => !n.read).length

  return (
    <>
      <PageHeader title="Notifications" subtitle={unread ? `${unread} unread` : 'You are all caught up'} actions={unread > 0 ? <Button variant="outline" onClick={() => dispatch(markAllRead())}>Mark all as read</Button> : undefined} />
      {items.length === 0 ? (
        <EmptyState icon={<Bell size={26} />} title="No notifications" message="Updates about your courses and certificates will appear here." />
      ) : (
        <ul className="space-y-3">
          {items.map((n) => (
            <li key={n.id} className={cn('card flex items-start gap-4 p-4', !n.read && 'border-brand-500/30 bg-brand-500/5')}>
              <span className="mt-0.5">{icons[n.type]}</span>
              <button onClick={() => dispatch(markRead(n.id))} className="min-w-0 flex-1 text-left">
                <span className="block font-medium text-white">{n.title}</span>
                <span className="block text-sm text-slate-400">{n.message}</span>
                <span className="mt-1 block text-xs text-slate-500">{timeAgo(n.createdAt)}</span>
              </button>
              {!n.read && <span className="mt-2 h-2 w-2 rounded-full bg-brand-500" aria-label="Unread" />}
              <button onClick={() => dispatch(removeNotification(n.id))} aria-label="Delete notification" className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400"><Trash2 size={16} /></button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
