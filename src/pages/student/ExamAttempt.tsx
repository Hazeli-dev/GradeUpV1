import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Timer } from 'lucide-react'
import { exams, type Exam } from '@/data/demo'
import { addResult, questions, student } from '@/data/student'
import Modal from '@/components/Modal'
import { cn } from '@/lib/utils'
import { fmtClock } from '@/utils/format'

function Workspace({ exam }: { exam: Exam }) {
  const nav = useNavigate()
  const total = exam.minutes * 60
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null))
  const [cur, setCur] = useState(0)
  const [left, setLeft] = useState(total)
  const [confirm, setConfirm] = useState(false)
  const done = useRef(false)
  const stateRef = useRef({ answers, left })
  stateRef.current = { answers, left }

  const submit = () => {
    if (done.current) return
    done.current = true
    const id = `r${Date.now()}`
    addResult({ id, examId: exam.id, title: exam.title, date: new Date().toISOString().slice(0, 10), answers: stateRef.current.answers, minutes: Math.max(1, Math.round((total - stateRef.current.left) / 60)) })
    nav(`/dashboard/results/${id}`, { replace: true })
  }

  useEffect(() => {
    const t = setInterval(() => setLeft((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [])
  useEffect(() => { if (left <= 0) submit() }) // eslint-disable-line

  const q = questions[cur]
  const answered = answers.filter((a) => a !== null).length

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-4 md:p-6">
      <div className="card flex items-center justify-between gap-3 p-4">
        <p className="truncate font-bold">{exam.title}</p>
        <span className={cn('flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold tabular-nums', left < 60 ? 'bg-red-500/10 text-red-600' : 'bg-soft text-primary')}><Timer size={16} />{fmtClock(Math.max(left, 0))}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <div className="card p-6">
          <p className="text-xs font-semibold text-primary">Soal {cur + 1} dari {questions.length} · {q.subject}</p>
          <h2 className="mt-2 text-lg font-bold leading-snug">{q.text}</h2>
          <div className="mt-5 grid gap-2.5">
            {q.options.map((o, i) => (
              <button key={o} onClick={() => setAnswers(answers.map((a, k) => (k === cur ? i : a)))} aria-pressed={answers[cur] === i}
                className={cn('flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm', answers[cur] === i ? 'border-primary bg-soft/60 font-semibold' : 'border-border hover:bg-soft/40')}>
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-xs">{'ABCD'[i]}</span>{o}
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-between gap-2">
            <button className="btn-ghost border border-border" disabled={cur === 0} onClick={() => setCur(cur - 1)}>Sebelumnya</button>
            {cur < questions.length - 1
              ? <button className="btn-primary" onClick={() => setCur(cur + 1)}>Berikutnya</button>
              : <button className="btn-primary" onClick={() => setConfirm(true)}>Kumpulkan</button>}
          </div>
        </div>
        <div className="card h-fit p-5">
          <p className="text-sm font-bold">Navigasi soal</p>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {questions.map((x, i) => (
              <button key={x.id} onClick={() => setCur(i)} aria-label={`Soal ${i + 1}`}
                className={cn('h-9 rounded-lg border text-sm font-semibold', i === cur && 'ring-2 ring-primary', answers[i] !== null ? 'border-primary bg-primary text-white' : 'border-border')}>{i + 1}</button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">{answered} dari {questions.length} soal terjawab</p>
          <button className="btn-primary mt-4 w-full" onClick={() => setConfirm(true)}>Kumpulkan ujian</button>
        </div>
      </div>
      <Modal open={confirm} onClose={() => setConfirm(false)} title="Kumpulkan ujian?">
        <p className="text-sm text-muted">{answered < questions.length ? `Masih ada ${questions.length - answered} soal belum dijawab. ` : ''}Setelah dikumpulkan, jawaban tidak bisa diubah.</p>
        <div className="mt-5 flex gap-2">
          <button className="btn-ghost flex-1 border border-border" onClick={() => setConfirm(false)}>Kembali mengerjakan</button>
          <button className="btn-primary flex-1" onClick={submit}>Ya, kumpulkan</button>
        </div>
      </Modal>
    </div>
  )
}

export default function ExamAttempt() {
  const { examId } = useParams()
  const exam = exams.find((e) => e.id === examId)
  if (!exam) return <div className="p-6 text-center"><p className="text-muted">Paket ujian tidak ditemukan.</p><Link to="/dashboard/exams" className="btn-primary mt-4">Kembali</Link></div>
  if (exam.premium && !student.isPremium) return <div className="p-6 text-center"><p className="text-muted">Paket ini khusus Premium.</p><Link to={`/dashboard/exams/${exam.id}`} className="btn-primary mt-4">Kembali ke detail</Link></div>
  return <Workspace exam={exam} />
}
