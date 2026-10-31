import type { LucideIcon } from 'lucide-react'

export default function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="card flex items-center gap-4 p-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-soft text-primary"><Icon size={20} /></span>
      <div><p className="text-xs text-muted">{label}</p><p className="text-xl font-extrabold tracking-tight">{value}</p></div>
    </div>
  )
}
