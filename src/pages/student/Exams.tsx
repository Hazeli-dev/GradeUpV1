import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { exams, levels } from '@/data/demo'
import { ExamCard } from '@/components/CatalogCards'

export default function Exams() {
  const nav = useNavigate()
  const [q, setQ] = useState(''); const [lvl, setLvl] = useState(''); const [diff, setDiff] = useState('')
  const list = useMemo(() => exams.filter((e) => e.title.toLowerCase().includes(q.trim().toLowerCase()) && (!lvl || e.level === lvl) && (!diff || e.difficulty === diff)), [q, lvl, diff])
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Paket Ujian</h1>
      <div className="grid gap-3 sm:grid-cols-[1fr_160px_160px]">
        <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input className="input pl-9" placeholder="Cari paket ujian" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari paket ujian" /></div>
        <select className="input" value={lvl} onChange={(e) => setLvl(e.target.value)} aria-label="Jenjang"><option value="">Semua jenjang</option>{levels.map((l) => <option key={l}>{l}</option>)}</select>
        <select className="input" value={diff} onChange={(e) => setDiff(e.target.value)} aria-label="Tingkat kesulitan"><option value="">Semua tingkat</option>{['Mudah', 'Sedang', 'Sulit'].map((d) => <option key={d}>{d}</option>)}</select>
      </div>
      {list.length === 0
        ? <p className="card p-8 text-center text-sm text-muted">Tidak ada paket ujian yang cocok dengan filter ini.</p>
        : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((e) => <ExamCard key={e.id} exam={e} onAction={() => nav(`/dashboard/exams/${e.id}`)} />)}</div>}
    </div>
  )
}
