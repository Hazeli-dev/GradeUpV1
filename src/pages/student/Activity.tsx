import { useState } from 'react'
import { BookOpen, ClipboardCheck, UserCog } from 'lucide-react'
import { activities, type ActivityType } from '@/data/student'
import { cn } from '@/lib/utils'
import { fmtDate } from '@/utils/format'

const filters: { id: 'semua' | ActivityType; label: string }[] = [
  { id: 'semua', label: 'Semua' }, { id: 'materi', label: 'Materi' }, { id: 'ujian', label: 'Ujian' }, { id: 'akun', label: 'Akun' },
]
const icons = { materi: BookOpen, ujian: ClipboardCheck, akun: UserCog }

export default function Activity() {
  const [f, setF] = useState<'semua' | ActivityType>('semua')
  const list = activities.filter((a) => f === 'semua' || a.type === f)
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Riwayat Aktivitas</h1>
      <div className="flex flex-wrap gap-2">
        {filters.map((x) => <button key={x.id} aria-pressed={f === x.id} onClick={() => setF(x.id)}
          className={cn('rounded-full border px-4 py-1.5 text-sm font-semibold', f === x.id ? 'gradient-brand border-transparent text-white' : 'border-border text-muted')}>{x.label}</button>)}
      </div>
      {list.length === 0 ? <p className="card p-8 text-center text-sm text-muted">Belum ada aktivitas untuk filter ini.</p> : (
        <ol className="relative space-y-5 border-l border-border pl-6">
          {list.map((a) => { const Icon = icons[a.type]; return (
            <li key={a.id} className="relative">
              <span className="absolute -left-[37px] grid h-7 w-7 place-items-center rounded-full bg-soft text-primary"><Icon size={14} /></span>
              <p className="text-sm font-medium">{a.text}</p><p className="text-xs text-muted">{fmtDate(a.date)}</p>
            </li>) })}
        </ol>)}
    </div>
  )
}
