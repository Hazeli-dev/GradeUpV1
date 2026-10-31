import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Download } from 'lucide-react'
import { monthly } from '@/data/admin'
import ChartCard, { axisProps, tooltipStyle } from '@/components/ChartCard'
import { useToast } from '@/components/Toast'
import { downloadCsv } from '@/utils/csv'

const ranges = { '3 bulan': 3, '6 bulan': 6, '12 bulan': 12 } as const
const grid = <CartesianGrid stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />

export default function Reports() {
  const toast = useToast()
  const [range, setRange] = useState<keyof typeof ranges>('6 bulan')
  const data = monthly.slice(-ranges[range])
  const exportCsv = () => {
    downloadCsv(`laporan-gradeup-demo-${range.replace(' ', '-')}.csv`, [['Bulan', 'Pendapatan (juta Rp)', 'Pengguna baru', 'Konversi premium (%)', 'Ujian dikerjakan'], ...data.map((d) => [d.bulan, d.pendapatan, d.pengguna, d.konversi, d.ujian])])
    toast('CSV demo diunduh')
  }
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">Laporan & Analitik</h1>
        <div className="flex gap-2">
          <select className="input w-36" value={range} onChange={(e) => setRange(e.target.value as keyof typeof ranges)} aria-label="Rentang waktu">{Object.keys(ranges).map((r) => <option key={r}>{r}</option>)}</select>
          <button className="btn-primary" onClick={exportCsv}><Download size={16} />Ekspor CSV</button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Pendapatan (juta Rp)"><ResponsiveContainer><BarChart data={data}>{grid}<XAxis dataKey="bulan" {...axisProps} /><YAxis {...axisProps} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="pendapatan" name="Pendapatan" fill="#0F766E" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Pengguna baru"><ResponsiveContainer><LineChart data={data}>{grid}<XAxis dataKey="bulan" {...axisProps} /><YAxis {...axisProps} /><Tooltip contentStyle={tooltipStyle} /><Line type="monotone" dataKey="pengguna" name="Pengguna baru" stroke="#10B981" strokeWidth={3} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Konversi ke Premium (%)"><ResponsiveContainer><LineChart data={data}>{grid}<XAxis dataKey="bulan" {...axisProps} /><YAxis {...axisProps} /><Tooltip contentStyle={tooltipStyle} /><Line type="monotone" dataKey="konversi" name="Konversi" stroke="#34D399" strokeWidth={3} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Ujian dikerjakan"><ResponsiveContainer><BarChart data={data}>{grid}<XAxis dataKey="bulan" {...axisProps} /><YAxis {...axisProps} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="ujian" name="Ujian" fill="#10B981" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
      </div>
      <p className="text-xs text-muted">Data contoh (demo). Ekspor CSV berisi data contoh yang sama, bukan data produksi.</p>
    </div>
  )
}
