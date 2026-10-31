import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BookOpen, ClipboardCheck, Flame, Target } from 'lucide-react'
import { courses } from '@/data/demo'
import { activities, progress, results, scoreOf, streakDays, student, weekly } from '@/data/student'
import StatCard from '@/components/StatCard'
import ChartCard, { axisProps, tooltipStyle } from '@/components/ChartCard'
import { fmtDate } from '@/utils/format'

export default function Overview() {
  const avg = Math.round(results.reduce((s, r) => s + scoreOf(r.answers).score, 0) / Math.max(results.length, 1))
  const days = ['S', 'S', 'R', 'K', 'J', 'S', 'M']
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div className="card flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-4">
          <span className="gradient-brand grid h-14 w-14 place-items-center rounded-2xl text-xl font-extrabold text-white">{student.name.charAt(0)}</span>
          <div><h1 className="text-xl font-extrabold tracking-tight">Halo, {student.name.split(' ')[0]}!</h1>
            <p className="text-sm text-muted">Jenjang {student.level} · Paket {student.plan}</p></div>
        </div>
        <Link to="/dashboard/upgrade" className="btn-primary">Upgrade Premium</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Rata-rata nilai" value={String(avg)} icon={Target} />
        <StatCard label="Ujian selesai" value={String(results.length)} icon={ClipboardCheck} />
        <StatCard label="Materi diikuti" value={String(progress.length)} icon={BookOpen} />
        <StatCard label="Streak belajar" value="9 hari" icon={Flame} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Aktivitas belajar minggu ini (menit)">
            <ResponsiveContainer><BarChart data={weekly}><CartesianGrid stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />
              <XAxis dataKey="day" {...axisProps} /><YAxis {...axisProps} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="menit" name="Menit" fill="#10B981" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer>
          </ChartCard>
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-bold">Streak 7 hari</h3>
          <div className="mt-4 flex justify-between">
            {streakDays.map((on, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <span className={`grid h-8 w-8 place-items-center rounded-full ${on ? 'gradient-brand text-white' : 'bg-border'}`}><Flame size={14} /></span>
                <span className="text-[10px] text-muted">{days[i]}</span>
              </div>
            ))}
          </div>
          <h3 className="mb-3 mt-6 text-sm font-bold">Progres materi</h3>
          <div className="space-y-3">
            {progress.map((p) => {
              const c = courses.find((x) => x.id === p.courseId)
              return (
                <Link key={p.courseId} to={`/dashboard/courses/${p.courseId}`} className="block">
                  <div className="flex justify-between text-xs"><span className="truncate pr-2">{c?.title}</span><span className="text-muted">{p.pct}%</span></div>
                  <div className="mt-1 h-2 rounded-full bg-border"><div className="gradient-brand h-2 rounded-full" style={{ width: `${p.pct}%` }} /></div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <div className="mb-3 flex justify-between"><h3 className="text-sm font-bold">Aktivitas terbaru</h3><Link to="/dashboard/activity" className="text-xs font-semibold text-primary">Lihat semua</Link></div>
          <ul className="space-y-3 text-sm">{activities.slice(0, 4).map((a) => <li key={a.id}><p>{a.text}</p><p className="text-xs text-muted">{fmtDate(a.date)}</p></li>)}</ul>
        </div>
        <div className="card p-5">
          <h3 className="mb-3 text-sm font-bold">Rekomendasi untukmu</h3>
          <ul className="space-y-3 text-sm">
            {courses.filter((c) => c.level === student.level || c.level === 'Umum').slice(0, 3).map((c) => (
              <li key={c.id}><Link to={`/dashboard/courses/${c.id}`} className="font-semibold hover:text-primary">{c.title}</Link><p className="text-xs text-muted">{c.category} · {c.lessons} pelajaran</p></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
