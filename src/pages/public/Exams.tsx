import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { exams, levels } from '@/data/demo'
import { ExamCard } from '@/components/CatalogCards'
import PageHeader from '@/components/PageHeader'
import LoginRequiredModal from '@/components/LoginRequiredModal'

export default function Exams() {
  const [q, setQ] = useState(''); const [lvl, setLvl] = useState(''); const [gate, setGate] = useState(false)
  const list = useMemo(() => exams.filter((e) => e.title.toLowerCase().includes(q.trim().toLowerCase()) && (!lvl || e.level === lvl)), [q, lvl])

  return (
    <>
      <PageHeader title="Katalog Ujian" subtitle="Try out dan simulasi dengan durasi dan jumlah soal yang jelas." />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
          <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input className="input pl-9" placeholder="Cari paket ujian" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari paket ujian" /></div>
          <select className="input" value={lvl} onChange={(e) => setLvl(e.target.value)} aria-label="Jenjang"><option value="">Semua jenjang</option>{levels.map((l) => <option key={l}>{l}</option>)}</select>
        </div>
        {list.length === 0
          ? <p className="card mt-8 p-8 text-center text-sm text-muted">Tidak ada paket ujian yang cocok.</p>
          : <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((e) => <ExamCard key={e.id} exam={e} onAction={() => setGate(true)} />)}</div>}
      </div>
      <LoginRequiredModal open={gate} onClose={() => setGate(false)} action="mengerjakan ujian" />
    </>
  )
}
