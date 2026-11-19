import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Badge, Button } from '@/components/ui'
import { useToast } from '@/components/ui/Toast'
import { useAppDispatch, useAppSelector } from '@/store'
import { pushNotification, setSubscription } from '@/store/slices'
import { plans } from '@/data/mock'
import { cn, formatPrice } from '@/utils/helpers'

const faqs = [
  ['Can I cancel anytime?', 'Yes. Subscriptions can be cancelled at any time and you keep access until the end of the billing period.'],
  ['Do I get certificates?', 'Pro and Teams plans include certificates of completion for every course you finish.'],
  ['Can I buy courses individually?', 'Absolutely. You can enrol in any course with a one-time purchase, without a subscription.'],
]

export default function Pricing() {
  const [yearly, setYearly] = useState(false)
  const nav = useNavigate()
  const toast = useToast()
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const current = useAppSelector((s) => s.learning.subscription)

  const choose = (name: string) => {
    if (!user) {
      toast('Log in to choose a plan', 'info')
      return nav('/login', { state: { from: '/pricing' } })
    }
    dispatch(setSubscription(name))
    dispatch(pushNotification({ title: 'Subscription updated', message: `You are now on the ${name} plan.`, type: 'success' }))
    toast(`Switched to the ${name} plan`)
  }

  return (
    <div className="container-x py-14">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl sm:text-5xl">Simple, transparent <span className="gradient-text">pricing</span></h1>
        <p className="mt-4 text-slate-400">Pick a plan that fits your learning goals. Upgrade or cancel whenever you like.</p>
        <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-white/10 bg-ink-900 p-1" role="group" aria-label="Billing period">
          {[false, true].map((y) => (
            <button key={String(y)} onClick={() => setYearly(y)} aria-pressed={yearly === y} className={cn('rounded-full px-5 py-2 text-sm font-medium transition', yearly === y ? 'bg-brand-600 text-white' : 'text-slate-400')}>
              {y ? 'Yearly' : 'Monthly'} {y && <span className="ml-1 text-xs text-emerald-300">-20%</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {plans.map((p, i) => {
          const price = yearly ? Math.round(p.price * 0.8) : p.price
          const active = current === p.name
          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={cn('card relative flex flex-col p-7', p.highlight && 'border-brand-500/60 shadow-2xl shadow-brand-600/20 md:-translate-y-3')}>
              {p.highlight && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 !bg-brand-600 !text-white">Most popular</Badge>}
              <h3 className="text-lg">{p.name}</h3>
              <p className="mt-4"><span className="text-4xl font-bold text-white">{formatPrice(price)}</span>{p.price > 0 && <span className="text-sm text-slate-400"> /month</span>}</p>
              <ul className="my-6 flex-1 space-y-3">
                {p.features.map((f) => <li key={f} className="flex gap-2.5 text-sm text-slate-300"><Check size={17} className="mt-0.5 shrink-0 text-brand-400" /> {f}</li>)}
              </ul>
              <Button variant={p.highlight ? 'primary' : 'outline'} disabled={active} onClick={() => choose(p.name)} className="w-full">{active ? 'Current plan' : p.price === 0 ? 'Get started' : `Choose ${p.name}`}</Button>
            </motion.div>
          )
        })}
      </div>

      <div className="mx-auto mt-20 max-w-3xl">
        <h2 className="mb-6 text-center text-2xl">Frequently asked questions</h2>
        <div className="space-y-3">
          {faqs.map(([q, a]) => (
            <details key={q} className="card group p-5">
              <summary className="cursor-pointer list-none font-medium text-white marker:hidden">{q}</summary>
              <p className="mt-3 text-sm text-slate-400">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
