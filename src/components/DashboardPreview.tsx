const bars = [38, 55, 44, 70, 62, 85, 74]
const days = ['S', 'S', 'R', 'K', 'J', 'S', 'M']

export default function DashboardPreview() {
  return (
    <div className="card p-5" aria-hidden="true">
      <div className="grid grid-cols-3 gap-3">
        {[['Rata-rata nilai', '82'], ['Ujian selesai', '14'], ['Streak', '9 hari']].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-soft/60 p-3"><p className="text-xs text-muted">{k}</p><p className="mt-1 text-lg font-extrabold">{v}</p></div>
        ))}
      </div>
      <p className="mt-5 text-xs font-semibold text-muted">Aktivitas minggu ini</p>
      <div className="mt-2 flex h-32 items-end gap-2">
        {bars.map((h, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div className="gradient-brand w-full rounded-t-lg" style={{ height: `${h}%` }} />
            <span className="text-[10px] text-muted">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
