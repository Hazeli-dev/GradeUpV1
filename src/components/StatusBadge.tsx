import { cn } from '@/lib/utils'

const good = ['Aktif', 'Terbit', 'Berhasil', 'Premium']
const warn = ['Draf', 'Menunggu']

export default function StatusBadge({ label }: { label: string }) {
  const tone = good.includes(label) ? 'bg-secondary/15 text-primary' : warn.includes(label) ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400' : label === 'Gratis' ? 'bg-border text-muted' : 'bg-red-500/15 text-red-600 dark:text-red-400'
  return <span className={cn('inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold', tone)}>{label}</span>
}
