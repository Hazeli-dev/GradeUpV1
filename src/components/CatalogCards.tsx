import { BookOpen, ClipboardList, Clock, Lock, Star } from 'lucide-react'
import type { Course, Exam } from '@/data/demo'

const Thumb = ({ exam }: { exam?: boolean }) => (
  <div className="gradient-brand grid h-28 place-items-center rounded-xl text-white/90">
    {exam ? <ClipboardList size={34} /> : <BookOpen size={34} />}
  </div>
)

export function CourseCard({ course, onAction }: { course: Course; onAction: () => void }) {
  return (
    <article className="card flex flex-col gap-3 p-4">
      <Thumb />
      <p className="text-xs font-semibold text-primary">{course.category} · {course.level}</p>
      <h3 className="flex-1 font-bold leading-snug">{course.title}</h3>
      <p className="flex items-center gap-3 text-xs text-muted">
        <span>{course.lessons} pelajaran</span><span className="flex items-center gap-1"><Clock size={12} />{course.hours} jam</span>
        <span className="flex items-center gap-1"><Star size={12} />{course.rating}</span>
      </p>
      <button className="btn-primary" onClick={onAction}>Mulai belajar</button>
    </article>
  )
}

export function ExamCard({ exam, onAction }: { exam: Exam; onAction: () => void }) {
  return (
    <article className="card flex flex-col gap-3 p-4">
      <Thumb exam />
      <p className="flex items-center gap-2 text-xs font-semibold text-primary">
        {exam.level} · {exam.difficulty}{exam.premium && <span className="flex items-center gap-1 text-muted"><Lock size={11} />Premium</span>}
      </p>
      <h3 className="flex-1 font-bold leading-snug">{exam.title}</h3>
      <p className="flex gap-3 text-xs text-muted"><span>{exam.questions} soal</span><span className="flex items-center gap-1"><Clock size={12} />{exam.minutes} menit</span></p>
      <button className="btn-primary" onClick={onAction}>Kerjakan ujian</button>
    </article>
  )
}
