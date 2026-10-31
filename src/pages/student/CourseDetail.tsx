import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Pause, Play } from 'lucide-react'
import { courses } from '@/data/demo'
import { questions } from '@/data/student'
import { cn } from '@/lib/utils'

const lessonNames = ['Pengantar', 'Konsep dasar', 'Contoh soal', 'Latihan terpandu', 'Kesalahan umum', 'Rangkuman', 'Latihan mandiri', 'Evaluasi']

function QuizPreview() {
  const [picked, setPicked] = useState<Record<string, number>>({})
  return (
    <div className="space-y-4">
      {questions.slice(0, 2).map((q) => (
        <div key={q.id}>
          <p className="text-sm font-semibold">{q.text}</p>
          <div className="mt-2 grid gap-2">
            {q.options.map((o, i) => {
              const has = picked[q.id] !== undefined
              return (
                <button key={o} disabled={has} onClick={() => setPicked({ ...picked, [q.id]: i })}
                  className={cn('rounded-xl border px-3 py-2 text-left text-sm', !has && 'border-border hover:bg-soft/50',
                    has && i === q.correct && 'border-secondary bg-secondary/10', has && picked[q.id] === i && i !== q.correct && 'border-red-500 bg-red-500/10', has && i !== q.correct && picked[q.id] !== i && 'border-border opacity-60')}>
                  {o}
                </button>
              )
            })}
          </div>
          {picked[q.id] !== undefined && <p className="mt-2 text-xs text-muted">{q.explanation}</p>}
        </div>
      ))}
    </div>
  )
}

export default function CourseDetail() {
  const { courseId } = useParams()
  const course = courses.find((c) => c.id === courseId)
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setPct((p) => (p >= 100 ? 100 : p + 2)), 300)
    return () => clearInterval(t)
  }, [playing])
  useEffect(() => { if (pct >= 100) setPlaying(false) }, [pct])

  if (!course) return <div className="p-6 text-center"><p className="text-muted">Materi tidak ditemukan.</p><Link to="/dashboard/courses" className="btn-primary mt-4">Kembali ke materi</Link></div>
  const shown = Math.min(course.lessons, lessonNames.length)

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <Link to="/dashboard/courses" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-text"><ArrowLeft size={16} />Semua materi</Link>
      <div><p className="text-xs font-semibold text-primary">{course.category} · {course.level}</p><h1 className="text-2xl font-extrabold tracking-tight">{course.title}</h1></div>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="gradient-brand relative grid aspect-video place-items-center text-white">
              <button onClick={() => { if (pct >= 100) setPct(0); setPlaying((p) => !p) }} className="grid h-16 w-16 place-items-center rounded-full bg-white/20 backdrop-blur" aria-label={playing ? 'Jeda' : 'Putar'}>
                {playing ? <Pause size={28} /> : <Play size={28} />}
              </button>
              <p className="absolute bottom-6 left-4 text-sm font-semibold">Pelajaran {active + 1}: {lessonNames[active]}</p>
              <div className="absolute inset-x-0 bottom-0 h-1.5 bg-white/25"><div className="h-full bg-white" style={{ width: `${pct}%` }} /></div>
            </div>
            <p className="p-3 text-xs text-muted">Pemutar contoh (demo). Video asli belum tersedia.</p>
          </div>
          <div className="card p-5"><h2 className="mb-3 font-bold">Pratinjau kuis</h2><QuizPreview /></div>
        </div>
        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="mb-3 font-bold">Tujuan belajar</h2>
            <ul className="space-y-2 text-sm">{['Memahami konsep inti topik ini', 'Mengerjakan soal latihan dengan benar', 'Mengenali kesalahan yang sering terjadi'].map((x) => <li key={x} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-secondary" />{x}</li>)}</ul>
          </div>
          <div className="card p-5">
            <h2 className="mb-3 font-bold">Daftar pelajaran</h2>
            <ol className="space-y-1">
              {lessonNames.slice(0, shown).map((n, i) => (
                <li key={n}><button onClick={() => { setActive(i); setPct(0); setPlaying(false) }}
                  className={cn('w-full rounded-lg px-3 py-2 text-left text-sm', active === i ? 'bg-soft font-semibold text-primary' : 'hover:bg-soft/50')}>{i + 1}. {n}</button></li>
              ))}
            </ol>
            {course.lessons > shown && <p className="mt-2 px-3 text-xs text-muted">dan {course.lessons - shown} pelajaran lainnya</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
