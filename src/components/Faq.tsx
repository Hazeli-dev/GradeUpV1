import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={it.q} className="card overflow-hidden">
          <button className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
            {it.q}
            <ChevronDown size={18} className={cn('shrink-0 text-muted transition-transform', open === i && 'rotate-180')} />
          </button>
          {open === i && <p className="px-5 pb-4 text-sm text-muted">{it.a}</p>}
        </div>
      ))}
    </div>
  )
}
