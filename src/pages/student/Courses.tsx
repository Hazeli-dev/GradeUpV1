import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { categories, courses, levels } from '@/data/demo'
import { CourseCard } from '@/components/CatalogCards'

export default function Courses() {
  const nav = useNavigate()
  const [q, setQ] = useState(''); const [cat, setCat] = useState(''); const [lvl, setLvl] = useState('')
  const list = useMemo(() => courses.filter((c) => c.title.toLowerCase().includes(q.trim().toLowerCase()) && (!cat || c.category === cat) && (!lvl || c.level === lvl)), [q, cat, lvl])
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Materi Belajar</h1>
      <div className="grid gap-3 sm:grid-cols-[1fr_200px_160px]">
        <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input className="input pl-9" placeholder="Cari materi" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari materi" /></div>
        <select className="input" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Kategori"><option value="">Semua kategori</option>{categories.map((c) => <option key={c}>{c}</option>)}</select>
        <select className="input" value={lvl} onChange={(e) => setLvl(e.target.value)} aria-label="Jenjang"><option value="">Semua jenjang</option>{levels.map((l) => <option key={l}>{l}</option>)}</select>
      </div>
      {list.length === 0
        ? <p className="card p-8 text-center text-sm text-muted">Tidak ada materi yang cocok dengan filter ini.</p>
        : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((c) => <CourseCard key={c.id} course={c} onAction={() => nav(`/dashboard/courses/${c.id}`)} />)}</div>}
    </div>
  )
}
