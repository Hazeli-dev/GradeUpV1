import type { ReactNode } from 'react'

export default function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="card p-5">
      <h3 className="mb-4 text-sm font-bold">{title}</h3>
      <div className="h-64">{children}</div>
    </div>
  )
}

export const chartColors = ['#0F766E', '#10B981', '#34D399', '#99F6E4']
export const tooltipStyle = { background: 'rgb(var(--surface))', border: '1px solid rgb(var(--border))', borderRadius: 12, fontSize: 12 }
export const axisProps = { stroke: '#94a3b8', fontSize: 12, tickLine: false, axisLine: false } as const
