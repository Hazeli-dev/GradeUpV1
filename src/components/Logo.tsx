import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Logo({ to = '/', compact = false, light = false }: { to?: string; compact?: boolean; light?: boolean }) {
  return (
    <Link to={to} className="flex items-center gap-2.5" aria-label="GradeUp">
      <span className="gradient-brand grid h-9 w-9 place-items-center rounded-xl text-white shadow-card">
        <GraduationCap size={20} />
      </span>
      {!compact && <span className={cn('text-lg font-extrabold tracking-tight', light && 'text-white')}>GradeUp</span>}
    </Link>
  )
}
