import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, ListChecks, Lock } from 'lucide-react'
import { exams } from '@/data/demo'
import { student } from '@/data/student'
import Modal from '@/components/Modal'
import PremiumUpgradeModal from '@/components/PremiumUpgradeModal'

const rules = [
  'Waktu berjalan sejak kamu menekan “Mulai sekarang” dan tidak bisa dijeda.',
  'Kamu boleh berpindah antarsoal dan mengubah jawaban sebelum mengumpulkan.',
  'Ujian otomatis dikumpulkan saat waktu habis.',
  'Versi demo ini memakai 10 soal contoh dan hasilnya tidak tersimpan permanen.',
]

export default function ExamDetail() {
  const { examId } = useParams()
  const nav = useNavigate()
  const exam = exams.find((e) => e.id === examId)
  const [info, setInfo] = useState(false)
  const [upgrade, setUpgrade] = useState(false)

  if (!exam) return <div className="p-6 text-center"><p className="text-muted">Paket ujian tidak ditemukan.</p><Link to="/dashboard/exams" className="btn-primary mt-4">Kembali ke paket ujian</Link></div>
  const locked = exam.premium && !student.isPremium

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
      <Link to="/dashboard/exams" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-text"><ArrowLeft size={16} />Semua paket ujian</Link>
      <div className="card p-6">
        <p className="text-xs font-semibold text-primary">{exam.level} · {exam.difficulty}</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">{exam.title}</h1>
        <div className="mt-4 flex flex-wrap gap-5 text-sm text-muted">
          <span className="flex items-center gap-1.5"><ListChecks size={16} />{exam.questions} soal</span>
          <span className="flex items-center gap-1.5"><Clock size={16} />{exam.minutes} menit</span>
          {exam.premium && <span className="flex items-center gap-1.5"><Lock size={16} />Premium</span>}
        </div>
        <button className="btn-primary mt-6 w-full sm:w-auto" onClick={() => (locked ? setUpgrade(true) : setInfo(true))}>
          {locked ? 'Upgrade untuk membuka' : 'Lihat petunjuk dan mulai'}
        </button>
      </div>
      <Modal open={info} onClose={() => setInfo(false)} title="Petunjuk ujian">
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted">{rules.map((r) => <li key={r}>{r}</li>)}</ul>
        <div className="mt-5 flex gap-2">
          <button className="btn-ghost flex-1 border border-border" onClick={() => setInfo(false)}>Batal</button>
          <button className="btn-primary flex-1" onClick={() => nav(`/dashboard/exams/${exam.id}/attempt`)}>Mulai sekarang</button>
        </div>
      </Modal>
      <PremiumUpgradeModal open={upgrade} onClose={() => setUpgrade(false)} />
    </div>
  )
}
