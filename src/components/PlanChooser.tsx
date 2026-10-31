import { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const perks = ['Semua materi dan paket ujian', 'Pembahasan lengkap setiap soal', 'Statistik belajar mendalam']
type Period = 'monthly' | 'yearly'

export default function PlanChooser({ onConfirm }: { onConfirm: (p: Period) => void }) {
  const [p, setP] = useState<Period>('monthly')
  const opts: { id: Period; label: string; price: string; note: string }[] = [
    { id: 'monthly', label: 'Bulanan', price: 'Rp49.000', note: 'per bulan' },
    { id: 'yearly', label: 'Tahunan', price: 'Rp399.000', note: 'per tahun, hemat sekitar 32%' },
  ]
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {opts.map((o) => (
          <button key={o.id} onClick={() => setP(o.id)} aria-pressed={p === o.id}
            className={cn('rounded-2xl border p-4 text-left transition-colors', p === o.id ? 'border-primary bg-soft/50 ring-2 ring-primary/30' : 'border-border')}>
            <p className="text-sm font-semibold">{o.label}</p>
            <p className="mt-1 text-xl font-extrabold">{o.price}</p>
            <p className="text-xs text-muted">{o.note}</p>
          </button>
        ))}
      </div>
      <ul className="my-4 space-y-2 text-sm">
        {perks.map((x) => <li key={x} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-secondary" />{x}</li>)}
      </ul>
      <button className="btn-primary w-full" onClick={() => onConfirm(p)}>Upgrade ke Premium</button>
    </div>
  )
}
