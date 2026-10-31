import { Link } from 'react-router-dom'
import { Award, ClipboardCheck, Target } from 'lucide-react'
import { results, scoreOf } from '@/data/student'
import StatCard from '@/components/StatCard'
import { fmtDate } from '@/utils/format'

export default function Results() {
  const rows = results.map((r) => ({ r, ...scoreOf(r.answers) }))
  const avg = rows.length ? Math.round(rows.reduce((s, x) => s + x.score, 0) / rows.length) : 0
  const best = rows.length ? Math.max(...rows.map((x) => x.score)) : 0
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Hasil Belajar</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Rata-rata nilai" value={String(avg)} icon={Target} />
        <StatCard label="Nilai tertinggi" value={String(best)} icon={Award} />
        <StatCard label="Ujian selesai" value={String(rows.length)} icon={ClipboardCheck} />
      </div>
      {rows.length === 0 ? <p className="card p-8 text-center text-sm text-muted">Belum ada hasil. Kerjakan paket ujian pertamamu.</p> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead><tr className="border-b border-border text-muted"><th className="p-4">Paket ujian</th><th className="p-4">Tanggal</th><th className="p-4">Benar</th><th className="p-4">Nilai</th><th className="p-4" /></tr></thead>
            <tbody>{rows.map(({ r, correct, total, score }) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="p-4 font-medium">{r.title}</td><td className="p-4 text-muted">{fmtDate(r.date)}</td><td className="p-4">{correct}/{total}</td>
                <td className="p-4 font-bold">{score}</td><td className="p-4 text-right"><Link to={`/dashboard/results/${r.id}`} className="font-semibold text-primary">Tinjau</Link></td>
              </tr>))}</tbody>
          </table>
        </div>)}
    </div>
  )
}
