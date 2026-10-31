import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, X } from 'lucide-react'
import { questions, results, scoreOf } from '@/data/student'
import { cn } from '@/lib/utils'
import { fmtDate } from '@/utils/format'

export default function ResultDetail() {
  const { resultId } = useParams()
  const r = results.find((x) => x.id === resultId)
  if (!r) return <div className="p-6 text-center"><p className="text-muted">Hasil tidak ditemukan. Hasil ujian demo hilang saat halaman dimuat ulang.</p><Link to="/dashboard/results" className="btn-primary mt-4">Kembali ke hasil</Link></div>
  const { correct, total, score } = scoreOf(r.answers)
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
      <Link to="/dashboard/results" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-text"><ArrowLeft size={16} />Semua hasil</Link>
      <div className="card flex items-center gap-5 p-6">
        <span className="gradient-brand grid h-20 w-20 shrink-0 place-items-center rounded-2xl text-3xl font-extrabold text-white">{score}</span>
        <div><h1 className="text-lg font-extrabold leading-snug">{r.title}</h1>
          <p className="mt-1 text-sm text-muted">{fmtDate(r.date)} · {correct} dari {total} benar · {r.minutes} menit</p></div>
      </div>
      <h2 className="font-bold">Tinjauan jawaban</h2>
      {questions.map((q, i) => {
        const a = r.answers[i]; const ok = a === q.correct
        return (
          <div key={q.id} className="card p-5">
            <div className="flex items-start gap-3">
              <span className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-full text-white', ok ? 'bg-secondary' : 'bg-red-500')}>{ok ? <Check size={14} /> : <X size={14} />}</span>
              <div className="min-w-0">
                <p className="text-xs text-muted">Soal {i + 1} · {q.subject}</p><p className="font-semibold">{q.text}</p>
                <p className="mt-2 text-sm">Jawabanmu: <b>{a === null ? 'Tidak dijawab' : q.options[a]}</b></p>
                {!ok && <p className="text-sm">Jawaban benar: <b>{q.options[q.correct]}</b></p>}
                <p className="mt-2 rounded-lg bg-soft/50 p-3 text-sm text-muted">{q.explanation}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
