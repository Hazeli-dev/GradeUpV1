import { Check, Minus } from 'lucide-react'
import { comparison, plans } from '@/data/demo'
import PlanCards from '@/components/PlanCards'
import PageHeader from '@/components/PageHeader'

export default function Pricing() {
  return (
    <>
      <PageHeader title="Harga" subtitle="Mulai gratis, upgrade saat kamu butuh akses penuh." />
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-12">
        <PlanCards />
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead><tr className="border-b border-border"><th className="p-4">Fitur</th>{plans.map((p) => <th key={p.id} className="p-4">{p.name}</th>)}</tr></thead>
            <tbody>
              {comparison.map((r) => (
                <tr key={r.feature} className="border-b border-border last:border-0">
                  <td className="p-4 font-medium">{r.feature}</td>
                  {r.values.map((v, i) => (
                    <td key={i} className="p-4">{typeof v === 'string' ? v : v ? <Check size={16} className="text-secondary" aria-label="Termasuk" /> : <Minus size={16} className="text-muted" aria-label="Tidak termasuk" />}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
