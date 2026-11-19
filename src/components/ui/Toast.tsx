import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, XCircle } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'
interface ToastItem {
  id: number
  message: string
  type: ToastType
}

const ToastCtx = createContext<(message: string, type?: ToastType) => void>(() => {})
export const useToast = () => useContext(ToastCtx)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ToastItem[]>([])

  const push = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now() + Math.random()
    setItems((s) => [...s, { id, message, type }])
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 3500)
  }, [])

  const value = useMemo(() => push, [push])
  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-400" />,
    error: <XCircle size={18} className="text-red-400" />,
    info: <Info size={18} className="text-brand-400" />,
  }

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2" aria-live="polite">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="pointer-events-auto flex items-center gap-3 rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-white shadow-2xl"
            >
              {icons[t.type]}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}
