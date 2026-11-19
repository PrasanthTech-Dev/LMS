import { useCallback, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/helpers'

/* ---------- Validation helpers ---------- */
export type Rule = (value: string, values: Record<string, string>) => string | undefined
export type Rules<V> = { [K in keyof V]?: Rule[] }

export const v = {
  required: (label = 'This field'): Rule => (x) => (x.trim() ? undefined : `${label} is required`),
  email: (): Rule => (x) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x) ? undefined : 'Enter a valid email address'),
  min: (n: number, label = 'Value'): Rule => (x) => (x.length >= n ? undefined : `${label} must be at least ${n} characters`),
  password: (): Rule => (x) =>
    /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(x) ? undefined : 'Use 8+ characters with letters and numbers',
  number: (label = 'Value'): Rule => (x) => (x !== '' && !Number.isNaN(Number(x)) && Number(x) >= 0 ? undefined : `${label} must be a valid number`),
  match: (field: string, msg: string): Rule => (x, vals) => (x === vals[field] ? undefined : msg),
}

/** Lightweight form hook with per-field validation, touched tracking and submit handling. */
export function useForm<V extends Record<string, string>>(initial: V, rules: Rules<V>) {
  const [values, setValues] = useState<V>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof V, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof V, boolean>>>({})

  const validateField = useCallback(
    (name: keyof V, vals: V) => {
      for (const rule of (rules[name] ?? []) as Rule[]) {
        const msg = rule(vals[name], vals)
        if (msg) return msg
      }
      return undefined
    },
    [rules],
  )

  const set = (name: keyof V, value: string) => {
    const next = { ...values, [name]: value }
    setValues(next)
    if (touched[name]) setErrors((e) => ({ ...e, [name]: validateField(name, next) }))
  }

  const field = (name: keyof V) => ({
    name: name as string,
    value: values[name],
    error: touched[name] ? errors[name] : undefined,
    onChange: (e: { target: { value: string } }) => set(name, e.target.value),
    onBlur: () => {
      setTouched((t) => ({ ...t, [name]: true }))
      setErrors((e) => ({ ...e, [name]: validateField(name, values) }))
    },
  })

  const validateAll = () => {
    const next: Partial<Record<keyof V, string>> = {}
    for (const k of Object.keys(values) as (keyof V)[]) next[k] = validateField(k, values)
    setErrors(next)
    setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])) as Partial<Record<keyof V, boolean>>)
    return Object.values(next).every((m) => !m)
  }

  const submit = (fn: (vals: V) => void) => (e: React.FormEvent) => {
    e.preventDefault()
    if (validateAll()) fn(values)
  }

  const reset = (vals: V = initial) => {
    setValues(vals)
    setErrors({})
    setTouched({})
  }

  return { values, field, submit, reset, setValues }
}

/* ---------- Field components ---------- */
interface FieldShell {
  label: string
  error?: string
  hint?: string
  children: ReactNode
  id: string
}
const Shell = ({ label, error, hint, children, id }: FieldShell) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-300">
      {label}
    </label>
    {children}
    {error ? (
      <p id={`${id}-err`} role="alert" className="mt-1.5 text-xs text-red-400">
        {error}
      </p>
    ) : (
      hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
    )}
  </div>
)

type FieldBase = { label: string; error?: string; hint?: string }

export const TextField = ({ label, error, hint, className, ...rest }: FieldBase & InputHTMLAttributes<HTMLInputElement>) => {
  const id = `f-${rest.name ?? label}`
  return (
    <Shell id={id} label={label} error={error} hint={hint}>
      <input id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={cn('input', error && 'border-red-500/60', className)} {...rest} />
    </Shell>
  )
}

export const TextArea = ({ label, error, hint, className, ...rest }: FieldBase & TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const id = `f-${rest.name ?? label}`
  return (
    <Shell id={id} label={label} error={error} hint={hint}>
      <textarea id={id} rows={4} aria-invalid={!!error} className={cn('input resize-y', error && 'border-red-500/60', className)} {...rest} />
    </Shell>
  )
}

export const SelectField = ({ label, error, hint, className, children, ...rest }: FieldBase & SelectHTMLAttributes<HTMLSelectElement>) => {
  const id = `f-${rest.name ?? label}`
  return (
    <Shell id={id} label={label} error={error} hint={hint}>
      <select id={id} aria-invalid={!!error} className={cn('input', error && 'border-red-500/60', className)} {...rest}>
        {children}
      </select>
    </Shell>
  )
}
