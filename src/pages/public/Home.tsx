import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { courses, exams, faqs, features, testimonials } from '@/data/demo'
import { CourseCard, ExamCard } from '@/components/CatalogCards'
import DashboardPreview from '@/components/DashboardPreview'
import PlanCards from '@/components/PlanCards'
import Faq from '@/components/Faq'
import LoginRequiredModal from '@/components/LoginRequiredModal'

export default function Home() {
  const [gate, setGate] = useState<string | null>(null)
  const [t, setT] = useState(0)
  const cur = testimonials[t]
  const step = (d: number) => setT((i) => (i + d + testimonials.length) % testimonials.length)

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">Naik Kelas Lebih Cepat Bersama GradeUp</h1>
          <p className="mt-4 max-w-lg text-lg text-muted">Belajar dari materi terstruktur, latih dengan soal ujian, dan pantau kemajuanmu di satu dashboard.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/register" className="btn-primary px-6 py-3">Daftar Gratis</Link>
            <Link to="/exams" className="btn-ghost border border-border px-6 py-3">Lihat Paket Ujian</Link>
          </div>
        </div>
        <DashboardPreview />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Semua yang kamu butuhkan untuk belajar</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, desc, icon: Icon }) => (
            <div key={title} className="card p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-soft text-primary"><Icon size={20} /></span>
              <h3 className="mt-3 font-bold">{title}</h3>
              <p className="mt-1 text-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between"><h2 className="text-2xl font-extrabold tracking-tight">Materi pilihan</h2><Link to="/courses" className="text-sm font-semibold text-primary">Lihat semua</Link></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 3).map((c) => <CourseCard key={c.id} course={c} onAction={() => setGate('mulai belajar')} />)}
        </div>
        <div className="mt-12 flex items-end justify-between"><h2 className="text-2xl font-extrabold tracking-tight">Paket ujian populer</h2><Link to="/exams" className="text-sm font-semibold text-primary">Lihat semua</Link></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exams.slice(0, 3).map((e) => <ExamCard key={e.id} exam={e} onAction={() => setGate('mengerjakan ujian')} />)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Pilih paket belajarmu</h2>
        <div className="mt-8"><PlanCards /></div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="card p-8 text-center">
          <p className="text-lg font-medium">{cur.text}</p>
          <p className="mt-4 font-bold">{cur.name}</p>
          <p className="text-sm text-muted">{cur.role}</p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button className="btn-ghost h-9 w-9 !p-0" onClick={() => step(-1)} aria-label="Sebelumnya"><ChevronLeft size={18} /></button>
            {testimonials.map((x, i) => <span key={x.name} className={`h-2 w-2 rounded-full ${i === t ? 'bg-primary' : 'bg-border'}`} />)}
            <button className="btn-ghost h-9 w-9 !p-0" onClick={() => step(1)} aria-label="Berikutnya"><ChevronRight size={18} /></button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 pt-6">
        <h2 className="mb-6 text-2xl font-extrabold tracking-tight">Pertanyaan umum</h2>
        <Faq items={faqs.slice(0, 4)} />
      </section>
      <LoginRequiredModal open={gate !== null} onClose={() => setGate(null)} action={gate ?? ''} />
    </>
  )
}
