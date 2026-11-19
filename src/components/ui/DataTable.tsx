import { useMemo, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Search, SearchX } from 'lucide-react'
import { Button, EmptyState } from './index'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  sortValue?: (row: T) => string | number
  className?: string
}

interface Props<T> {
  rows: T[]
  columns: Column<T>[]
  rowKey: (row: T) => string
  searchText?: (row: T) => string
  searchPlaceholder?: string
  pageSize?: number
  toolbar?: ReactNode
  emptyTitle?: string
  emptyMessage?: string
}

export function DataTable<T>({ rows, columns, rowKey, searchText, searchPlaceholder = 'Search...', pageSize = 8, toolbar, emptyTitle = 'No results', emptyMessage = 'Nothing matches your search.' }: Props<T>) {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null)

  const data = useMemo(() => {
    let r = rows
    if (q.trim() && searchText) r = r.filter((x) => searchText(x).toLowerCase().includes(q.trim().toLowerCase()))
    if (sort) {
      const col = columns.find((c) => c.key === sort.key)
      if (col?.sortValue) r = [...r].sort((a, b) => (col.sortValue!(a) > col.sortValue!(b) ? 1 : -1) * sort.dir)
    }
    return r
  }, [rows, q, sort, columns, searchText])

  const pages = Math.max(1, Math.ceil(data.length / pageSize))
  const current = Math.min(page, pages - 1)
  const slice = data.slice(current * pageSize, current * pageSize + pageSize)

  return (
    <div className="space-y-4">
      {(searchText || toolbar) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {searchText && (
            <div className="relative w-full sm:max-w-xs">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={q} onChange={(e) => { setQ(e.target.value); setPage(0) }} placeholder={searchPlaceholder} aria-label={searchPlaceholder} className="input pl-9" />
            </div>
          )}
          {toolbar}
        </div>
      )}
      {data.length === 0 ? (
        <EmptyState icon={<SearchX size={24} />} title={emptyTitle} message={emptyMessage} />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-white/[0.06] bg-ink-900/60 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  {columns.map((c) => (
                    <th key={c.key} scope="col" className="px-4 py-3 font-medium">
                      {c.sortValue ? (
                        <button onClick={() => setSort((s) => (s?.key === c.key ? { key: c.key, dir: (s.dir * -1) as 1 | -1 } : { key: c.key, dir: 1 }))} className="inline-flex items-center gap-1 uppercase tracking-wider hover:text-white">
                          {c.header} {sort?.key === c.key && (sort.dir === 1 ? '↑' : '↓')}
                        </button>
                      ) : c.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {slice.map((r) => (
                  <tr key={rowKey(r)} className="transition hover:bg-white/[0.02]">
                    {columns.map((c) => <td key={c.key} className={`px-4 py-3.5 text-slate-300 ${c.className ?? ''}`}>{c.render(r)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pages > 1 && (
            <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3 text-xs text-slate-400">
              <span>Showing {current * pageSize + 1}–{Math.min(data.length, (current + 1) * pageSize)} of {data.length}</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" disabled={current === 0} onClick={() => setPage(current - 1)} aria-label="Previous page"><ChevronLeft size={15} /></Button>
                <span className="px-2">{current + 1} / {pages}</span>
                <Button variant="ghost" size="sm" disabled={current >= pages - 1} onClick={() => setPage(current + 1)} aria-label="Next page"><ChevronRight size={15} /></Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
