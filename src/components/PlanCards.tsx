import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { plans } from '@/data/demo'
import { cn } from '@/lib/utils'

export default function PlanCards() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {plans.map((p) => (
        <div key={p.id} className={cn('card relative flex flex-col p-6', p.popular && 'border-primary ring-2 ring-primary/30')}>
          {p.popular && <span className="gradient-brand absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-bold text-white">POPULAR</span>}
          <h3 className="font-bold">{p.name}</h3>
          <p className="mt-3 text-3xl font-extrabold tracking-tight">{p.price}</p>
          <p className="text-sm text-muted">{p.period}</p>
          <ul className="my-5 flex-1 space-y-2 text-sm">
            {p.perks.map((perk) => <li key={perk} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-secondary" />{perk}</li>)}
          </ul>
          <Link to="/register" className={p.popular ? 'btn-primary' : 'btn-ghost border border-border'}>{p.id === 'free' ? 'Mulai Gratis' : 'Pilih Paket'}</Link>
        </div>
      ))}
    </div>
  )
}
