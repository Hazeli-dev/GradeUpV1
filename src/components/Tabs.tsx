import { cn } from '@/lib/utils'

export default function Tabs({ tabs, value, onChange }: { tabs: string[]; value: string; onChange: (t: string) => void }) {
  return (
    <div role="tablist" className="flex gap-1 overflow-x-auto rounded-xl bg-soft/50 p-1">
      {tabs.map((t) => (
        <button key={t} role="tab" aria-selected={value === t} onClick={() => onChange(t)}
          className={cn('whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors', value === t ? 'bg-surface shadow-card' : 'text-muted hover:text-text')}>
          {t}
        </button>
      ))}
    </div>
  )
}
